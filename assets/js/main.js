class EventEmitter {
    constructor() {
        this.events = {}
    }

    on = (eventName, callback) => {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }

        this.events[eventName].push(callback)

        return () => this.unsubscribe(eventName, callback)
    }

    emit = (eventName, data) => {
        const event = this.events[eventName]
        if (event) {
            event.forEach(callback => { callback.call(null, data) })
        }
    }

    unsubscribe = (eventName, callback) => {
        this.events[eventName] = this.events[eventName].filter(eventFn => callback !== eventFn)
    }
}

class Render {
    constructor() { }

    setAttributes(elem, attrs) {
        for (const key in attrs) {
            elem.setAttribute(key, attrs[key])
        }
    }

    createElem(props) {
        const elem = document.createElement(props.tag)
        if (props.classNames) {
            elem.classList.add(...props.classNames)
        }
        if (props.attributes) {
            this.setAttributes(elem, props.attributes)
        }
        if (props.textContent) {
            elem.textContent = props.textContent
        }
        if (props.value) {
            elem.value = props.value
        }

        return elem
    }
}

class Task {
    constructor(id, input) {
        this.taskId = id
        this.taskLabel = input
        this.isCompleted = false
        this.isDeleted = false
    }
}

class ApiCall {
    constructor(method, body) {
        this.method = method
        this.cache = 'no-cache'
        this.headers = {
            'Content-Type': 'application/json'
        }
        this.body = JSON.stringify(body)
    }
}

class Form extends Render {
    constructor(tag, classNames, textContent, listType) {
        super()

        this.title = {
            tag: tag,
            classNames: [classNames],
            textContent: textContent,
        }

        this.listType = listType
    }

    renderForm = () => {
        const title = super.createElem(this.title)
        const tasksContainer = super.createElem({
            tag: 'div',
            classNames: ['container']
        })
        const container = super.createElem({
            tag: 'div'
        })
        const tasksList = super.createElem({
            tag: 'ul',
            classNames: [this.listType]
        })
        const taskInput = super.createElem({
            tag: 'input',
            classNames: ['task-input'],
            attributes: { 'placeholder': 'What you want to do?' }
        })
        const createButton = super.createElem({
            tag: 'button',
            classNames: ['create-button', 'far', 'fa-plus-square']
        })

        document.title = this.title.textContent

        tasksContainer.append(taskInput)
        tasksContainer.append(createButton)
        tasksContainer.append(tasksList)

        container.append(title)
        container.append(tasksContainer)

        return container
    }

    render = (root) => {
        while (root.firstChild) {
            root.removeChild(root.firstChild)
        }
        const form = this.renderForm()
        root.append(form)
    }
}

class RenderTask extends Render {
    constructor() {
        super()
    }

    createTask = (task) => {

        if (task.isDeleted != true) {

            const complete = {
                tag: 'input',
                classNames: ['comp-button'],
                attributes: { 'type': 'checkbox', }
            }
            const container = {
                tag: 'li',
                classNames: ['task-container'],
                attributes: { 'data-id': task.taskId }
            }
            const label = {
                tag: 'p',
                classNames: ['task'],
                textContent: task.taskLabel
            }
            const edit = {
                tag: 'button',
                classNames: ['far']
            }
            const del = {
                tag: 'button',
                classNames: ['delete-button', 'far', 'fa-trash-alt'],

            }
            if (task.isCompleted == true) {
                complete.attributes['checked'] = ''
                label.classNames.push('completed')
                edit.classNames.push('disabled')
            }

            if (task.editView == true) {
                label.tag = 'input'
                label.classNames = ['edit-view']
                label.attributes = { 'type': 'text' }
                label.value = task.taskLabel

                edit.classNames.push('save-button', 'fa-save')

                del.classNames.push('disabled')
                del.attributes = { 'disabled': '' }

                complete.classNames.push('disabled')
                complete.attributes['disabled'] = ''
            } else if (task.editView == false) {
                edit.classNames.push('edit-button', 'fa-edit')
            }

            const taskContainer = super.createElem(container)
            const completeButton = super.createElem(complete)
            const taskLabel = super.createElem(label)
            const editButton = super.createElem(edit)
            const deleteButton = super.createElem(del)

            taskContainer.append(completeButton)
            taskContainer.append(taskLabel)
            taskContainer.append(editButton)
            taskContainer.append(deleteButton)

            return taskContainer
        }

        else return
    }

    render = (root, tasks) => {
        while (root.firstChild) {
            root.removeChild(root.firstChild)
        }
        for (const task of tasks) {
            const item = this.createTask(task)
            if (item != undefined) {
                root.append(item)
            }
        }
    }
}

class Store {
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

    getData = async (url) => {
        const response = await fetch(url)

        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)

            return this.tasks
        }
    }

    postData = async (url, data) => {
        const response = await fetch(url, new ApiCall('POST', data))
 
        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)

            return this.tasks
        }
    }

    putData = async (url, id, data) => {
        const response = await fetch(`${url}/${id}`, new ApiCall('PUT', data))

        if (response.ok) {
            const content = await response.json()
            this.tasks = content
            this.tasks.forEach(x => x.editView = false)

            return this.tasks
        }
    }

    addTask = (input, url) => {

        if (input.value.trim() === '') {
            return
        }

        const taskId = this.uuid()
        const task = new Task(taskId, input.value)

        return this.postData(url, task)
    }

    deleteTask = (id, url) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        const task = this.tasks[taskId]
        const internalId = task._id
        task.isDeleted = true
        delete task.editView
        delete task._id

        return this.putData(url, internalId, task)
    }

    completeTask = (id, url) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        const task = this.tasks[taskId]
        const internalId = task._id
        delete task.editView
        delete task._id

        if (task.isCompleted == true) {
            task.isCompleted = false
            return this.putData(url, internalId, task)
        }
        else if (task.isCompleted == false) {
            task.isCompleted = true
            return this.putData(url, internalId, task)
        }
    }

    editTask = (id, value, url) => {
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

            return this.putData(url, internalId, task)
        }
    }

    cancelEdit = () => {
        this.tasks.forEach(task => task.editView = false)

        return this.tasks
    }
}

const root = document.querySelector('.root')
const url = "http://127.0.0.1:3000/tasks"

const emitter = new EventEmitter()
const tasksForm = new Form('h1', 'header', 'Tasks', 'tasks-list')
const store = new Store()
const render = new RenderTask()

document.addEventListener('readystatechange', tasksForm.render(root))

const createButton = document.querySelector('.create-button')
const tasksList = document.querySelector('.tasks-list')
const tasksInput = document.querySelector('.task-input')

document.addEventListener('readystatechange', (async () => {
    const tasks = await store.getData(url)
    emitter.emit('list-changed', { tasks: tasks, root: tasksList })
})())

const unsubscribe = emitter.on('list-changed', data => {
    render.render(data.root, data.tasks)
})

createButton.addEventListener('click', async () => {
    const tasks = await store.addTask(tasksInput, url)

    if (tasks != undefined) {
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }

    tasksInput.value = ''
})

tasksInput.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        const tasks = await store.addTask(tasksInput, url)
        if (tasks != undefined) {
            emitter.emit('list-changed', { tasks: tasks, root: tasksList })
        }

        tasksInput.value = ''
    }
})

tasksList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
        const taskId = event.target.closest('li').dataset.id
        const tasks = await store.deleteTask(taskId, url)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})

tasksList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('comp-button')) {
        const taskId = event.target.closest('li').dataset.id
        const tasks = await store.completeTask(taskId, url)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})

tasksList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('edit-button')) {
        const taskId = event.target.closest('li').dataset.id
        const tasks = store.editTask(taskId)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    } else if (event.target.classList.contains('save-button')) {
        const taskId = event.target.closest('li').dataset.id
        const value = event.target.previousSibling.value
        const tasks = await store.editTask(taskId, value, url)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})

tasksList.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        const task = document.querySelector('.edit-view')
        const id = task.closest('li').dataset.id
        const value = task.value
        const tasks = await store.editTask(id, value, url)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        const tasks = store.cancelEdit()
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})