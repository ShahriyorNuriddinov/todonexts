'use client';

import { useState, useEffect } from 'react';
import { todoAPI, Todo } from '@/lib/api';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadTodos();
    }
  }, [isLoggedIn]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoAPI.getAll();
      setTodos(data);
    } catch (error) {
      console.error('Xatolik:', error);
      alert('Vazifalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    if (username.trim()) {
      setCurrentUser(username);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', username);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setUsername('');
    setTodos([]);
    localStorage.removeItem('currentUser');
  };

  const addTodo = async () => {
    if (input.trim()) {
      try {
        setLoading(true);
        const newTodo = await todoAPI.create({
          text: input,
          completed: false,
          author: currentUser,
        });
        setTodos([...todos, newTodo]);
        setInput('');
      } catch (error) {
        console.error('Xatolik:', error);
        const errorMessage = error instanceof Error ? error.message : 'Noma\'lum xatolik';
        alert(`Vazifa qo'shishda xatolik: ${errorMessage}\n\nBrauzer konsolini tekshiring (F12)`);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      await todoAPI.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Xatolik:', error);
      alert('Vazifani o\'chirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (todo: Todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = async () => {
    if (editText.trim() && editId) {
      try {
        setLoading(true);
        const updated = await todoAPI.update(editId, { text: editText });
        setTodos(todos.map(todo => (todo.id === editId ? updated : todo)));
        setEditId(null);
        setEditText('');
      } catch (error) {
        console.error('Xatolik:', error);
        alert('Vazifani tahrirlashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleComplete = async (todo: Todo) => {
    try {
      setLoading(true);
      const updated = await todoAPI.update(todo.id, { completed: !todo.completed });
      setTodos(todos.map(t => (t.id === todo.id ? updated : t)));
    } catch (error) {
      console.error('Xatolik:', error);
      alert('Vazifa holatini o\'zgartirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = (todo: Todo) => todo.author === currentUser;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Vazifalar Ro'yxati
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Davom etish uchun ismingizni kiriting
          </p>
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Ismingiz..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={login}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Kirish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Vazifalar Ro'yxati
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">
              Salom, <span className="font-semibold">{currentUser}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Chiqish
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && addTodo()}
              placeholder="Yangi vazifa qo'shing..."
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <button
              onClick={addTodo}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Yuklanmoqda...' : 'Qo\'shish'}
            </button>
          </div>
        </div>

        {loading && todos.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            Yuklanmoqda...
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo)}
                    disabled={loading}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />

                  {editId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !loading && saveEdit()}
                      disabled={loading}
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1">
                      <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                        {todo.text}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Muallif: {todo.author}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {editId === todo.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          disabled={loading}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
                        >
                          Saqlash
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          disabled={loading}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
                        >
                          Bekor
                        </button>
                      </>
                    ) : (
                      <>
                        {canEdit(todo) && (
                          <>
                            <button
                              onClick={() => startEdit(todo)}
                              disabled={loading}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm disabled:opacity-50"
                            >
                              Tahrirlash
                            </button>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              disabled={loading}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                            >
                              O'chirish
                            </button>
                          </>
                        )}
                        {!canEdit(todo) && (
                          <span className="px-3 py-1 text-gray-400 text-sm italic">
                            Faqat ko'rish
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {todos.length === 0 && !loading && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                Hozircha vazifalar yo'q. Yuqorida yangi vazifa qo'shing!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
