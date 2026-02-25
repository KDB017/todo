import { WebSocket } from "ws";
import {
  addTodo,
  addUser,
  assignRoom,
  getPublicUsers,
  getRoomUserIds,
  getUserRoomId,
  getUserTodos,
  removeUser,
  setTodoCompleted,
} from "../room/manager.js";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function randomNickname(): string {
  const names = ["Panda", "Tiger", "Fox", "Bear", "Wolf", "Eagle"];
  return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
}

const wsMap = new Map<string, WebSocket>();

async function broadcast(
  roomId: string,
  event: string,
  data: unknown,
  excludeUserId?: string,
): Promise<void> {
  const userIds = await getRoomUserIds(roomId);
  const msg = JSON.stringify({ event, data });
  for (const userId of userIds) {
    if (userId === excludeUserId) { continue; }
    const ws = wsMap.get(userId);
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}

export function handleConnection(ws: WebSocket): void {
  const userId = generateId();

  ws.on("message", async (raw) => {
    const { event, data } = JSON.parse(raw.toString());

    if (event === "join") {
      const nickname = (data.nickname as string | undefined)?.trim() || randomNickname();
      const roomId = await assignRoom();
      await addUser(roomId, userId, nickname);
      wsMap.set(userId, ws);

      const users = await getPublicUsers(roomId);
      ws.send(JSON.stringify({ event: "room:joined", data: { roomId, users } }));
      await broadcast(roomId, "user:joined", { nickname }, userId);
      return;
    }

    const roomId = await getUserRoomId(userId);
    if (!roomId) { return; }

    if (event === "todo:add") {
      const todoId = generateId();
      await addTodo(userId, todoId, data.title as string);
      const todos = await getUserTodos(userId);
      ws.send(JSON.stringify({ event: "todo:synced", data: { todos } }));
      const users = await getPublicUsers(roomId);
      await broadcast(roomId, "room:update", { users });
    } else if (event === "todo:complete") {
      await setTodoCompleted(data.todoId as string, true);
      const todos = await getUserTodos(userId);
      ws.send(JSON.stringify({ event: "todo:synced", data: { todos } }));
      const users = await getPublicUsers(roomId);
      await broadcast(roomId, "room:update", { users });
    } else if (event === "todo:uncomplete") {
      await setTodoCompleted(data.todoId as string, false);
      const todos = await getUserTodos(userId);
      ws.send(JSON.stringify({ event: "todo:synced", data: { todos } }));
      const users = await getPublicUsers(roomId);
      await broadcast(roomId, "room:update", { users });
    }
  });

  ws.on("close", async () => {
    wsMap.delete(userId);
    const roomId = await getUserRoomId(userId);
    if (!roomId) { return; }

    const users = await getPublicUsers(roomId);
    const me = users.find((u) => u.id === userId);
    await removeUser(userId);

    if (me) {
      await broadcast(roomId, "user:left", { nickname: me.nickname });
    }
  });
}
