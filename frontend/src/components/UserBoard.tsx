import type { PublicUser } from '../hooks/useWebSocket';

interface Props {
  users: PublicUser[];
  myUserId: string | null;
}

export function UserBoard({ users, myUserId }: Props) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <span>{user.nickname}</span>
          {user.id === myUserId && <span>（あなた）</span>}
          <span>{user.completed} / {user.total} 完了</span>
        </li>
      ))}
    </ul>
  );
}
