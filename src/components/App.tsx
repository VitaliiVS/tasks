import React from 'react'
import LoginForm from './LoginForm'
import TasksForm from './TasksForm'
import { TasksProvider } from './TasksContext'

interface State {
  token: string
}

class App extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props)

    this.state = {
      token: ''
    }
  }

  componentDidMount() {
    if (document.cookie !== '') {
      const cookie = document.cookie
      const token = cookie.toString().slice(6)
      this.setState({ token })
    }
  }

  handleTokenChange = (token: string) => {
    this.setState({ token })
  }

  render() {
    const { handleTokenChange } = this
    const { token } = this.state

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
}

export default App
