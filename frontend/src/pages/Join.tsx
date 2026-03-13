import { useState } from 'react';

interface Props {
  onJoin: (nickname: string) => void;
}

export function Join({ onJoin }: Props) {
  const [nickname, setNickname] = useState('');

  function handleJoin() {
    onJoin(nickname);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleJoin();
    }
  }

  return (
    <div>
      <h1>Todo ルームに参加</h1>
      <input
        type='text'
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='ニックネーム（空欄でランダム）'
      />
      <button onClick={handleJoin}>参加する</button>
    </div>
  );
}
