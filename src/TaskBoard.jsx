import { useEffect, useState } from 'react'
import { fetchTasks, saveTask, updateTask, deleteTask } from './api.js'

export default function TaskBoard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  // BUG: this never loads real data from the server.
  useEffect(() => {
    setTasks([{ id: 0, title: 'Placeholder task', done: false }])
  }, [])

  function handleAdd() {
    if (!title.trim()) return

    // BUG: mutates state directly instead of creating a new array,
    // and never persists the task via the API.
    const newTask = { id: Date.now(), title, done: false }
    tasks.push(newTask)
    setTasks(tasks)
    setTitle('')
  }

  function handleToggle(id) {
    // BUG: stale closure — `tasks` here can be out of date if the
    // user toggles multiple tasks quickly, and this never calls
    // the API to persist the change.
    setTimeout(() => {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
      setTasks(updated)
    }, 0)
  }

  function handleDelete(id) {
    // BUG: only updates local state, never calls the API.
    setTasks(tasks.filter((t) => t.id !== id))
  }

  return (
    <div>
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.done ? 'line-through' : 'none' }}
            >
              {task.title}
            </span>
            <button onClick={() => handleToggle(task.id)}>Toggle</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
