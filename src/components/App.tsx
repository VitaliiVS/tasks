import React, { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import TasksForm from './TasksForm'
import { TasksProvider } from './TasksContext'

const App = (): JSX.Element => {
  const [token, setToken] = useState('')

  useEffect(() => {
    if (document.cookie !== '') {
      const cookie = document.cookie
      const token = cookie.toString().slice(6)
      setToken(token)
    }
  })

  const handleTokenChange = (token: string): void => {
    setToken(token)
  }

  if (token !== '') {
    return (
      <TasksProvider>
        <TasksForm token={token} onTokenChange={handleTokenChange} />
      </TasksProvider>
    )
  } else {
    return <LoginForm onTokenChange={handleTokenChange} />
  }
}

export default App
