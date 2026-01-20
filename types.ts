
export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
  category: string;
}

export interface Suggestion {
  text: string;
  category: string;
  priority: Priority;
}
