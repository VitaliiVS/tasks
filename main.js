class EventEmitter {
    constructor() {
        this.events = {}
    }

    on = (eventName, callback) => {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }

        this.events[eventName].push(callback)

        return () => {
            this.events[eventName] = this.events[eventName].filter(eventFn => callback !== eventFn)
        }
    }

    emit = (eventName, data) => {
        const event = this.events[eventName]
        if (event) {
            event.forEach(callback => { callback.call(null, data) })
        }
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
        this.editView = false
        this.isDeleted = false
    }
}

class Form extends Render {
    constructor(tag, classNames, textContent, listType, root) {
        super()

        this.title = {
            tag: tag,
            classNames: [classNames],
            textContent: textContent,
        }

        this.listType = listType
        this.root = root
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
            classNames: ['task-input']
        })
        const createButton = super.createElem({
            tag: 'button',
            classNames: ['create-button', 'far', 'fa-plus-square']
        })

        tasksContainer.append(taskInput)
        tasksContainer.append(createButton)
        tasksContainer.append(tasksList)

        container.append(title)
        container.append(tasksContainer)


        return container
    }

    render = () => {
        while (this.root.firstChild)
            this.root.removeChild(this.root.firstChild)
        const form = this.renderForm()
        this.root.append(form)
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

    addTask = (input) => {

        if (input.value.trim() === '') {
            return
        }

        const taskId = this.tasks.length + 1
        const task = new Task(taskId, input.value)

        this.tasks.push(task)

        return this.tasks
    }

    deleteTask = (id) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        this.tasks[taskId].isDeleted = true

        return this.tasks
    }

    completeTask = (id) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)

        if (this.tasks[taskId].isCompleted == true) {
            this.tasks[taskId].isCompleted = false
        }
        else if (this.tasks[taskId].isCompleted == false) {
            this.tasks[taskId].isCompleted = true
        }

        return this.tasks
    }

    editTask = (id, value) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        if (this.tasks[taskId].editView == false) {
            this.tasks.forEach(task => task.editView = false)
            this.tasks[taskId].editView = true
        } else if (this.tasks[taskId].editView == true) {
            this.tasks[taskId].editView = false
            this.tasks[taskId].taskLabel = value
        }

        return this.tasks
    }

    cancelEdit = () => {
        this.tasks.forEach(task => task.editView = false)

        return this.tasks
    }
}

const root = document.querySelector('.root')

const emitter = new EventEmitter()
const tasksForm = new Form('h1', 'header', 'Tasks', 'tasks-list', root)

document.addEventListener('readystatechange', tasksForm.render())

const createButton = document.querySelector('.create-button')
const tasksList = document.querySelector('.tasks-list')
const tasksInput = document.querySelector('.task-input')

const store = new Store()
const render = new RenderTask()

emitter.on('list-changed', data => {
    render.render(data.root, data.tasks)
})

createButton.addEventListener('click', () => {
    const tasks = store.addTask(tasksInput)
    if (tasks != undefined) {
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }

    tasksInput.value = ''
})

tasksInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const tasks = store.addTask(tasksInput)
        if (tasks != undefined) {
            emitter.emit('list-changed', { tasks: tasks, root: tasksList })
        }

        tasksInput.value = ''
    }
})

tasksList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const taskId = +event.target.closest('li').dataset.id
        const tasks = store.deleteTask(taskId)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})

tasksList.addEventListener('click', (event) => {
    if (event.target.classList.contains('comp-button')) {
        const taskId = +event.target.closest('li').dataset.id
        const tasks = store.completeTask(taskId)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})

tasksList.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-button')) {
        const taskId = +event.target.closest('li').dataset.id
        const tasks = store.editTask(taskId)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    } else if (event.target.classList.contains('save-button')) {
        const taskId = +event.target.closest('li').dataset.id
        const value = event.target.previousSibling.value
        const tasks = store.editTask(taskId, value)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})

tasksList.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const task = document.querySelector('.edit-view')
        const id = +task.closest('li').dataset.id
        const value = task.value
        const tasks = store.editTask(id, value)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        const tasks = store.cancelEdit()
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    }
})