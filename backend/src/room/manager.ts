import { eq, sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { rooms, todos, users } from "../db/schema.js";
import type { PublicUser, Todo } from "./types.js";

const MAX_ROOM_SIZE = 10;

function generateId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export async function assignRoom(): Promise<string> {
  const result = await db
    .select({ id: rooms.id, userCount: sql<number>`count(${users.id})::int` })
    .from(rooms)
    .leftJoin(users, eq(users.roomId, rooms.id))
    .groupBy(rooms.id)
    .having(sql`count(${users.id}) < ${MAX_ROOM_SIZE}`);

  if (result.length > 0) {
    return result[0].id;
  }

  const id = generateId();
  await db.insert(rooms).values({ id });
  return id;
}

export async function addUser(roomId: string, userId: string, nickname: string): Promise<void> {
  await db.insert(users).values({ id: userId, nickname, roomId });
}

export async function removeUser(userId: string): Promise<void> {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) return;

  await db.delete(users).where(eq(users.id, userId));

  const remaining = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(eq(users.roomId, user.roomId));

  if (remaining[0].count === 0) {
    await db.delete(rooms).where(eq(rooms.id, user.roomId));
  }
}

export async function getUserRoomId(userId: string): Promise<string | null> {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  return user?.roomId ?? null;
}

export async function getPublicUsers(roomId: string): Promise<PublicUser[]> {
  const result = await db
    .select({
      id: users.id,
      nickname: users.nickname,
      completed: sql<number>`count(case when ${todos.completed} = true then 1 end)::int`,
      total: sql<number>`count(${todos.id})::int`,
    })
    .from(users)
    .leftJoin(todos, eq(todos.userId, users.id))
    .where(eq(users.roomId, roomId))
    .groupBy(users.id, users.nickname);

  return result;
}

export async function getRoomUserIds(roomId: string): Promise<string[]> {
  const result = await db.select({ id: users.id }).from(users).where(eq(users.roomId, roomId));
  return result.map((r) => r.id);
}

export async function addTodo(userId: string, todoId: string, title: string): Promise<void> {
  await db.insert(todos).values({ id: todoId, userId, title, completed: false });
}

export async function setTodoCompleted(todoId: string, completed: boolean): Promise<void> {
  await db.update(todos).set({ completed }).where(eq(todos.id, todoId));
}

export async function getUserTodos(userId: string): Promise<Todo[]> {
  const result = await db
    .select({ id: todos.id, title: todos.title, completed: todos.completed })
    .from(todos)
    .where(eq(todos.userId, userId));
  return result;
}
