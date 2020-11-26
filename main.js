class Form {
    constructor(name, tag, type) {
        this.name = name
        this.title = document.createElement(tag)
        this.container = document.createElement('div')
        this.tasksList = document.createElement('ul')

        this.type = type
    }

    renderForm() {
        this.title.textContent = this.name
        this.title.classList.add('header')
        this.container.classList.add('container')
        this.container.append(this.tasksList)
        this.tasksList.classList.add(this.type)

        document.body.append(this.title)
        document.body.append(this.container)
    }
}

class TaskForm extends Form {
    constructor(name, tag, type) {
        super(name, tag, type)
        this.taskInput = document.createElement('input')
        this.createButton = document.createElement('button')
        this.editTaskInput = document.createElement('input')
    }

    renderTaskForm = () => {
        this.taskInput.classList.add('task-input')
        this.taskInput.setAttribute('type', 'text')
        this.createButton.classList.add('create-button', 'far', 'fa-plus-square')

        this.container.append(this.taskInput)
        this.container.append(this.createButton)

        super.renderForm()
    }

}

class Store {
    constructor(tasks, completed) {
        this.tasksList = tasks
        this.completedList = completed
        this.tasks = []
    }

    static renderTask = (task) => {

        const taskContainer = document.createElement('li')
        const taskLabel = document.createElement('p')
        const completeButton = document.createElement('input')
        const editButton = document.createElement('button')
        const deleteButton = document.createElement('button')
        const editTaskInput = document.createElement('input')

        editTaskInput.setAttribute('type', 'text')
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
            editButton.classList.add('hidden')
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

        return taskContainer
    }

    getTaskId = (task) => {
        const id = +task.dataset.id
        const taskIndex = this.tasks.findIndex(x => x.taskId === id)

        return taskIndex
    }

    update = () => {
        while (this.tasksList.firstChild) {
            this.tasksList.removeChild(this.tasksList.firstChild)
        }

        while (this.completedList.firstChild) {
            this.completedList.removeChild(this.completedList.firstChild)
        }

        for (const task of this.tasks) {
            if (task.isCompleted == false && task.isDeleted != true) {
                const item = Store.renderTask(task)
                this.tasksList.append(item)
            } else if (task.isCompleted == true && task.isDeleted != true) {
                const item = Store.renderTask(task)
                this.completedList.append(item)
            }
        }
    }

    createTask = () => {
        const task = {}
        const taskInput = document.querySelector('.task-input')
        task.taskId = this.tasks.length + 1

        task.taskLabel = taskInput.value
        task.isCompleted = false
        task.editView = false
        task.isDeleted = false

        if (task.taskLabel.trim() != '') {
            this.tasks.push(task)
            this.update()
            taskInput.value = ''
        }
    }

    completeTask = (event) => {
        const completeButton = event.target

        if (completeButton.classList.contains('comp-button')) {
            const task = event.target.closest('li')
            const taskId = this.getTaskId(task)

            if (completeButton.checked == true) {
                this.tasks[taskId].isCompleted = true
                this.update()
            }
            else if (completeButton.checked == false) {
                this.tasks[taskId].isCompleted = false
                this.update()
            }
        }

        else return
    }

    editTask = (event) => {
        const editButton = event.target

        if (editButton.classList.contains('edit-button')) {
            const task = event.target.closest('li')
            const taskId = this.getTaskId(task)

            this.tasks[taskId].editView = true
            tasksList.removeEventListener('click', this.editTask)
            tasksList.addEventListener('click', this.saveTask)
            this.update()
        }
        else return
    }

    saveTask = (event) => {
        const saveButton = event.target

        if (saveButton.classList.contains('save-button')) {
            const task = event.target.closest('li')
            const taskId = this.getTaskId(task)
            const newTaskValue = task.children[1].value

            this.tasks[taskId].editView = false
            this.tasks[taskId].taskLabel = newTaskValue
            tasksList.removeEventListener('click', this.saveTask)
            tasksList.addEventListener('click', this.editTask)
            this.update()
        }
        else return
    }

    deleteTask = (event) => {

        if (event.target.classList.contains('delete-button')) {
            const task = event.target.closest('li')
            const taskId = this.getTaskId(task)

            this.tasks[taskId].isDeleted = true
            this.update()
        }
        else return
    }

}

const tasksForm = new TaskForm('Tasks', 'h1', 'tasks-list')
const completedForm = new Form('Completed Tasks', 'h2', 'completed-list')

tasksForm.renderTaskForm()
completedForm.renderForm()

const createButton = document.querySelector('.create-button')
const tasksList = document.querySelector('.tasks-list')
const completedList = document.querySelector('.completed-list')

const store = new Store(tasksList, completedList)

createButton.addEventListener('click', store.createTask)
tasksList.addEventListener('click', store.completeTask)
tasksList.addEventListener('click', store.editTask)
tasksList.addEventListener('click', store.deleteTask)

completedList.addEventListener('click', store.completeTask)
completedList.addEventListener('click', store.deleteTask)