
import React from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onBreakdown: (todo: Todo) => void;
  isBreakingDown: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onBreakdown, isBreakingDown }) => {
  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700'
  };

  return (
    <div className={`group flex items-center justify-between p-4 mb-3 bg-white border border-slate-200 rounded-xl transition-all hover:shadow-md ${todo.completed ? 'opacity-60 bg-slate-50' : ''}`}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => onToggle(todo.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <div className="flex flex-col">
          <span className={`text-slate-800 font-medium transition-all ${todo.completed ? 'line-through text-slate-400' : ''}`}>
            {todo.text}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className="text-[10px] text-slate-400">
              {todo.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onBreakdown(todo)}
          disabled={isBreakingDown || todo.completed}
          title="Break down with AI"
          className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg disabled:opacity-30"
        >
          <svg className={`w-5 h-5 ${isBreakingDown ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
