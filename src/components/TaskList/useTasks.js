import { useState, useEffect } from 'react';

const STORAGE_KEY = 'todo-app-tasks';

// Generates a reasonably unique id without extra dependencies
function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * useTasks
 * Central place for all task data + operations (add, complete, delete).
 * Persists to localStorage so tasks survive a page refresh.
 */
export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask({ title, description, dueDate, startDate, endDate }) {
    const newTask = {
      id: makeId(),
      title: title.trim(),
      description: description?.trim() || '',
      dueDate: dueDate || null,
      startDate: startDate || null,
      endDate: endDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function exportTasks() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return { tasks, addTask, toggleComplete, deleteTask, exportTasks };
}
