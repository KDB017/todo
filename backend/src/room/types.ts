export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type PublicUser = {
  id: string;
  nickname: string;
  completed: number;
  total: number;
};
