import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TaskBoard from '../src/TaskBoard.jsx'
import * as api from '../src/api.js'

vi.mock('../src/api.js')

const seedTasks = [
  { id: 1, title: 'Write onboarding doc', done: false },
  { id: 2, title: 'Review PR', done: true }
]

beforeEach(() => {
  vi.clearAllMocks()
  api.fetchTasks.mockResolvedValue([...seedTasks])
  api.saveTask.mockImplementation((task) =>
    Promise.resolve({ id: 99, title: task.title, done: !!task.done })
  )
  api.updateTask.mockImplementation((id, changes) =>
    Promise.resolve({ id, ...changes })
  )
  api.deleteTask.mockResolvedValue({ success: true })
})

describe('TaskBoard', () => {
  it('loads tasks from the API on mount', async () => {
    render(<TaskBoard />)

    expect(api.fetchTasks).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.getByText('Write onboarding doc')).toBeInTheDocument()
      expect(screen.getByText('Review PR')).toBeInTheDocument()
    })

    // The hardcoded placeholder task should never appear.
    expect(screen.queryByText('Placeholder task')).not.toBeInTheDocument()
  })

  it('persists a new task via the API and renders it', async () => {
    const user = userEvent.setup()
    render(<TaskBoard />)
    await waitFor(() => expect(api.fetchTasks).toHaveBeenCalled())

    await user.type(screen.getByPlaceholderText('New task title'), 'Ship feature')
    await user.click(screen.getByText('Add'))

    await waitFor(() => {
      expect(api.saveTask).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Ship feature' })
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Ship feature')).toBeInTheDocument()
    })

    // Original seed tasks must still be present (no mutation bugs
    // that clobber existing entries).
    expect(screen.getByText('Write onboarding doc')).toBeInTheDocument()
  })

  it('toggles a task via the API even when clicked twice quickly', async () => {
    const user = userEvent.setup()
    render(<TaskBoard />)
    await waitFor(() =>
      expect(screen.getByText('Write onboarding doc')).toBeInTheDocument()
    )

    const toggleButtons = screen.getAllByText('Toggle')
    // Click the same task's toggle twice back-to-back — a stale
    // closure over `tasks` would drop one of these updates.
    await user.click(toggleButtons[0])
    await user.click(toggleButtons[0])

    await waitFor(() => {
      expect(api.updateTask).toHaveBeenCalledTimes(2)
    })
    expect(api.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ done: true }))
  })

  it('deletes a task via the API and removes it from the list', async () => {
    const user = userEvent.setup()
    render(<TaskBoard />)
    await waitFor(() =>
      expect(screen.getByText('Review PR')).toBeInTheDocument()
    )

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[1])

    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith(2)
    })
    expect(screen.queryByText('Review PR')).not.toBeInTheDocument()
  })
})
