import { ApiCall } from './api'
import { Task } from './task'
import { v4 as uuidv4 } from 'uuid'

export class Store {
	tasks: any[]

	constructor() {
		this.tasks = []
	}

	getData = async (url: string, token: string) => {
		const apiCall: any = new ApiCall('GET', null, token)
		const response = await fetch(url, apiCall)

		if (response.ok) {
			const content = await response.json()
			this.tasks = content

			return this.tasks
		} else if (response.status === 401) {
			return 'Not authorized'
		} else {
			throw new Error(`${response.status}`)
		}
	}

	postData = async (taskTitle: string, url: string, token: string) => {
		const taskId = uuidv4()
		const task = new Task(taskId, taskTitle)
		const apiCall: any = new ApiCall('POST', task, token)

		const response = await fetch(url, apiCall)

		if (response.ok) {
			const content = await response.json()
			this.tasks = content

			return this.tasks
		} else if (response.status === 401) {
			return 'Not authorized'
		} else {
			throw Error(`${response.status}`)
		}
	}

	putData = async (
		url: string,
		id: string,
		token: string,
		action: string,
		taskTitle: string
	) => {
		const taskId = this.tasks.findIndex((x) => x.taskId === id)
		const task = this.tasks[taskId]
		const _id = task._id
		delete task._id

		if (action === 'comp-button') {
			task.isCompleted
				? (task.isCompleted = false)
				: (task.isCompleted = true)
		} else if (action === 'save-button' || action === 'edit-view') {
			task.taskLabel = taskTitle
		}

		const apiCall: any = new ApiCall('PUT', task, token)
		const response = await fetch(`${url}/${_id}`, apiCall)

		if (response.ok) {
			const content = await response.json()
			this.tasks = content

			return this.tasks
		} else if (response.status === 401) {
			return 'Not authorized'
		} else {
			throw Error(`${response.status}`)
		}
	}

	deleteData = async (url: string, id: string, token: string) => {
		const taskId = this.tasks.findIndex((x) => x.taskId === id)

		const task = this.tasks[taskId]
		const _id = task._id

		delete task._id

		const apiCall: any = new ApiCall('DELETE', null, token)
		const response = await fetch(`${url}/${_id}`, apiCall)

		if (response.ok) {
			const content = await response.json()
			this.tasks = content

			return this.tasks
		} else if (response.status === 401) {
			return 'Not authorized'
		} else {
			throw Error(`${response.status}`)
		}
	}
}
