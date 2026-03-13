import { render, screen } from '@testing-library/react';
import { UserBoard } from '../../components/UserBoard';

const USERS = [
  { id: 'user1', nickname: 'Yuki', completed: 3, total: 10 },
  { id: 'user2', nickname: 'Taro', completed: 1, total: 5 },
];

describe('UserBoard', () => {
  it('全ユーザーのニックネームが表示される', () => {
    render(<UserBoard users={USERS} myUserId='user1' />);
    expect(screen.getByText(/Yuki/)).toBeInTheDocument();
    expect(screen.getByText(/Taro/)).toBeInTheDocument();
  });

  it('完了数と合計が「完了数 / 合計」の形式で表示される', () => {
    render(<UserBoard users={USERS} myUserId='user1' />);
    expect(screen.getByText(/3 \/ 10/)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 5/)).toBeInTheDocument();
  });

  it('自分のユーザーに「あなた」ラベルが付く', () => {
    render(<UserBoard users={USERS} myUserId='user1' />);
    expect(screen.getByText(/あなた/)).toBeInTheDocument();
  });

  it('他のユーザーに「あなた」ラベルは付かない', () => {
    render(<UserBoard users={USERS} myUserId='user1' />);
    const labels = screen.queryAllByText(/あなた/);
    expect(labels).toHaveLength(1);
  });

  it('ユーザーが空の場合は何も表示しない', () => {
    render(<UserBoard users={[]} myUserId='user1' />);
    expect(screen.queryByRole('listitem')).toBeNull();
  });
});
