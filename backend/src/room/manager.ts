import type { Room } from "./types.js";

const MAX_ROOM_SIZE = 10;
const rooms = new Map<string, Room>();

function generateId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function assignRoom(): Room {
  for (const room of rooms.values()) {
    if (room.users.size < MAX_ROOM_SIZE) {
      return room;
    }
  }
  const room: Room = { id: generateId(), users: new Map() };
  rooms.set(room.id, room);
  return room;
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

export function removeUserFromRoom(roomId: string, userId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;
  room.users.delete(userId);
  if (room.users.size === 0) {
    rooms.delete(roomId);
  }
}
