import { EventEmitter } from './ee.js'
import { Render } from './render.js'
import { Store } from './store.js'
import { Session } from './session.js'

class LoginForm extends Render {
    constructor(tag, classNames, textContent) {
        super()

        this.title = {
            tag: tag,
            classNames: [classNames],
            textContent: textContent,
        }
    }

    renderLoginForm = () => {
        const title = super.createElem(this.title)
        const loginContainer = super.createElem({
            tag: 'div',
            classNames: ['login-container']
        })
        const container = super.createElem({
            tag: 'div'
        })
        const username = super.createElem({
            tag: 'input',
            classNames: ['name-input'],
            attributes: { 'type': 'text', 'placeholder': 'Username' }
        })
        const password = super.createElem({
            tag: 'input',
            classNames: ['pass-input'],
            attributes: { 'type': 'password', 'placeholder': 'Password' }
        })
        const loginButton = super.createElem({
            tag: 'button',
            classNames: ['login-button'],
            textContent: 'Login'
        })
        const registerButton = super.createElem({
            tag: 'button',
            classNames: ['register-button'],
            textContent: 'Register'
        })

        document.title = this.title.textContent

        loginContainer.append(username)
        loginContainer.append(password)
        loginContainer.append(loginButton)
        loginContainer.append(registerButton)

        container.append(title)
        container.append(loginContainer)

        return container
    }

    render = (root) => {
        while (root.firstChild) {
            root.removeChild(root.firstChild)
        }
        const form = this.renderLoginForm()
        root.append(form)
    }
}

class TasksForm extends Render {
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

        const logoutButton = super.createElem({
            tag: 'button',
            classNames: ['logout-button'],
            textContent: 'Log out'
        })

        document.title = this.title.textContent

        tasksContainer.append(taskInput)
        tasksContainer.append(createButton)
        tasksContainer.append(tasksList)

        container.append(title)
        container.append(logoutButton)
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

const root = document.querySelector('.root')

const loginUrl = "http://127.0.0.1:3000/auth"
const registerUrl = "http://127.0.0.1:3000/register"
const tasksUrl = "http://127.0.0.1:3000/tasks"

const login = new LoginForm('h1', 'header', 'Login or Register')
const tasksForm = new TasksForm('h1', 'header', 'Tasks', 'tasks-list')
const emitter = new EventEmitter()
const store = new Store()
const render = new RenderTask()
const session = new Session()


document.addEventListener('readystatechange', login.render(root))

const username = document.querySelector('.name-input')
const password = document.querySelector('.pass-input')
const loginButton = document.querySelector('.login-button')
const registerButton = document.querySelector('.register-button')

emitter.on('logged-in', data => {
    document.addEventListener('readystatechange', tasksForm.render(root))

    const createButton = document.querySelector('.create-button')
    const tasksList = document.querySelector('.tasks-list')
    const tasksInput = document.querySelector('.task-input')
    const logoutButton = document.querySelector('.logout-button')

    logoutButton.addEventListener('click', () => {
        document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        location.reload()
    })

    document.addEventListener('readystatechange', (async () => {
        const tasks = await store.getData(tasksUrl, data.token)
        emitter.emit('list-changed', { tasks: tasks, root: tasksList })
    })())

    const unsubscribe = emitter.on('list-changed', data => {
        render.render(data.root, data.tasks)
    })

    createButton.addEventListener('click', async () => {
        const tasks = await store.addTask(tasksInput, tasksUrl, data.token)

        if (tasks != undefined) {
            emitter.emit('list-changed', { tasks: tasks, root: tasksList })
        }

        tasksInput.value = ''
    })

    tasksInput.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter') {
            const tasks = await store.addTask(tasksInput, tasksUrl, data.token)
            if (tasks != undefined) {
                emitter.emit('list-changed', { tasks: tasks, root: tasksList })
            }

            tasksInput.value = ''
        }
    })

    tasksList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const taskId = event.target.closest('li').dataset.id
            const tasks = await store.deleteTask(taskId, tasksUrl, data.token)
            emitter.emit('list-changed', { tasks: tasks, root: tasksList })
        }
    })

    tasksList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('comp-button')) {
            const taskId = event.target.closest('li').dataset.id
            const tasks = await store.completeTask(taskId, tasksUrl, data.token)
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
            const tasks = await store.editTask(taskId, value, tasksUrl, data.token)
            emitter.emit('list-changed', { tasks: tasks, root: tasksList })
        }
    })

    tasksList.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter') {
            const task = document.querySelector('.edit-view')
            const id = task.closest('li').dataset.id
            const value = task.value
            const tasks = await store.editTask(id, value, tasksUrl, data.token)
            emitter.emit('list-changed', { tasks: tasks, root: tasksList })
        }
    })

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            const tasks = store.cancelEdit()
            emitter.emit('list-changed', { tasks: tasks, root: tasksList })
        }
    })
})

if (document.cookie === '') {
    loginButton.addEventListener('click', async () => {
        const login = await session.login(loginUrl, username.value, password.value)
        if (login != undefined) {
            const token = document.cookie
            emitter.emit('logged-in', { token: token.toString().slice(6) })
        } else {
            alert('Incorrect username or password')
        }
    })

    password.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter') {
            const login = await session.login(loginUrl, username.value, password.value)
            if (login != undefined) {
                const token = document.cookie
                emitter.emit('logged-in', { token: token.toString().slice(6) })
            } else {
                alert('Incorrect username or password')
            }
        }
    })

    registerButton.addEventListener('click', async () => {
        const register = await session.register(registerUrl, username.value, password.value)
        if (register != undefined) {
            const token = document.cookie
            emitter.emit('logged-in', { token: token.toString().slice(6) })
        } else {
            alert('User already exist')
        }
    })
} else {
    const token = document.cookie
    emitter.emit('logged-in', { token: token.toString().slice(6) })
}