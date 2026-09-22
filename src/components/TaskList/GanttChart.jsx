import styles from './TaskList.module.css';

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(iso) {
  return new Date(iso + 'T00:00:00');
}

function daysBetween(a, b) {
  return Math.round((b - a) / DAY_MS);
}

function formatShort(date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function GanttChart({ tasks }) {
  // Only tasks with both a start and end date can be plotted
  const plottable = tasks.filter((t) => !t.completed && t.startDate && t.endDate);
  const unscheduled = tasks.filter((t) => !t.completed && (!t.startDate || !t.endDate));
  const unscheduledNotice = unscheduled.length > 0 && (
    <div>
      <p>These tasks need both start and end dates before they can be plotted:</p>
      <ul>
        {unscheduled.map((task) => <li key={task.id}>{task.title}</li>)}
      </ul>
    </div>
  );

  if (plottable.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nothing to plot yet.</p>
        <p className={styles.emptyStateSub}>
          Add start and end dates to a task to see it show up here.
        </p>
        {unscheduledNotice}
      </div>
    );
  }

  const starts = plottable.map((t) => toDate(t.startDate));
  const ends = plottable.map((t) => toDate(t.endDate));
  const rangeStart = new Date(Math.min(...starts));
  const rangeEnd = new Date(Math.max(...ends));
  const totalDays = Math.max(daysBetween(rangeStart, rangeEnd) + 1, 1);

  // Build day-tick labels: aim for roughly 8-10 ticks across the chart
  const tickEvery = Math.max(1, Math.ceil(totalDays / 9));
  const ticks = [];
  for (let d = 0; d <= totalDays; d += tickEvery) {
    const tickDate = new Date(rangeStart);
    tickDate.setDate(tickDate.getDate() + d);
    ticks.push({ offset: (d / totalDays) * 100, label: formatShort(tickDate) });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOffset =
    today >= rangeStart && today <= rangeEnd
      ? (daysBetween(rangeStart, today) / totalDays) * 100
      : null;

  // The today line is positioned within the full body, including labels.
  // Header ticks use percentages directly because the header is already inset.
  const trackPosition = (pct) => `calc(160px + (100% - 160px) * ${pct / 100})`;

  return (
    <div className={styles.gantt}>
      {unscheduledNotice}
      <div className={styles.ganttHeader}>
        {ticks.map((tick, i) => (
          <span
            key={i}
            className={styles.ganttTick}
            style={{ left: `${tick.offset}%` }}
          >
            {tick.label}
          </span>
        ))}
      </div>

      <div className={styles.ganttBody}>
        {todayOffset !== null && (
          <div
            className={styles.ganttToday}
            style={{ left: trackPosition(todayOffset) }}
          />
        )}
        {plottable.map((task) => {
          const start = toDate(task.startDate);
          const end = toDate(task.endDate);
          const left = (daysBetween(rangeStart, start) / totalDays) * 100;
          const width = ((daysBetween(start, end) + 1) / totalDays) * 100;
          return (
            <div className={styles.ganttRow} key={task.id}>
              <span className={styles.ganttRowLabel} title={task.title}>
                {task.title}
              </span>
              <div className={styles.ganttTrack}>
                <div
                  className={styles.ganttBar}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${formatShort(start)} → ${formatShort(end)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
