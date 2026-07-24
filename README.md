# Task Board

A React to-do list built for the YURS Software entrance task.

## Features
- **To-Do / Completed tabs** — separate views for open and finished tasks
- **Add Task** — title, description/notes, due date, and start/end date
- **Complete / Delete** — one-click toggle and removal
- **Gantt chart (unique feature)** — visual timeline of all incomplete tasks
  that have a start and end date, with a marker for today's date
- **Export JSON** — downloads all current tasks as a `.json` file
- Tasks persist across refreshes via `localStorage`

## Project structure
```
src/
  components/
    TaskList/
      TaskList.jsx        # main component: tabs, header, orchestration
      AddTaskForm.jsx      # modal form for creating a task
      TaskItem.jsx         # single task row (expand for details)
      GanttChart.jsx       # timeline view, the unique feature
      useTasks.js          # state + localStorage + CRUD logic
      TaskList.module.css  # all styling for the component tree
  App.jsx                 # renders <TaskList />
```

## Running locally
```
npm install
npm run dev
```

## Building
```
npm run build
```
