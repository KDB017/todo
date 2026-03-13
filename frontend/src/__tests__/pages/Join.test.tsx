import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Join } from '../../pages/Join';

describe('Join', () => {
  it('テキスト入力と参加ボタンが表示される', () => {
    render(<Join onJoin={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('ニックネームを入力して参加するとonJoinが呼ばれる', async () => {
    const onJoin = vi.fn();
    render(<Join onJoin={onJoin} />);
    await userEvent.type(screen.getByRole('textbox'), 'Yuki');
    await userEvent.click(screen.getByRole('button'));
    expect(onJoin).toHaveBeenCalledWith('Yuki');
  });

  it('空欄のまま参加するとonJoinが空文字で呼ばれる（ランダム名割り当て想定）', async () => {
    const onJoin = vi.fn();
    render(<Join onJoin={onJoin} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onJoin).toHaveBeenCalledWith('');
  });

  it('Enterキーで参加できる', async () => {
    const onJoin = vi.fn();
    render(<Join onJoin={onJoin} />);
    await userEvent.type(screen.getByRole('textbox'), 'Taro{Enter}');
    expect(onJoin).toHaveBeenCalledWith('Taro');
  });
});
