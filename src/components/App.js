import React from 'react'
import LoginForm from './LoginForm'
import TasksForm from './TasksForm'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.handleTokenChange = this.handleTokenChange.bind(this)
        this.handleTasksChange = this.handleTasksChange.bind(this)

        this.state = {
            token: '',
            tasks: []
        }
    }

    componentDidMount() {
        if (document.cookie !== '') {
            const cookie = document.cookie
            const token = cookie.toString().slice(6)
            this.setState({ token })
        }
    }

    handleTokenChange(token) {
        this.setState({ token })
    }

    handleTasksChange(tasks) {
        this.setState({ tasks })
    }

    render() {
        if (this.state.token !== '') {
            return <TasksForm
                token={this.state.token}
                tasks={this.state.tasks}
                onTokenChange={this.handleTokenChange}
                onTasksChange={this.handleTasksChange}
            />
        } else {
            return <LoginForm
                onTokenChange={this.handleTokenChange}
            />
        }
    }
}

export default App