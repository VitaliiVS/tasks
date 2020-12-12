class EventEmitter {
    constructor() {
        this.events = {}
    }

    on(eventName, fn) {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }

        this.events[eventName].push(fn)

        return () => {
            this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn)
        }
    }

    emit(eventName, data) {
        const event = this.events[eventName]
        if (event) {
            event.forEach(fn => { fn.call(null, data) })
        }
    }
}

class Form {
    constructor(name, tag, type) {
        this.name = name
        this.title = document.createElement(tag)
        this.container = document.createElement('div')
        this.tasksList = document.createElement('ul')
        this.taskInput = document.createElement('input')
        this.createButton = document.createElement('button')
        this.editTaskInput = document.createElement('input')

        this.type = type
    }

    renderForm() {
        this.taskInput.classList.add('task-input')
        this.taskInput.setAttribute('type', 'text')
        this.createButton.classList.add('create-button', 'far', 'fa-plus-square')
        this.container.append(this.taskInput)
        this.container.append(this.createButton)
        this.title.textContent = this.name
        this.title.classList.add('header')
        this.container.classList.add('container')
        this.container.append(this.tasksList)
        this.tasksList.classList.add(this.type)

        document.body.append(this.title)
        document.body.append(this.container)
    }
}

class Render {
    constructor(tasksList) {
        this.tasksList = tasksList
    }

    createTask = (task) => {

        if (task.isDeleted != true) {
            const taskContainer = document.createElement('li')
            const taskLabel = document.createElement('p')
            const completeButton = document.createElement('input')
            const editButton = document.createElement('button')
            const deleteButton = document.createElement('button')
            const editTaskInput = document.createElement('input')

            editTaskInput.setAttribute('type', 'text')
            editTaskInput.classList.add('edit-view')
            completeButton.setAttribute('type', 'checkbox')
            completeButton.classList.add('comp-button')
            editButton.classList.add('far')
            deleteButton.classList.add('delete-button', 'far', 'fa-trash-alt')
            taskContainer.classList.add('task-container')
            taskContainer.setAttribute('data-id', task.taskId)
            taskLabel.classList.add('task')

            if (task.isCompleted == true) {
                completeButton.setAttribute('checked', '')
                taskLabel.classList.add('completed')
                editButton.classList.add('disabled')
            }

            taskContainer.append(completeButton)

            if (task.editView == true) {
                editTaskInput.value = task.taskLabel
                editButton.classList.add('save-button', 'fa-save')
                deleteButton.classList.add('disabled')
                completeButton.classList.add('disabled')
                deleteButton.setAttribute('disabled', '')
                completeButton.setAttribute('disabled', '')
                taskContainer.append(editTaskInput)
            } else if (task.editView == false) {
                taskLabel.textContent = task.taskLabel
                editButton.classList.add('edit-button', 'fa-edit')
                taskContainer.append(taskLabel)
            }

            taskContainer.append(editButton)
            taskContainer.append(deleteButton)

            this.tasksList.append(taskContainer)
        }

        else return
    }

    render = (tasks) => {
        while (this.tasksList.firstChild) {
            this.tasksList.removeChild(this.tasksList.firstChild)
        }
        for (const task of tasks) {
            this.createTask(task)
        }
    }
}

class Store {
    constructor(input) {
        this.tasks = []
        this.input = input
    }

    addTask = (input) => {
        const task = {}

        task.taskId = this.tasks.length + 1
        task.taskLabel = input
        task.isCompleted = false
        task.editView = false
        task.isDeleted = false

        this.tasks.push(task)
    }

    deleteTask = (id) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)
        this.tasks[taskId].isDeleted = true
    }

    completeTask = (id) => {
        const taskId = this.tasks.findIndex(x => x.taskId === id)

        if (this.tasks[taskId].isCompleted == true) {
            this.tasks[taskId].isCompleted = false
        }
        else if (this.tasks[taskId].isCompleted == false) {
            this.tasks[taskId].isCompleted = true
        }
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
    }

    cancelEdit = () => {
        this.tasks.forEach(task => task.editView = false)
    }
}

const emitter = new EventEmitter()
const tasksForm = new Form('Tasks', 'h1', 'tasks-list')

tasksForm.renderForm()

const createButton = document.querySelector('.create-button')
const tasksList = document.querySelector('.tasks-list')
const tasksInput = document.querySelector('.task-input')

const store = new Store(tasksInput)
const render = new Render(tasksList)

emitter.on('list-changed', data => {
    render.render(data.tasks)
})

createButton.addEventListener('click', () => {
    if (tasksInput.value.trim() != '') {
        store.addTask(tasksInput.value)
        emitter.emit('list-changed', { tasks: store.tasks })
    }

    tasksInput.value = ''
})

tasksInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (tasksInput.value.trim() != '') {
            store.addTask(tasksInput.value)
            emitter.emit('list-changed', { tasks: store.tasks })
        }

        tasksInput.value = ''
    }
})

tasksList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const taskId = +event.target.closest('li').dataset.id
        store.deleteTask(taskId)
        emitter.emit('list-changed', { tasks: store.tasks })
    }
})

tasksList.addEventListener('click', (event) => {
    if (event.target.classList.contains('comp-button')) {
        const taskId = +event.target.closest('li').dataset.id
        store.completeTask(taskId)
        emitter.emit('list-changed', { tasks: store.tasks })
    }
})

tasksList.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-button')) {
        const taskId = +event.target.closest('li').dataset.id
        store.editTask(taskId)
        emitter.emit('list-changed', { tasks: store.tasks })
    } else if (event.target.classList.contains('save-button')) {
        const taskId = +event.target.closest('li').dataset.id
        const value = event.target.previousSibling.value
        store.editTask(taskId, value)
        emitter.emit('list-changed', { tasks: store.tasks })
    }
})

tasksList.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const task = document.querySelector('.edit-view')
        const id = +task.closest('li').dataset.id
        const value = task.value
        store.editTask(id, value)
        emitter.emit('list-changed', { tasks: store.tasks })
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
        store.cancelEdit()
        emitter.emit('list-changed', { tasks: store.tasks })
    }
})