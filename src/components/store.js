import { ApiCall } from './api.js'
import { Task } from './task.js'
import { uuid } from './uuid.js'

export class Store {
    constructor() {
        this.tasks = []
    }

    getData = async (url, token) => {
        const response = await fetch(url, new ApiCall('GET', null, token))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content

            return this.tasks
        } else if (response.status === 401) {
            return 'Not authorized'
        } else {
            throw Error(response.status)
        }
    }

    postData = async (taskTitle, url, token) => {
        const taskId = uuid()
        const task = new Task(taskId, taskTitle)
        const response = await fetch(url, new ApiCall('POST', task, token))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content

            return this.tasks
        } else if (response.status === 401) {
            return 'Not authorized'
        } else {
            throw Error(response.status)
        }
    }

    putData = async (url, id, token, action, taskTitle) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        const task = this.tasks[taskId]
        const _id = task._id
        delete task._id

        if (action === 'comp-button') {
            task.isCompleted ? task.isCompleted = false : task.isCompleted = true
        } else if (action === 'save-button' || action === 'edit-view') {
            task.taskLabel = taskTitle
        }

        const response = await fetch(`${url}/${_id}`, new ApiCall('PUT', task, token))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content

            return this.tasks
        } else if (response.status === 401) {
            return 'Not authorized'
        } else {
            throw Error(response.status)
        }
    }

    deleteData = async (url, id, token) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)

        const task = this.tasks[taskId]
        const _id = task._id

        delete task._id

        const response = await fetch(`${url}/${_id}`, new ApiCall('DELETE', null, token))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content

            return this.tasks
        } else if (response.status === 401) {
            return 'Not authorized'
        } else {
            throw Error(response.status)
        }
    }
}