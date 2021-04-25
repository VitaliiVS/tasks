import React from 'react'
import { ApiCall } from './api'
import { Task } from './task'
import { v4 as uuidv4 } from 'uuid'

const TasksContext = React.createContext<any>(null)

interface State {
  tasks: any[]
}

class TasksProvider extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props)

    this.state = {
      tasks: []
    }
  }

  getTasks = async (url: string, token: string) => {
    const apiCall: any = new ApiCall('GET', null, token)
    const response = await fetch(url, apiCall)

    if (response.ok) {
      const content = await response.json()
      this.setState({ tasks: content })
    } else if (response.status === 401) {
      throw new Error(`${response.statusText}`)
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  postTask = async (taskTitle: string, url: string, token: string) => {
    const taskId = uuidv4()
    const task = new Task(taskId, taskTitle)
    const apiCall: any = new ApiCall('POST', task, token)

    const response = await fetch(url, apiCall)

    if (response.ok) {
      const content = await response.json()
      this.setState({ tasks: content })
    } else if (response.status === 401) {
      throw new Error(`${response.statusText}`)
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  putTask = async (
    url: string,
    id: string,
    token: string,
    action: string,
    taskTitle: string
  ) => {
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

    const apiCall: any = new ApiCall('PUT', task, token)
    const response = await fetch(`${url}/${_id}`, apiCall)

    if (response.ok) {
      const content = await response.json()
      this.setState({ tasks: content })
    } else if (response.status === 401) {
      throw new Error(`${response.statusText}`)
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  deleteTask = async (url: string, id: string, token: string) => {
    const { tasks } = this.state
    const taskId = tasks.findIndex((x) => x.taskId === id)

    const task = tasks[taskId]
    const _id = task._id

    delete task._id

    const apiCall: any = new ApiCall('DELETE', null, token)
    const response = await fetch(`${url}/${_id}`, apiCall)

    if (response.ok) {
      const content = await response.json()
      this.setState({ tasks: content })
    } else if (response.status === 401) {
      throw new Error(`${response.statusText}`)
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  render() {
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
