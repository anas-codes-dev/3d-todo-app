const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const clearBtn = document.getElementById('clear-btn');
const toggleThemeBtn = document.getElementById('toggle-theme');
const prioritySelect = document.getElementById('priority');

// Load tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => addTaskToDOM(task));

// Add Task
addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    const priority = prioritySelect.value;
    if (!text) return;

    const task = {
        text,
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
        endedAt: null,
        elapsed: 0
    };

    tasks.push(task);
    updateLocalStorage();
    addTaskToDOM(task);
    input.value = "";
});

// Clear all
clearBtn.addEventListener('click', () => {
    tasks = [];
    updateLocalStorage();
    todoList.innerHTML = "";
});

// Toggle dark/light
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Add task to DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.style.borderLeft = `8px solid var(--${task.priority})`;

    const header = document.createElement('div');
    header.classList.add('task-header');

    const textSpan = document.createElement('span');
    textSpan.textContent = task.text;
    if (task.completed) textSpan.classList.add('completed');

    // Buttons
    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', () => {
        const newText = prompt("Edit task:", task.text);
        if (newText && newText.trim() !== "") {
            task.text = newText.trim();
            textSpan.textContent = task.text;
            updateLocalStorage();
        }
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.classList.add('delete-btn');
    delBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        updateLocalStorage();
        li.remove();
    });

    header.appendChild(textSpan);
    header.appendChild(editBtn);
    header.appendChild(delBtn);

    li.appendChild(header);

    // Timer and times
    const timer = document.createElement('span');
    timer.classList.add('timer');
    li.appendChild(timer);

    const times = document.createElement('span');
    times.classList.add('times');
    times.textContent = `Started: ${new Date(task.createdAt).toLocaleTimeString()}` +
                        (task.endedAt ? ` | Ended: ${new Date(task.endedAt).toLocaleTimeString()}` : '');
    li.appendChild(times);

    // Complete on click
    li.addEventListener('dblclick', () => {
        task.completed = !task.completed;
        if (task.completed) task.endedAt = new Date().toISOString();
        else task.endedAt = null;
        textSpan.classList.toggle('completed');
        times.textContent = `Started: ${new Date(task.createdAt).toLocaleTimeString()}` +
                            (task.endedAt ? ` | Ended: ${new Date(task.endedAt).toLocaleTimeString()}` : '');
        updateLocalStorage();
    });

    todoList.appendChild(li);
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Timer update
setInterval(() => {
    todoList.querySelectorAll('li').forEach((li, i) => {
        const task = tasks[i];
        const timer = li.querySelector('.timer');
        if (!timer) return;
        if (!task.completed) {
            const now = new Date();
            const start = new Date(task.createdAt);
            let elapsed = Math.floor((now - start)/1000);
            const h = String(Math.floor(elapsed/3600)).padStart(2,'0');
            const m = String(Math.floor((elapsed%3600)/60)).padStart(2,'0');
            const s = String(elapsed%60).padStart(2,'0');
            timer.textContent = `Elapsed: ${h}:${m}:${s}`;
        } else {
            timer.textContent = "Completed";
        }
    });
}, 1000);