import React from 'react'
import Task from './TaskCard'
import { Store } from './store.js'

const store = new Store()

class TasksForm extends React.Component {
    constructor(props) {
        super(props)

        this.handleLogout = this.handleLogout.bind(this)
        this.handleAddTask = this.handleAddTask.bind(this)
        this.handleTasksChange = this.handleTasksChange.bind(this)

        this.tasksUrl = 'http://127.0.0.1:3000/tasks'
        this.state = {
            tasks: [],
            taskTitle: ''
        }
    }

    async componentDidMount() {
        const tasks = await store.getData(this.tasksUrl, this.props.token)

        if (tasks instanceof Error) {
            this.handleLogout()
            alert('Not authorized')
        } else {
            this.setState({ tasks })
        }
    }

    async handleAddTask() {
        if (this.state.taskTitle.trim() !== '') {
            const tasks = await store.postData(this.state.taskTitle, this.tasksUrl, this.props.token)

            if (tasks instanceof Error) {
                this.handleLogout()
                alert('Not authorized')
            } else {
                this.setState({ tasks })
                this.setState({ taskTitle: '' })
            }
        }
    }

    async handleTasksChange(action, taskId, taskTitle) {
        const tasks = await store.putData(this.tasksUrl, taskId, this.props.token, action, taskTitle)

        if (tasks instanceof Error) {
            this.handleLogout()
            alert('Not authorized')
        } else {
            this.setState({ tasks })
        }
    }

    handleLogout() {
        const token = ''
        document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
        this.props.onTokenChange(token)
    }

    render() {
        const tasks = this.state.tasks
        const listItems = tasks.map(task =>
            <Task
                onTasksChange={this.handleTasksChange}
                isCompleted={task.isCompleted}
                editView={task.editView}
                key={task.taskId}
                taskId={task.taskId}
                taskTitle={task.taskLabel}
            />
        )

        return (
            <div>
                <h1 className="header">Tasks</h1>
                <button onClick={this.handleLogout} className={"logout-button"}>Log out</button>
                <div className="container">
                    <input
                        value={this.state.taskTitle}
                        onChange={(e) => this.setState({ taskTitle: e.target.value })}
                        onKeyUp={(e) => { if (e.key === 'Enter') this.handleAddTask() }}
                        className="task-input"
                        placeholder="What you want to do?"
                    />
                    <button onClick={this.handleAddTask} className={"create-button far fa-plus-square"} />
                    <ul className="tasks-list">
                        {listItems}
                    </ul>
                </div>
            </div>
        )
    }
}

export default TasksForm