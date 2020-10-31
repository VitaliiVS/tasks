const title = document.createElement('h1');
const tasksContainer = document.createElement('div');
const taskInput = document.createElement('input');
const submitTask = document.createElement('button');
const tasksList = document.createElement('ul');

taskInput.setAttribute('type', 'text');
submitTask.innerHTML = "+ Add";
title.innerHTML = "TODOs";

document.body.append(title);
document.body.append(tasksContainer);
tasksContainer.append(taskInput);
tasksContainer.append(submitTask);
tasksContainer.append(tasksList);


function addTask() {
    let value = document.querySelector('input[type=text]').value;
    const itemContainer = document.createElement('li');
    const item = document.createElement('p');
    const compItem = document.createElement('input');
    const editItem = document.createElement('button');
    const deleteItem = document.createElement('button');

    compItem.classList.add("comp-button");
    editItem.classList.add("edit-button");
    deleteItem.classList.add("delete-button");

    compItem.setAttribute('type', 'checkbox');
    item.innerHTML = value;
    editItem.innerHTML = "Edit";
    deleteItem.innerHTML = "Delete";

    if (value != '') {
        tasksList.append(itemContainer);
        itemContainer.append(compItem);
        itemContainer.append(item);
        itemContainer.append(editItem);
        itemContainer.append(deleteItem);
        document.querySelector('input').value = '';
    }
}

function completeTask(event) {
    const checkbox = event.target;

    if (checkbox.className != 'comp-button') return;

    const item = checkbox.nextElementSibling;

    if (checkbox.checked) {
        item.style.textDecoration = "line-through";
    } else {
        item.style.textDecoration = "none";
    }
}

function editTask(event) {
    const editButton = event.target;
    const taskTxt = editButton.previousElementSibling;
    const editItem = document.createElement('input');
    const deleteButtton = editButton.nextElementSibling;
    editItem.setAttribute('type', 'text');

    if (editButton.className != 'edit-button') return;

    editItem.value = taskTxt.innerHTML;
    taskTxt.replaceWith(editItem);
    taskTxt.remove();
    editButton.innerHTML = "Save";
    editButton.classList.remove("edit-button");
    editButton.classList.add("save-button");
    deleteButtton.setAttribute('disabled','');

    tasksList.removeEventListener('click', editTask);
    tasksList.addEventListener('click', saveTask);
}

function saveTask(event) {
    const saveButton = event.target;
    const editItem = saveButton.previousElementSibling;
    const taskTxt = document.createElement('p');
    const deleteButtton = saveButton.nextElementSibling;

    if (saveButton.className != 'save-button') return;

    taskTxt.innerHTML = editItem.value;
    editItem.replaceWith(taskTxt);
    editItem.remove();
    saveButton.innerHTML = "Edit";
    saveButton.classList.add("edit-button");
    saveButton.classList.remove("save-button");
    deleteButtton.removeAttribute('disabled','');

    tasksList.removeEventListener('click', saveTask);
    tasksList.addEventListener('click', editTask);
}

function deleteTask(event) {
    if (event.target.className != 'delete-button') return;

    const item = event.target.closest('li');
    item.remove();
}

tasksList.addEventListener('click', editTask);
tasksList.addEventListener('click', completeTask);
tasksList.addEventListener('click', deleteTask);
submitTask.addEventListener('click', addTask);