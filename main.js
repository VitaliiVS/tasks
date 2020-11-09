const title = document.createElement('h1')
const container = document.createElement('div')
const taskInput = document.createElement('input')
const createButton = document.createElement('button')
const tasksList = document.createElement('ul')
const editTaskInput = document.createElement('input')

title.classList.add('header')
title.textContent = "TODOs"

container.classList.add('container')
container.append(taskInput)
container.append(createButton)
container.append(tasksList)

taskInput.classList.add('task-input')
taskInput.setAttribute('type', 'text')

createButton.classList.add("create-button","far","fa-plus-square")

tasksList.classList.add('tasks-list')

editTaskInput.setAttribute('type', 'text')

document.body.append(title)
document.body.append(container)

function getAllSiblings(elem) {
    const siblings = []
    let sibling = elem.parentNode.firstChild

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling)
        }
        sibling = sibling.nextSibling
    }

    return siblings
}

function addTask() {
    const taskContainer = document.createElement('li')
    const task = document.createElement('p')
    
    const completeButton = document.createElement('input')
    const editButton = document.createElement('button')
    const deleteButton = document.createElement('button')

    completeButton.setAttribute('type', 'checkbox')
    completeButton.classList.add("comp-button")
    editButton.classList.add("edit-button","far","fa-edit")
    deleteButton.classList.add("delete-button","far","fa-trash-alt")
    taskContainer.classList.add('task-container')
    task.classList.add('task')
    task.textContent = taskInput.value

    taskContainer.append(completeButton)
    taskContainer.append(task)
    taskContainer.append(editButton)
    taskContainer.append(deleteButton)

    if (taskInput.value != '') {
        tasksList.append(taskContainer)
        taskInput.value = ''
    }
}

function completeTask(event) {
    const completeButton = event.target
    const siblings = getAllSiblings(completeButton)

    if (completeButton.classList.contains('comp-button') && completeButton.checked == true) {
        siblings[0].classList.add("completed")
        siblings[1].classList.add("disabled")
        siblings[1].setAttribute('disabled', '')
    }
    else if (completeButton.classList.contains('comp-button') && completeButton.checked == false){
        siblings[0].classList.remove("completed")
        siblings[1].classList.remove("disabled")
        siblings[1].removeAttribute('disabled', '')
    }
    else return
}

function editTask(event) {
    const editButton = event.target

    if (editButton.classList.contains('edit-button')) {
        const siblings = getAllSiblings(editButton)
        const task = siblings[1]
        const deleteButtton = siblings[2]
        const completeButton = siblings[0]

        editTaskInput.value = task.textContent
        task.replaceWith(editTaskInput)
        task.remove()
        editButton.classList.remove("edit-button","fa-edit")
        editButton.classList.add("save-button","fa-save")
        deleteButtton.classList.add("disabled")
        completeButton.classList.add("disabled")
        deleteButtton.setAttribute('disabled', '')
        completeButton.setAttribute('disabled', '')
        tasksList.removeEventListener('click', editTask)
        tasksList.addEventListener('click', saveTask)
    }
    else return
}

function saveTask(event) {
    const saveButton = event.target
    const task = document.createElement('p')

    if (saveButton.classList.contains('save-button')) {
        const siblings = getAllSiblings(saveButton)
        const editTaskInput = siblings[1]
        const deleteButtton = siblings[2]
        const completeButton = siblings[0]

        task.textContent = editTaskInput.value
        editTaskInput.replaceWith(task)
        task.classList.add('task')
        editTaskInput.remove()
        saveButton.classList.add("edit-button","fa-edit")
        saveButton.classList.remove("save-button","fa-save")
        deleteButtton.classList.remove("disabled")
        completeButton.classList.remove("disabled")
        deleteButtton.removeAttribute('disabled', '')
        completeButton.removeAttribute('disabled', '')

        tasksList.removeEventListener('click', saveTask)
        tasksList.addEventListener('click', editTask)
    }
    else return
}

function deleteTask(event) {

    if (event.target.classList.contains('delete-button')) {
        const item = event.target.closest('li')
        item.remove()
    }
    else return
}



tasksList.addEventListener('click', editTask)
tasksList.addEventListener('click', completeTask)
tasksList.addEventListener('click', deleteTask)
createButton.addEventListener('click', addTask)