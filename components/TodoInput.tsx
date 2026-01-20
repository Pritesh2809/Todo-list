
import React, { useState } from 'react';
import { Priority } from '../types';

interface TodoInputProps {
  onAdd: (text: string, priority: Priority) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), priority);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center gap-2"
          >
            <span>Add</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-3 px-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority:</span>
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all border-2 ${
                priority === p 
                  ? p === 'low' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : p === 'medium' ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default TodoInput;
