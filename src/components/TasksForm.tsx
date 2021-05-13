import React from 'react'
import TaskCard from './TaskCard'
import TasksContext from './TasksContext'
import { Task } from '../common/task'
import { debounce } from '../common/helpers'

interface TasksFormProps {
  token: string
  onTokenChange: (token: string) => void
}

interface TasksFormState {
  taskTitle: string
}

class TasksForm extends React.Component<TasksFormProps, TasksFormState> {
  handleAddTaskDebounced: () => void

  constructor(props: TasksFormProps) {
    super(props)

    this.handleAddTaskDebounced = debounce(this.handleAddTask, 200)
    this.state = {
      taskTitle: ''
    }
  }

  static contextType = TasksContext

  async componentDidMount(): Promise<void> {
    const { getTasks } = this.context
    const { token } = this.props

    try {
      await getTasks(token)
    } catch (e) {
      if (e.message === 'Unauthorized') {
        alert(e)
        this.handleLogout()
      } else {
        alert(e)
      }
    }
  }

  handleLogout = (): void => {
    const { onTokenChange } = this.props
    const token = ''
    document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
    onTokenChange(token)
  }

  handleTasksChange = async (
    action: string,
    taskId: string,
    taskTitle: string
  ): Promise<void> => {
    const { deleteTask, putTask } = this.context
    const { token } = this.props

    try {
      if (action === 'delete-button') {
        await deleteTask(taskId, token)
      } else {
        await putTask(taskId, token, action, taskTitle)
      }
    } catch (e) {
      if (e.message === 'Unauthorized') {
        alert(e)
        this.handleLogout()
      } else {
        alert(e)
      }
    }
  }

  handleAddTask = async (): Promise<void> => {
    const { postTask } = this.context
    const { taskTitle } = this.state
    const { token } = this.props

    if (taskTitle.trim() !== '') {
      try {
        await postTask(taskTitle, token)
        this.setState({ taskTitle: '' })
      } catch (e) {
        if (e.message === 'Unauthorized') {
          alert(e)
          this.handleLogout()
        } else {
          alert(e)
        }
      }
    }
  }

  handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ taskTitle: e.target.value })
  }

  handleKeyUp = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.handleAddTaskDebounced()
    }
  }

  render(): React.ReactNode {
    const {
      handleLogout,
      handleTaskNameChange,
      handleKeyUp,
      handleAddTaskDebounced,
      handleTasksChange
    } = this
    const { tasks } = this.context
    const { taskTitle } = this.state
    const disabled = taskTitle.trim().length === 0

    return (
      <div>
        <h1 className="header">Tasks</h1>
        <button onClick={handleLogout} className={'logout-button'}>
          Log out
        </button>
        <div className="container">
          <input
            value={taskTitle}
            onChange={handleTaskNameChange}
            onKeyUp={handleKeyUp}
            className="task-input"
            placeholder="What you want to do?"
          />
          <button
            onClick={handleAddTaskDebounced}
            className="create-button far fa-plus-square"
            disabled={disabled}
          />
          <ul className="tasks-list">
            {tasks.map((task: Task) => (
              <TaskCard
                onTasksChange={handleTasksChange}
                isCompleted={task.isCompleted}
                key={task.taskId}
                taskId={task.taskId}
                taskTitle={task.taskLabel}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default TasksForm
