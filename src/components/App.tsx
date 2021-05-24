import React, { useContext, useEffect } from 'react'

import LoginForm from './LoginForm/LoginForm'
import TasksForm from './TasksForm/TasksForm'
import { SessionContext, SessionContextProps } from './TasksContext'

const App = (): JSX.Element => {
  const { token, setToken } = useContext(SessionContext) as SessionContextProps

  useEffect(() => {
    if (document.cookie !== '') {
      const cookie = document.cookie
      const token = cookie.toString().slice(6)
      setToken(token)
    }
  }, [])

  if (token !== '') {
    return <TasksForm />
  } else {
    return <LoginForm />
  }
}

export default App
