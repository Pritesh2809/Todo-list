
import React, { useState, useEffect, useCallback } from 'react';
import { Todo, Suggestion, Priority } from './types';
import { getTaskSuggestions, getSubtasks } from './services/geminiService';
import TodoInput from './components/TodoInput';
import TodoItem from './components/TodoItem';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('zendo_todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [breakingDownId, setBreakingDownId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('zendo_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((text: string, priority: Priority, category: string = 'General') => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      category
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleBreakdown = async (todo: Todo) => {
    setBreakingDownId(todo.id);
    try {
      const subs = await getSubtasks(todo.text);
      // Remove original, add subtasks
      setTodos(prev => prev.filter(t => t.id !== todo.id));
      subs.forEach(s => addTodo(s, todo.priority, `Subtask of: ${todo.text}`));
    } catch (e) {
      alert("AI was unable to breakdown this task right now.");
    } finally {
      setBreakingDownId(null);
    }
  };

  const handleGetSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const suggested = await getTaskSuggestions(todos);
      setSuggestions(suggested);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completionRate = todos.length > 0 
    ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen pb-20 px-4 md:px-0">
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 mb-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              Z
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ZenDo</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Efficiency</div>
               <div className="text-sm font-semibold text-indigo-600">{completionRate}% Done</div>
             </div>
             <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                <img src="https://picsum.photos/40/40" alt="Avatar" className="rounded-full" />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* Statistics Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-400 uppercase mb-1">Total</div>
            <div className="text-2xl font-bold text-slate-800">{todos.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-400 uppercase mb-1">Active</div>
            <div className="text-2xl font-bold text-indigo-600">{todos.filter(t => !t.completed).length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-400 uppercase mb-1">Done</div>
            <div className="text-2xl font-bold text-emerald-500">{todos.filter(t => t.completed).length}</div>
          </div>
        </div>

        <TodoInput onAdd={addTodo} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-200/50 rounded-xl w-fit">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="mb-10">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No tasks found in this view.</p>
              <p className="text-slate-400 text-sm">Add something new to get started!</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={toggleTodo} 
                onDelete={deleteTodo}
                onBreakdown={handleBreakdown}
                isBreakingDown={breakingDownId === todo.id}
              />
            ))
          )}
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800">Smart Suggestions</h3>
            </div>
            <button 
              onClick={handleGetSuggestions}
              disabled={isSuggesting}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50"
            >
              {isSuggesting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Thinking...
                </>
              ) : (
                'Refresh suggestions'
              )}
            </button>
          </div>

          <div className="space-y-3">
            {suggestions.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-slate-400 text-sm">Need some inspiration? Let Gemini suggest your next goals.</p>
                <button 
                  onClick={handleGetSuggestions}
                  className="mt-4 px-6 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  Generate AI Ideas
                </button>
              </div>
            ) : (
              suggestions.map((s, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-white/60 hover:bg-white border border-indigo-100 rounded-xl transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">{s.text}</span>
                    <span className="text-[10px] text-slate-400">{s.category} • {s.priority}</span>
                  </div>
                  <button 
                    onClick={() => {
                      addTodo(s.text, s.priority, s.category);
                      setSuggestions(prev => prev.filter((_, i) => i !== idx));
                    }}
                    className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-sm p-4 text-center text-xs text-slate-400 border-t border-slate-100">
        ZenDo &bull; Built with React & Gemini AI
      </footer>
    </div>
  );
};

export default App;
