import React from 'react'
import { ApiCall } from '../common/api'
import { Task } from '../common/task'
import { v4 as uuidv4 } from 'uuid'
import { tasksUrl } from '../common/config'

interface Context {
  tasks: Task[]
  getTasks: (token: string) => Promise<void>
  postTask: (taskTitle: string, token: string) => Promise<void>
  putTask: (
    id: string,
    token: string,
    action: string,
    taskTitle: string
  ) => Promise<void>
  deleteTask: (id: string, token: string) => Promise<void>
}

interface State {
  tasks: Task[]
}

const TasksContext = React.createContext<Partial<Context>>({})

class TasksProvider extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props)

    this.state = {
      tasks: []
    }
  }

  getTasks = async (token: string): Promise<void> => {
    const apiCall = new ApiCall('GET', null, token)
    const response = await fetch(tasksUrl, apiCall)

    if (response.ok) {
      const content = await response.json()
      this.setState({ tasks: content })
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  postTask = async (taskTitle: string, token: string): Promise<void> => {
    const taskId = uuidv4()
    const task = new Task(taskId, taskTitle)
    const apiCall = new ApiCall('POST', task, token)

    const response = await fetch(tasksUrl, apiCall)

    if (response.ok) {
      const content = await response.json()
      this.setState({ tasks: content })
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  putTask = async (
    id: string,
    token: string,
    action: string,
    taskTitle: string
  ): Promise<void> => {
    const { tasks } = this.state
    const taskId = tasks.findIndex((x) => x.taskId === id)
    const task = tasks[taskId]
    const _id = task._id
    delete task._id

    if (action === 'comp-button') {
      task.isCompleted ? (task.isCompleted = false) : (task.isCompleted = true)
    } else if (action === 'save-button' || action === 'edit-view') {
      task.taskLabel = taskTitle
    }

    const apiCall = new ApiCall('PUT', task, token)
    const response = await fetch(`${tasksUrl}/${_id}`, apiCall)

    if (response.ok) {
      const content = await response.json()
      this.setState({ tasks: content })
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  deleteTask = async (id: string, token: string): Promise<void> => {
    const { tasks } = this.state
    const taskId = tasks.findIndex((x) => x.taskId === id)

    const task = tasks[taskId]
    const _id = task._id

    delete task._id

    const apiCall = new ApiCall('DELETE', null, token)
    const response = await fetch(`${tasksUrl}/${_id}`, apiCall)

    if (response.ok) {
      const content = await response.json()
      this.setState({ tasks: content })
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  render(): React.ReactNode {
    const { getTasks, postTask, putTask, deleteTask } = this
    const { children } = this.props
    const { tasks } = this.state

    return (
      <TasksContext.Provider
        value={{
          tasks,
          getTasks,
          postTask,
          putTask,
          deleteTask
        }}
      >
        {children}
      </TasksContext.Provider>
    )
  }
}

export default TasksContext

export { TasksProvider }
