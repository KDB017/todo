import { WebSocket } from "ws";
import { assignRoom, getRoom, removeUserFromRoom } from "../room/manager.js";
import type { PublicUser, Room, User } from "../room/types.js";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function randomNickname(): string {
  const names = ["Panda", "Tiger", "Fox", "Bear", "Wolf", "Eagle"];
  return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
}

function getPublicUsers(room: Room): PublicUser[] {
  return Array.from(room.users.values()).map((u) => ({
    id: u.id,
    nickname: u.nickname,
    completed: u.todos.filter((t) => t.completed).length,
    total: u.todos.length,
  }));
}

const wsMap = new Map<string, WebSocket>();

function broadcast(room: Room, event: string, data: unknown, excludeUserId?: string): void {
  const msg = JSON.stringify({ event, data });
  for (const userId of room.users.keys()) {
    if (userId === excludeUserId) continue;
    const ws = wsMap.get(userId);
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}

export function handleConnection(ws: WebSocket): void {
  const userId = generateId();
  let roomId: string | null = null;

  ws.on("message", (raw) => {
    const { event, data } = JSON.parse(raw.toString());

    if (event === "join") {
      const room = assignRoom();
      roomId = room.id;
      wsMap.set(userId, ws);

      const user: User = {
        id: userId,
        nickname: data.nickname?.trim() || randomNickname(),
        todos: [],
      };
      room.users.set(userId, user);

      ws.send(JSON.stringify({
        event: "room:joined",
        data: { roomId: room.id, users: getPublicUsers(room) },
      }));

      broadcast(room, "user:joined", { nickname: user.nickname }, userId);
      return;
    }

    if (!roomId) return;
    const room = getRoom(roomId);
    if (!room) return;
    const user = room.users.get(userId);
    if (!user) return;

    if (event === "todo:add") {
      const todo = { id: generateId(), title: data.title as string, completed: false };
      user.todos.push(todo);
      ws.send(JSON.stringify({ event: "todo:synced", data: { todos: user.todos } }));
      broadcast(room, "room:update", { users: getPublicUsers(room) });
    } else if (event === "todo:complete") {
      const todo = user.todos.find((t) => t.id === data.todoId);
      if (todo) todo.completed = true;
      ws.send(JSON.stringify({ event: "todo:synced", data: { todos: user.todos } }));
      broadcast(room, "room:update", { users: getPublicUsers(room) });
    } else if (event === "todo:uncomplete") {
      const todo = user.todos.find((t) => t.id === data.todoId);
      if (todo) todo.completed = false;
      ws.send(JSON.stringify({ event: "todo:synced", data: { todos: user.todos } }));
      broadcast(room, "room:update", { users: getPublicUsers(room) });
    }
  });

  ws.on("close", () => {
    if (!roomId) return;
    wsMap.delete(userId);
    const room = getRoom(roomId);
    const nickname = room?.users.get(userId)?.nickname;
    removeUserFromRoom(roomId, userId);
    if (room && nickname) {
      broadcast(room, "user:left", { nickname });
    }
  });
}
