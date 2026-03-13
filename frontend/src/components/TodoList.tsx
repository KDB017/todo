import { useState } from 'react';
import type { Todo } from '../hooks/useWebSocket';

interface Props {
  todos: Todo[];
  onAdd: (title: string) => void;
  onComplete: (todoId: string) => void;
  onUncomplete: (todoId: string) => void;
}

export function TodoList({ todos, onAdd, onComplete, onUncomplete }: Props) {
  const [input, setInput] = useState('');

  function handleAdd() {
    const title = input.trim();
    if (!title) {
      return;
    }
    onAdd(title);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleAdd();
    }
  }

  function handleToggle(todo: Todo) {
    if (todo.completed) {
      onUncomplete(todo.id);
    } else {
      onComplete(todo.id);
    }
  }

  return (
    <div>
      <div>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='新しいTodoを入力'
        />
        <button onClick={handleAdd}>追加</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
