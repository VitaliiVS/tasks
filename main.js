const title = document.createElement('h1');
const tasksContainer = document.createElement('div');
const taskInput = document.createElement('input');
const createButtonContainer = document.createElement('div');
const createButton = document.createElement('button');
const tasksList = document.createElement('ul');

title.innerHTML = "TODOs";
title.classList.add('header');

tasksContainer.classList.add('tasks-container');

taskInput.setAttribute('type', 'text');
taskInput.classList.add('task-input');

createButtonContainer.classList.add('button-container');

createButton.classList.add('create-button');
createButton.innerHTML = "+ Add";

tasksList.classList.add('tasks-list');


document.body.append(title);
document.body.append(tasksContainer);
tasksContainer.append(taskInput);
tasksContainer.append(createButtonContainer);
createButtonContainer.append(createButton);
tasksContainer.append(tasksList);


function getAllSiblings(elem) {
    let siblings = [];
    let sibling = elem.parentNode.firstChild;

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }

    return siblings;
};

function addTask() {
    let value = document.querySelector('input[type=text]').value;
    const taskContainer = document.createElement('li');
    const task = document.createElement('p');
    const completeButton = document.createElement('button');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    taskContainer.classList.add('task-container')
    task.classList.add('task');
    completeButton.classList.add("comp-button");
    editButton.classList.add("edit-button");
    deleteButton.classList.add("delete-button");

    task.innerHTML = value;
    completeButton.innerHTML = "Done";
    editButton.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";

    if (value != '') {
        tasksList.append(taskContainer);
        taskContainer.append(completeButton);
        taskContainer.append(task);
        taskContainer.append(editButton);
        taskContainer.append(deleteButton);
        document.querySelector('input').value = '';
    }
}

function completeTask(event) {
    const completeButton = event.target;
    const task = completeButton.nextElementSibling;
    const siblings = getAllSiblings(completeButton);

    if (completeButton.classList.contains('comp-button')) {
        task.style.textDecoration = "line-through";
        completeButton.remove();
        siblings[1].remove();
        siblings[2].remove();
    }
    else return;
}

function editTask(event) {
    const editButton = event.target;
    const editTaskInput = document.createElement('input');
    editTaskInput.setAttribute('type', 'text');

    if (editButton.classList.contains('edit-button')) {
        const siblings = getAllSiblings(editButton);
        const task = siblings[1];
        const deleteButtton = siblings[2];
        const completeButton = siblings[0];

        editTaskInput.value = task.innerHTML;
        task.replaceWith(editTaskInput);
        task.remove();
        editButton.innerHTML = "Save";
        editButton.classList.remove("edit-button");
        editButton.classList.add("save-button");
        deleteButtton.setAttribute('disabled', '');
        completeButton.setAttribute('disabled', '');

        tasksList.removeEventListener('click', editTask);
        tasksList.addEventListener('click', saveTask);
    }
    else return;
}

function saveTask(event) {
    const saveButton = event.target;
    const task = document.createElement('p');

    if (saveButton.classList.contains('save-button')) {
        const siblings = getAllSiblings(saveButton);
        const editTaskInput = siblings[1];
        const deleteButtton = siblings[2];
        const completeButton = siblings[0];

        task.innerHTML = editTaskInput.value;
        editTaskInput.replaceWith(task);
        task.classList.add('task');
        editTaskInput.remove();
        saveButton.innerHTML = "Edit";
        saveButton.classList.add("edit-button");
        saveButton.classList.remove("save-button");
        deleteButtton.removeAttribute('disabled', '');
        completeButton.removeAttribute('disabled', '');

        tasksList.removeEventListener('click', saveTask);
        tasksList.addEventListener('click', editTask);
    }
    else return;
}

function deleteTask(event) {

    if (event.target.classList.contains('delete-button')) {
        const item = event.target.closest('li');
        item.remove();
    }
    else return;
}



tasksList.addEventListener('click', editTask);
tasksList.addEventListener('click', completeTask);
tasksList.addEventListener('click', deleteTask);
createButton.addEventListener('click', addTask);