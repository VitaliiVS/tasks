import { ApiCall } from './api.js'
import { Task } from './task.js'

export class Store {
    constructor() {
        this.tasks = []
    }

    uuid = () => {
        let date = new Date().getTime()
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (date + Math.random() * 16) % 16 | 0
            date = Math.floor(date / 16)
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
    
        return uuid
    }

    getData = async (url, token) => {
        const response = await fetch(url,{
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }})

        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)

            return this.tasks
        }
    }

    postData = async (url, data, token) => {
        const response = await fetch(url, new ApiCall('POST', data, token))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)

            return this.tasks
        }
    }

    putData = async (url, id, data, token) => {
        const response = await fetch(`${url}/${id}`, new ApiCall('PUT', data, token))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)

            return this.tasks
        }
    }

    addTask = (input, url, token) => {

        if (input.value.trim() === '') {
            return
        }

        const taskId = this.uuid()
        const task = new Task(taskId, input.value)

        return this.postData(url, task, token)
    }

    deleteTask = (id, url, token) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        const task = this.tasks[taskId]
        const internalId = task._id
        task.isDeleted = true
        delete task.editView
        delete task._id

        return this.putData(url, internalId, task, token)
    }

    completeTask = (id, url, token) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        const task = this.tasks[taskId]
        const internalId = task._id
        delete task.editView
        delete task._id

        if (task.isCompleted == true) {
            task.isCompleted = false
            return this.putData(url, internalId, task, token)
        }
        else if (task.isCompleted == false) {
            task.isCompleted = true
            return this.putData(url, internalId, task, token)
        }
    }

    editTask = (id, value, url, token) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        const task = this.tasks[taskId]
        const internalId = task._id


        if (task.editView == false) {
            this.tasks.forEach(task => task.editView = false)
            task.editView = true

            return this.tasks
        } else if (task.editView == true) {
            delete task.editView
            delete task._id
            task.taskLabel = value

            return this.putData(url, internalId, task, token)
        }
    }

    cancelEdit = () => {
        this.tasks.forEach(task => task.editView = false)

        return this.tasks
    }
}