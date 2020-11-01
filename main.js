const title = document.createElement('h1');
const tasksContainer = document.createElement('div');
const taskInput = document.createElement('input');
const createTask = document.createElement('button');
const tasksList = document.createElement('ul');

taskInput.setAttribute('type', 'text');
createTask.innerHTML = "+ Add";
title.innerHTML = "TODOs";

document.body.append(title);
document.body.append(tasksContainer);
tasksContainer.append(taskInput);
tasksContainer.append(createTask);
tasksContainer.append(tasksList);

tasksList.classList.add('tasks-list');

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
    const itemContainer = document.createElement('li');
    const item = document.createElement('p');
    const compItem = document.createElement('button');
    const editItem = document.createElement('button');
    const deleteItem = document.createElement('button');

    compItem.classList.add("comp-button");
    editItem.classList.add("edit-button");
    deleteItem.classList.add("delete-button");

    item.innerHTML = value;
    compItem.innerHTML = "Done";
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
        deleteButtton.setAttribute('hidden', '');
        completeButton.setAttribute('hidden', '');

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
        editTaskInput.remove();
        saveButton.innerHTML = "Edit";
        saveButton.classList.add("edit-button");
        saveButton.classList.remove("save-button");
        deleteButtton.removeAttribute('hidden', '');
        completeButton.removeAttribute('hidden', '');

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
createTask.addEventListener('click', addTask);