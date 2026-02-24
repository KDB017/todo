import { describe, it, expect } from 'vitest'
import { assignRoom, getRoom, removeUserFromRoom } from '../../room/manager.js'

describe('assignRoom', () => {
  it('ルームが存在しない場合は新しいルームを作る', () => {
    const room = assignRoom()
    expect(room).toBeDefined()
    expect(room.id).toBeTruthy()
    expect(room.users.size).toBe(0)
  })

  it('空きのあるルームに再割り当てされる', () => {
    const room1 = assignRoom()
    const room2 = assignRoom()
    expect(room1.id).toBe(room2.id)
  })
})

describe('getRoom', () => {
  it('存在するroomIdで取得できる', () => {
    const room = assignRoom()
    expect(getRoom(room.id)).toBe(room)
  })

  it('存在しないroomIdはundefinedを返す', () => {
    expect(getRoom('nonexistent')).toBeUndefined()
  })
})

describe('removeUserFromRoom', () => {
  it('ユーザーを削除できる', () => {
    const room = assignRoom()
    room.users.set('user1', { id: 'user1', nickname: 'Test', todos: [] })
    removeUserFromRoom(room.id, 'user1')
    expect(room.users.has('user1')).toBe(false)
  })

  it('最後のユーザーが退出するとルームが削除される', () => {
    const room = assignRoom()
    room.users.set('user2', { id: 'user2', nickname: 'Test', todos: [] })
    removeUserFromRoom(room.id, 'user2')
    // 空になると新しいルームとして再利用されない(別IDで作られる)
    expect(getRoom(room.id)).toBeUndefined()
  })
})
