import { useState } from 'react';
import { Join } from './pages/Join';
import { Room } from './pages/Room';

type Page = 'join' | 'room';

export function App() {
  const [page, setPage] = useState<Page>('join');
  const [nickname, setNickname] = useState('');

  function handleJoin(name: string) {
    setNickname(name);
    setPage('room');
  }

  if (page === 'room') {
    return <Room nickname={nickname} />;
  }

  return <Join onJoin={handleJoin} />;
}
