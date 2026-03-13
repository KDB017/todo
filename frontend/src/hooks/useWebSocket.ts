import { useEffect, useRef, useState } from 'react';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface PublicUser {
  id: string;
  nickname: string;
  completed: number;
  total: number;
}

interface UseWebSocketReturn {
  connected: boolean;
  roomId: string | null;
  myUserId: string | null;
  users: PublicUser[];
  todos: Todo[];
  join: (nickname: string) => void;
  addTodo: (title: string) => void;
  completeTodo: (todoId: string) => void;
  uncompleteTodo: (todoId: string) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data as string);

      switch (type) {
        case 'room:joined':
          setRoomId(data.roomId);
          setMyUserId(data.userId);
          setUsers(data.users);
          break;
        case 'room:update':
          setUsers(data.users);
          break;
        case 'todo:synced':
          setTodos(data.todos);
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  function send(type: string, data: unknown) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  }

  function join(nickname: string) {
    send('join', { nickname });
  }

  function addTodo(title: string) {
    send('todo:add', { title });
  }

  function completeTodo(todoId: string) {
    send('todo:complete', { todoId });
  }

  function uncompleteTodo(todoId: string) {
    send('todo:uncomplete', { todoId });
  }

  return { connected, roomId, myUserId, users, todos, join, addTodo, completeTodo, uncompleteTodo };
}
