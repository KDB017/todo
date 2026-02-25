import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import { db } from '../../db/client.js'
import { rooms, todos, users } from '../../db/schema.js'
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
} from '../../room/manager.js'

async function cleanDb() {
  await db.delete(todos)
  await db.delete(users)
  await db.delete(rooms)
}

beforeEach(cleanDb)
afterEach(cleanDb)

describe('assignRoom', () => {
  it('ルームが存在しない場合は新しいルームを作る', async () => {
    const roomId = await assignRoom()
    expect(roomId).toBeTruthy()
    const result = await db.select().from(rooms).where(eq(rooms.id, roomId))
    expect(result).toHaveLength(1)
  })

  it('空きのあるルームに再割り当てされる', async () => {
    const roomId1 = await assignRoom()
    const roomId2 = await assignRoom()
    expect(roomId1).toBe(roomId2)
  })
})

describe('addUser / removeUser', () => {
  it('ユーザーを追加できる', async () => {
    const roomId = await assignRoom()
    await addUser(roomId, 'user1', 'Tester')
    const userIds = await getRoomUserIds(roomId)
    expect(userIds).toContain('user1')
  })

  it('ユーザーを削除できる', async () => {
    const roomId = await assignRoom()
    await addUser(roomId, 'user1', 'Tester')
    await removeUser('user1')
    const userIds = await getRoomUserIds(roomId)
    expect(userIds).not.toContain('user1')
  })

  it('最後のユーザーが退出するとルームが削除される', async () => {
    const roomId = await assignRoom()
    await addUser(roomId, 'user1', 'Tester')
    await removeUser('user1')
    const result = await db.select().from(rooms).where(eq(rooms.id, roomId))
    expect(result).toHaveLength(0)
  })
})

describe('getUserRoomId', () => {
  it('参加済みユーザーのroomIdを取得できる', async () => {
    const roomId = await assignRoom()
    await addUser(roomId, 'user1', 'Tester')
    expect(await getUserRoomId('user1')).toBe(roomId)
  })

  it('存在しないユーザーはnullを返す', async () => {
    expect(await getUserRoomId('nonexistent')).toBeNull()
  })
})

describe('Todo操作', () => {
  it('Todoを追加できる', async () => {
    const roomId = await assignRoom()
    await addUser(roomId, 'user1', 'Tester')
    await addTodo('user1', 'todo1', 'テストタスク')
    const userTodos = await getUserTodos('user1')
    expect(userTodos).toHaveLength(1)
    expect(userTodos[0].title).toBe('テストタスク')
    expect(userTodos[0].completed).toBe(false)
  })

  it('Todoを完了にできる', async () => {
    const roomId = await assignRoom()
    await addUser(roomId, 'user1', 'Tester')
    await addTodo('user1', 'todo1', 'テストタスク')
    await setTodoCompleted('todo1', true)
    const userTodos = await getUserTodos('user1')
    expect(userTodos[0].completed).toBe(true)
  })

  it('getPublicUsersで完了数が正しく集計される', async () => {
    const roomId = await assignRoom()
    await addUser(roomId, 'user1', 'Tester')
    await addTodo('user1', 'todo1', 'タスク1')
    await addTodo('user1', 'todo2', 'タスク2')
    await setTodoCompleted('todo1', true)
    const publicUsers = await getPublicUsers(roomId)
    expect(publicUsers).toHaveLength(1)
    expect(publicUsers[0].completed).toBe(1)
    expect(publicUsers[0].total).toBe(2)
  })
})
