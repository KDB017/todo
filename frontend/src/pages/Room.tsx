import { useEffect } from 'react';
import { TodoList } from '../components/TodoList';
import { UserBoard } from '../components/UserBoard';
import { useWebSocket } from '../hooks/useWebSocket';

interface Props {
  nickname: string;
}

export function Room({ nickname }: Props) {
  const { connected, roomId, myUserId, users, todos, join, addTodo, completeTodo, uncompleteTodo } =
    useWebSocket();

  useEffect(() => {
    if (connected) {
      join(nickname);
    }
  }, [connected]);

  if (!connected) {
    return <p>接続中...</p>;
  }

  if (!roomId) {
    return <p>ルームに参加中...</p>;
  }

  return (
    <div>
      <h1>ルーム: {roomId}</h1>
      <UserBoard users={users} myUserId={myUserId} />
      <TodoList
        todos={todos}
        onAdd={addTodo}
        onComplete={completeTodo}
        onUncomplete={uncompleteTodo}
      />
    </div>
  );
}
