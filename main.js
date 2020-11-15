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

        this.createButton.classList.add("create-button", "far", "fa-plus-square")

        this.tasksList.classList.add('tasks-list')

        this.container.append(this.taskInput)
        this.container.append(this.createButton)
        this.container.append(this.tasksList)

        document.body.append(title)
        document.body.append(this.container)
    }
}

class Task {
    constructor() {

    }

    static renderTask = () => {
        const taskContainer = document.createElement('li')
        const task = document.createElement('p')
        const taskInput = document.querySelector('.task-input')

        const completeButton = document.createElement('input')
        const editButton = document.createElement('button')
        const deleteButton = document.createElement('button')

        completeButton.setAttribute('type', 'checkbox')
        completeButton.classList.add("comp-button")
        editButton.classList.add("edit-button", "far", "fa-edit")
        deleteButton.classList.add("delete-button", "far", "fa-trash-alt")
        taskContainer.classList.add('task-container')
        task.classList.add('task')
        task.textContent = taskInput.value

        taskContainer.append(completeButton)
        taskContainer.append(task)
        taskContainer.append(editButton)
        taskContainer.append(deleteButton)

        return taskContainer
    }

    static getChildren = (elem) => {
        const children = []
        let child = elem.parentNode.firstChild

        while (child) {
            if (child.nodeType === 1 && child !== elem) {
                children.push(child)
            }
            child = child.nextSibling
        }

        return children
    }

    addTask = () => {
        const taskContainer = Task.renderTask()
        const tasksList = document.querySelector('.tasks-list')
        const taskInput = document.querySelector('.task-input')

        if (taskInput.value.trim() != '') {
            tasksList.append(taskContainer)
            taskInput.value = ''
        }
    }

    completeTask = (event) => {
        const completeButton = event.target
        const children = Task.getChildren(completeButton)

        if (completeButton.classList.contains('comp-button') && completeButton.checked == true) {
            children[0].classList.add("completed")
            children[1].classList.add("disabled")
            children[1].setAttribute('disabled', '')
        }
        else if (completeButton.classList.contains('comp-button') && completeButton.checked == false) {
            children[0].classList.remove("completed")
            children[1].classList.remove("disabled")
            children[1].removeAttribute('disabled', '')
        }
        else return
    }

    editTask = (event) => {
        const editButton = event.target

        if (editButton.classList.contains('edit-button')) {
            const children = Task.getChildren(editButton)
            const task = children[1]
            const deleteButtton = children[2]
            const completeButton = children[0]
            const editTaskInput = document.createElement('input')
            editTaskInput.setAttribute('type', 'text')

            editTaskInput.value = task.textContent
            task.replaceWith(editTaskInput)
            task.remove()
            editButton.classList.remove("edit-button", "fa-edit")
            editButton.classList.add("save-button", "fa-save")
            deleteButtton.classList.add("disabled")
            completeButton.classList.add("disabled")
            deleteButtton.setAttribute('disabled', '')
            completeButton.setAttribute('disabled', '')
            tasksList.removeEventListener('click', this.editTask)
            tasksList.addEventListener('click', this.saveTask)
        }
        else return
    }

    saveTask = (event) => {
        const saveButton = event.target
        const task = document.createElement('p')

        if (saveButton.classList.contains('save-button')) {
            const children = Task.getChildren(saveButton)
            const editTaskInput = children[1]
            const deleteButtton = children[2]
            const completeButton = children[0]

            task.textContent = editTaskInput.value
            editTaskInput.replaceWith(task)
            task.classList.add('task')
            editTaskInput.remove()
            saveButton.classList.add("edit-button", "fa-edit")
            saveButton.classList.remove("save-button", "fa-save")
            deleteButtton.classList.remove("disabled")
            completeButton.classList.remove("disabled")
            deleteButtton.removeAttribute('disabled', '')
            completeButton.removeAttribute('disabled', '')

            tasksList.removeEventListener('click', this.saveTask)
            tasksList.addEventListener('click', this.editTask)
        }
        else return
    }

    deleteTask = (event) => {

        if (event.target.classList.contains('delete-button')) {
            const item = event.target.closest('li')
            item.remove()
        }
        else return
    }
}



const form = new Form
const task = new Task

form.renderTaskForm("Tasks")

const createButton = document.querySelector('.create-button')
const tasksList = document.querySelector('.tasks-list')

createButton.addEventListener('click', task.addTask)
tasksList.addEventListener('click', task.completeTask)
tasksList.addEventListener('click', task.editTask)
tasksList.addEventListener('click', task.deleteTask)