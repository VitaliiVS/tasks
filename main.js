class Form {
    constructor() {
        this.container = document.createElement('div')
        this.taskInput = document.createElement('input')
        this.createButton = document.createElement('button')
        this.tasksList = document.createElement('ul')
        this.editTaskInput = document.createElement('input')
    }


    static createTitle = (text) => {
        const title = document.createElement('h1')
        title.classList.add('header')
        title.textContent = text

        return title
    }

    renderTaskForm = (text) => {
        const title = Form.createTitle(text)

        this.container.classList.add('container')
        this.taskInput.classList.add('task-input')
        this.taskInput.setAttribute('type', 'text')
        this.createButton.classList.add('create-button', 'far', 'fa-plus-square')
        this.tasksList.classList.add('tasks-list')

        this.container.append(this.taskInput)
        this.container.append(this.createButton)
        this.container.append(this.tasksList)

        document.body.append(title)
        document.body.append(this.container)
    }
}

class Store {
    constructor(elem) {
        this.listElement = elem
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
            completeButton.setAttribute('checked','')
            taskLabel.classList.add('completed')
            editButton.classList.add('disabled')
            editButton.setAttribute('disabled', '')
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

    static getMaxId = (arr) => {
        const newArr = []
        arr.forEach(x => newArr.push(x.taskId))

        return Math.max.apply(null, newArr)
    }

    getTaskId = (task) => {
        const id = +task.dataset.id
        const taskIndex = this.tasks.findIndex(x => x.taskId === id)
        
        return taskIndex
    }

    update = () => {
        while (this.listElement.firstChild) {
            this.listElement.removeChild(this.listElement.firstChild)
        }
        for (const task of this.tasks) {
            const item = Store.renderTask(task) 
            this.listElement.append(item)
        }
    }

    createTask = () => {
        const task = {}
        const taskInput = document.querySelector('.task-input')
        task.taskId = this.tasks.length + 1

        if (this.tasks.some(x => x.taskId === task.taskId)) {
            task.taskId = Store.getMaxId(this.tasks) + 1
        }

        task.taskLabel = taskInput.value
        task.isCompleted = false
        task.editView = false

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

            this.tasks.splice(taskId, 1)
            this.update()
        }
        else return
    }

}

const form = new Form

form.renderTaskForm('Tasks')

const createButton = document.querySelector('.create-button')
const tasksList = document.querySelector('.tasks-list')

const store = new Store(tasksList)

createButton.addEventListener('click', store.createTask)
tasksList.addEventListener('click', store.completeTask)
tasksList.addEventListener('click', store.editTask)
tasksList.addEventListener('click', store.deleteTask)
