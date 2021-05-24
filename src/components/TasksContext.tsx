import React, { useState } from 'react'

import { ApiCall } from '../common/api'
import { Task } from '../common/task'
import { v4 as uuidv4 } from 'uuid'
import { tasksUrl } from '../common/config'

export interface TasksContextProps {
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

export interface SessionContextProps {
  token: string
  setToken: (token: string) => void
  login: (url: string, username: string, password: string) => Promise<void>
  register: (url: string, username: string, password: string) => Promise<void>
}

interface TasksProviderProps {
  children: JSX.Element
}

const TasksContext = React.createContext<Partial<TasksContextProps>>({})
const SessionContext = React.createContext<Partial<SessionContextProps>>({})
const apiCall = new ApiCall()

const ContextProvider = (props: TasksProviderProps): JSX.Element => {
  const [tasks, setTasks] = useState([])
  const [token, setToken] = useState('')
  const { children } = props

  const login = async (
    url: string,
    username: string,
    password: string
  ): Promise<void> => {
    const data = {
      username: username.toLowerCase(),
      password: password
    }
    const response = await apiCall.makeApiCall(url, 'POST', data)

    if (response.ok) {
      const content = await response.json()
      document.cookie = `token=${content.token}`

      setToken(content.token)
    } else if (response.status === 400) {
      throw new Error('Incorrect username or password')
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

  const register = async (
    url: string,
    username: string,
    password: string
  ): Promise<void> => {
    const data = {
      username: username.toLowerCase(),
      password: password,
      userId: uuidv4()
    }
    const response = await apiCall.makeApiCall(url, 'POST', data)

    if (response.ok) {
      const content = await response.json()
      document.cookie = `token=${content.token}`

      setToken(content.token)
    } else if (response.status === 409) {
      throw new Error('Username already in use')
    } else {
      throw new Error(`${response.statusText}`)
    }
  }

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

    if (action === 'complete') {
      task.isCompleted ? (task.isCompleted = false) : (task.isCompleted = true)
    } else if (action === 'save' || action === 'edit') {
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
      <SessionContext.Provider
        value={{
          token,
          setToken,
          login,
          register
        }}
      >
        {children}
      </SessionContext.Provider>
    </TasksContext.Provider>
  )
}

export { TasksContext, SessionContext, ContextProvider }
