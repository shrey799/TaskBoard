import { useState } from 'react';
import styles from './TaskList.module.css';

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate + 'T00:00:00') < today;
}

export default function TaskItem({ task, onToggle, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const overdue = isOverdue(task);

  return (
    <li className={styles.taskItem} data-completed={task.completed} data-overdue={overdue}>
      <button
        className={styles.checkbox}
        aria-label={task.completed ? 'Mark as not done' : 'Mark as done'}
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div className={styles.taskBody} onClick={() => setExpanded((e) => !e)}>
        <div className={styles.taskTopRow}>
          <span className={styles.taskTitle}>{task.title}</span>
          {task.dueDate && (
            <span className={styles.dueBadge} data-overdue={overdue}>
              due {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {expanded && (
          <div className={styles.taskDetails}>
            {task.description && <p className={styles.taskDesc}>{task.description}</p>}
            {(task.startDate || task.endDate) && (
              <p className={styles.taskTimeline}>
                {task.startDate ? formatDate(task.startDate) : '—'}
                {' → '}
                {task.endDate ? formatDate(task.endDate) : '—'}
              </p>
            )}
            {!task.description && !task.startDate && !task.endDate && (
              <p className={styles.taskDesc}>No additional details.</p>
            )}
          </div>
        )}
      </div>

      <button
        className={styles.deleteBtn}
        aria-label="Delete task"
        onClick={() => onDelete(task.id)}
      >
        ✕
      </button>
    </li>
  );
}
