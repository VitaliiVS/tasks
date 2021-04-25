import React from 'react'
import Task from './TaskCard'
import TasksContext from './TasksContext'
import { debounce } from 'lodash'
import { tasksUrl } from './config'

interface TasksFormProps {
  token: string
  onTokenChange: (token: string) => void
}

interface TasksFormState {
  taskTitle: string
}

class TasksForm extends React.Component<TasksFormProps, TasksFormState> {
  tasksUrl: string
  handleAddTaskDebounced: any

  constructor(props: TasksFormProps) {
    super(props)

    this.tasksUrl = tasksUrl
    this.handleAddTaskDebounced = debounce(this.handleAddTask, 200)
    this.state = {
      taskTitle: ''
    }
  }

  static contextType = TasksContext

  async componentDidMount() {
    const { getTasks } = this.context
    const { token } = this.props

    try {
      await getTasks(this.tasksUrl, token)
    } catch (e) {
      if (e.message === 'Unauthorized') {
        alert(e)
        this.handleLogout()
      } else {
        alert(e)
      }
    }
  }

  handleLogout = () => {
    const { onTokenChange } = this.props
    const token = ''
    document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
    onTokenChange(token)
  }

  handleTasksChange = async (
    action: string,
    taskId: string,
    taskTitle: string
  ) => {
    const { deleteTask, putTask } = this.context
    const { token } = this.props

    try {
      if (action === 'delete-button') {
        await deleteTask(this.tasksUrl, taskId, token)
      } else {
        await putTask(this.tasksUrl, taskId, token, action, taskTitle)
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

  handleAddTask = async () => {
    const { postTask } = this.context
    const { taskTitle } = this.state
    const { token } = this.props

    if (taskTitle.trim() !== '') {
      try {
        await postTask(taskTitle, this.tasksUrl, token)
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

  handleTaskNameChange = (e: any) => {
    this.setState({ taskTitle: e.target.value })
  }

  handleKeyUp = (e: any) => {
    if (e.key === 'Enter') {
      this.handleAddTaskDebounced()
    }
  }

  render() {
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
            {tasks.map((task: any) => (
              <Task
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
