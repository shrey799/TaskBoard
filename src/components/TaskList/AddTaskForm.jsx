import { useState } from 'react';
import styles from './TaskList.module.css';

const emptyForm = {
  title: '',
  description: '',
  dueDate: '',
  startDate: '',
  endDate: '',
};

export default function AddTaskForm({ onAdd, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setError('Give the task a title.');
      return;
    }
    if (!form.startDate || !form.endDate) {
      setError('Choose a start date and an end date.');
      return;
    }
    if (form.startDate > form.endDate) {
      setError('End date can\'t be before the start date.');
      return;
    }

    onAdd(form);
    setForm(emptyForm);
    setError('');
    onClose();
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.modalTitle}>New Task</h2>

        <label className={styles.label}>
          Title
          <input
            className={styles.input}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Wire up the drive motors"
            autoFocus
          />
        </label>

        <label className={styles.label}>
          Description / notes
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Any details worth remembering later"
            rows={3}
          />
        </label>

        <div className={styles.row}>
          <label className={styles.label}>
            Due date
            <input
              className={styles.input}
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            Start date
            <input
              className={styles.input}
              type="date"
              name="startDate"
              required
              value={form.startDate}
              onChange={handleChange}
            />
          </label>
          <label className={styles.label}>
            End date
            <input
              className={styles.input}
              type="date"
              name="endDate"
              required
              min={form.startDate || undefined}
              value={form.endDate}
              onChange={handleChange}
            />
          </label>
        </div>
        <p className={styles.hint}>
          Start and end dates are required to show this task on the Gantt view.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryBtn}>
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
