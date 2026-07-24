import { useState, useMemo } from 'react';
import styles from './TaskList.module.css';
import { useTasks } from './useTasks';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import GanttChart from './GanttChart';

const TABS = [
  { key: 'todo', label: 'To-Do' },
  { key: 'completed', label: 'Completed' },
  { key: 'gantt', label: 'Gantt' },
];

export default function TaskList() {
  const { tasks, addTask, toggleComplete, deleteTask, exportTasks } = useTasks();
  const [activeTab, setActiveTab] = useState('todo');
  const [showForm, setShowForm] = useState(false);

  const todoTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.appTitle}>Task Board</h1>
          <p className={styles.appSubtitle}>
            {todoTasks.length} open · {completedTasks.length} done
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={exportTasks}>
            Export JSON
          </button>
          <button className={styles.primaryBtn} onClick={() => setShowForm(true)}>
            + Add Task
          </button>
        </div>
      </header>

      <nav className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={styles.tab}
            data-active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        {activeTab === 'todo' && (
          todoTasks.length > 0 ? (
            <ul className={styles.list}>
              {todoTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onDelete={deleteTask}
                />
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <p>Nothing on your plate.</p>
              <p className={styles.emptyStateSub}>Add a task to get started.</p>
            </div>
          )
        )}

        {activeTab === 'completed' && (
          completedTasks.length > 0 ? (
            <ul className={styles.list}>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onDelete={deleteTask}
                />
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <p>No completed tasks yet.</p>
              <p className={styles.emptyStateSub}>Finished tasks will show up here.</p>
            </div>
          )
        )}

        {activeTab === 'gantt' && <GanttChart tasks={tasks} />}
      </main>

      {showForm && <AddTaskForm onAdd={addTask} onClose={() => setShowForm(false)} />}
    </div>
  );
}
