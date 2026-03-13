import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../../components/TodoList';

const TODOS = [
  { id: 'todo1', title: 'タスク1', completed: false },
  { id: 'todo2', title: 'タスク2', completed: true },
];

describe('TodoList', () => {
  it('全Todoのタイトルが表示される', () => {
    render(<TodoList todos={TODOS} onAdd={vi.fn()} onComplete={vi.fn()} onUncomplete={vi.fn()} />);
    expect(screen.getByText('タスク1')).toBeInTheDocument();
    expect(screen.getByText('タスク2')).toBeInTheDocument();
  });

  it('完了済みのTodoはチェックボックスがチェック状態', () => {
    render(<TodoList todos={TODOS} onAdd={vi.fn()} onComplete={vi.fn()} onUncomplete={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(checkboxes[0].checked).toBe(false);
    expect(checkboxes[1].checked).toBe(true);
  });

  it('タイトルを入力して追加ボタンを押すとonAddが呼ばれる', async () => {
    const onAdd = vi.fn();
    render(<TodoList todos={[]} onAdd={onAdd} onComplete={vi.fn()} onUncomplete={vi.fn()} />);
    await userEvent.type(screen.getByRole('textbox'), '新しいタスク');
    await userEvent.click(screen.getByRole('button', { name: /追加/ }));
    expect(onAdd).toHaveBeenCalledWith('新しいタスク');
  });

  it('追加後に入力欄がクリアされる', async () => {
    render(<TodoList todos={[]} onAdd={vi.fn()} onComplete={vi.fn()} onUncomplete={vi.fn()} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, '新しいタスク');
    await userEvent.click(screen.getByRole('button', { name: /追加/ }));
    expect(input.value).toBe('');
  });

  it('空欄のまま追加してもonAddは呼ばれない', async () => {
    const onAdd = vi.fn();
    render(<TodoList todos={[]} onAdd={onAdd} onComplete={vi.fn()} onUncomplete={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /追加/ }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('未完了のTodoをチェックするとonCompleteが呼ばれる', async () => {
    const onComplete = vi.fn();
    render(<TodoList todos={TODOS} onAdd={vi.fn()} onComplete={onComplete} onUncomplete={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    expect(onComplete).toHaveBeenCalledWith('todo1');
  });

  it('完了済みのTodoをチェック解除するとonUncompleteが呼ばれる', async () => {
    const onUncomplete = vi.fn();
    render(<TodoList todos={TODOS} onAdd={vi.fn()} onComplete={vi.fn()} onUncomplete={onUncomplete} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);
    expect(onUncomplete).toHaveBeenCalledWith('todo2');
  });
});
