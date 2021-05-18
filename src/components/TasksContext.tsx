import React, { useState } from 'react'
import { ApiCall } from '../common/api'
import { Task } from '../common/task'
import { v4 as uuidv4 } from 'uuid'
import { tasksUrl } from '../common/config'

export interface Context {
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

interface TasksProviderProps {
  children: JSX.Element
}

const TasksContext = React.createContext<Partial<Context>>({})
const apiCall = new ApiCall()

const TasksProvider = (props: TasksProviderProps): JSX.Element => {
  const [tasks, setTasks] = useState([])
  const { children } = props

  const getTasks = async (token: string): Promise<void> => {
    const response = await apiCall.makeApiCall(tasksUrl, 'GET', null, token)

    if (response.ok) {
      const content = await response.json()
      setTasks(content)
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  const postTask = async (taskTitle: string, token: string): Promise<void> => {
    const taskId = uuidv4()
    const task = new Task(taskId, taskTitle)
    const response = await apiCall.makeApiCall(tasksUrl, 'POST', task, token)

    if (response.ok) {
      const content = await response.json()
      setTasks(content)
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  const putTask = async (
    id: string,
    token: string,
    action: string,
    taskTitle: string
  ): Promise<void> => {
    const taskId = tasks.findIndex((x: Task) => x.taskId === id)
    const task: Task = tasks[taskId]
    const _id = task._id
    delete task._id

    if (action === 'comp-button') {
      task.isCompleted ? (task.isCompleted = false) : (task.isCompleted = true)
    } else if (action === 'save-button' || action === 'edit-view') {
      task.taskLabel = taskTitle
    }

    const response = await apiCall.makeApiCall(
      `${tasksUrl}/${_id}`,
      'PUT',
      task,
      token
    )

    if (response.ok) {
      const content = await response.json()
      setTasks(content)
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  const deleteTask = async (id: string, token: string): Promise<void> => {
    const taskId = tasks.findIndex((x: Task) => x.taskId === id)

    const task: Task = tasks[taskId]
    const _id = task._id

    delete task._id

    const response = await apiCall.makeApiCall(
      `${tasksUrl}/${_id}`,
      'DELETE',
      null,
      token
    )

    if (response.ok) {
      const content = await response.json()
      setTasks(content)
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

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

export default TasksContext

export { TasksProvider }
