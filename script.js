// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks on page load
window.onload = () => renderTasks();

// Add task
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const desc = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;

  const task = {
    id: Date.now(),
    title,
    desc,
    dueDate,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  this.reset();
});

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks(filter = "all") {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .forEach((task) => {
      const li = document.createElement("li");
      li.className = "task" + (task.completed ? " completed" : "");
      li.innerHTML = `
        <strong>${task.title}</strong><br/>
        ${task.desc}<br/>
        Due: ${task.dueDate} <br/>
        <button onclick="toggleComplete(${task.id})">
          ${task.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
      list.appendChild(li);
    });
}

// Toggle complete
function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Filter handler
function filterTasks(filter) {
  renderTasks(filter);
}
