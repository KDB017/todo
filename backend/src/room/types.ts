export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type User = {
  id: string;
  nickname: string;
  todos: Todo[];
};

export type Room = {
  id: string;
  users: Map<string, User>;
};

export type PublicUser = {
  id: string;
  nickname: string;
  completed: number;
  total: number;
};
