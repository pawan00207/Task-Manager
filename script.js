// script.js

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("due-date").value;

  if (!title || !description || !dueDate) return alert("Please fill all fields.");

  const task = {
    id: Date.now(),
    title,
    description,
    dueDate,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  form.reset();
  renderTasks();
});

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render all tasks
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <small>Due: ${new Date(task.dueDate).toLocaleString()}</small>
      <div class="task-actions">
        <button onclick="toggleComplete(${task.id})">
          ${task.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Toggle task complete
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  if (confirm("Delete this task?")) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Edit task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newTitle = prompt("Edit Title", task.title);
  const newDesc = prompt("Edit Description", task.description);
  const newDate = prompt("Edit Due Date (yyyy-mm-ddThh:mm)", task.dueDate);

  if (newTitle && newDesc && newDate) {
    task.title = newTitle;
    task.description = newDesc;
    task.dueDate = newDate;
    saveTasks();
    renderTasks();
  }
}

// Filter
function filterTasks(status) {
  renderTasks(status);
}

// Deadline Reminders
function checkReminders() {
  const now = new Date().getTime();
  tasks.forEach((task) => {
    const taskTime = new Date(task.dueDate).getTime();
    const timeDiff = taskTime - now;

    if (
      timeDiff > 0 &&
      timeDiff < 3600000 && // within 1 hour
      !task.completed &&
      !task.notified
    ) {
      alert(`Reminder: Task "${task.title}" is due soon!`);
      task.notified = true;
      saveTasks();
    }
  });
}

setInterval(checkReminders, 60000); // Check every 1 minute

// Initial render
renderTasks();
