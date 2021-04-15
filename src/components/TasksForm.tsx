import React from 'react'
import Task from './TaskCard'
import { Store } from './store'
import { debounce } from 'lodash'
import { tasksUrl } from './config'

const store = new Store()

interface TasksFormProps {
	token: string
	onTokenChange: (token: string) => void
}

interface TasksFormState {
	tasks: any[]
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
			tasks: [],
			taskTitle: ''
		}
	}

	async componentDidMount() {
		const { token } = this.props
		const tasks = await store.getData(this.tasksUrl, token)

		if (tasks === 'Not authorized') {
			this.handleLogout()
			alert('Not authorized')
		} else {
			this.setState({ tasks })
		}
	}

	handleLogout = () => {
		const token = ''
		document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
		this.props.onTokenChange(token)
	}

	handleTasksChange = async (
		action: string,
		taskId: string,
		taskTitle: string
	) => {
		let tasks: any = {}
		const { token } = this.props

		if (action === 'delete-button') {
			tasks = await store.deleteData(this.tasksUrl, taskId, token)
		} else {
			tasks = await store.putData(
				this.tasksUrl,
				taskId,
				token,
				action,
				taskTitle
			)
		}

		if (tasks === 'Not authorized') {
			this.handleLogout()
			alert('Not authorized')
		} else {
			this.setState({ tasks })
		}
	}

	handleAddTask = async () => {
		const { taskTitle } = this.state
		const { token } = this.props

		if (taskTitle.trim() !== '') {
			const tasks = await store.postData(taskTitle, this.tasksUrl, token)

			if (tasks === 'Not authorized') {
				this.handleLogout()
				alert('Not authorized')
			} else {
				this.setState({ tasks })
				this.setState({ taskTitle: '' })
			}
		}
	}

	handleNewTaskChange = (e: any) => {
		this.setState({ taskTitle: e.target.value })
	}

	handleKeyUp = (e: any) => {
		if (e.key === 'Enter') {
			this.handleAddTaskDebounced()
		}
	}

	render() {
		const { tasks, taskTitle } = this.state
		const disabled = taskTitle.trim().length === 0

		return (
			<div>
				<h1 className="header">Tasks</h1>
				<button onClick={this.handleLogout} className={'logout-button'}>
					Log out
				</button>
				<div className="container">
					<input
						value={taskTitle}
						onChange={this.handleNewTaskChange}
						onKeyUp={this.handleKeyUp}
						className="task-input"
						placeholder="What you want to do?"
					/>
					<button
						onClick={this.handleAddTaskDebounced}
						className="create-button far fa-plus-square"
						disabled={disabled}
					/>
					<ul className="tasks-list">
						{tasks.map((task) => (
							<Task
								onTasksChange={this.handleTasksChange}
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
