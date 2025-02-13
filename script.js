document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const prioritySelect = document.getElementById('prioritySelect');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (!taskText) {
            alert("Task cannot be empty!");
            return;
        }

        const task = {
            text: taskText,
            priority: priority,
            completed: false
        };

        saveTask(task);
        renderTaskList();
        taskInput.value = "";
    }

    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        renderTaskList();
    }

    function renderTaskList() {
        taskList.innerHTML = "";
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.sort((a, b) => {
            const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`;
            listItem.innerHTML = `
                <span>${task.text} <small class="text-muted">(${task.priority})</small></span>
                <div>
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <button class="btn btn-sm btn-success done-button">${task.completed ? 'Undo' : 'Done'}</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                </div>
            `;

            listItem.querySelector('.delete-button').addEventListener('click', () => deleteTask(index));
            listItem.querySelector('.done-button').addEventListener('click', () => toggleDone(index));
            listItem.querySelector('.edit-button').addEventListener('click', () => editTask(index));

            taskList.appendChild(listItem);
        });
    }

    function deleteTask(index) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTaskList();
    }

    function toggleDone(index) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTaskList();
    }

    function editTask(index) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        const newText = prompt("Edit Task:", tasks[index].text);
        if (newText !== null && newText.trim() !== "") {
            tasks[index].text = newText.trim();
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTaskList();
        }
    }
});
