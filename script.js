// ===== script.js (Pure ES5 style, No ES6 features) =====

// Select elements
var taskInput = document.querySelector("#taskInput");
var dueDate = document.querySelector("#dueDate");
var priority = document.querySelector("#priority");
var addBtn = document.querySelector("#addBtn");
var taskList = document.querySelector("#taskList");
var allBtn = document.querySelector("#allBtn");
var pendingBtn = document.querySelector("#pendingBtn");
var completedBtn = document.querySelector("#completedBtn");
var themeToggle = document.querySelector("#themeToggle");
var dateDisplay = document.querySelector("#date");


dateDisplay.textContent = new Date().toDateString();


var tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks(filter) {
  if (!filter) filter = "all";
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    if (
      (filter === "pending" && task.completed) ||
      (filter === "completed" && !task.completed)
    ) {
      return;
    }

    var li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    var html = "";
    html += "<div class='task-info'>";
    html += "<span class='task-text'>" + task.text + "</span>";
    if (task.dueDate) {
      html += "<span class='due-date'> " + task.dueDate + "</span>";
    }
    html += "<span class='priority " + task.priority + "'> " + task.priority + "</span>";
    html += "</div>";
    html += "<div class='task-actions' data-index='" + index + "'>";
    html += "<button class='toggle'><i class='bx bx-check'></i></button>";
    html += "<button class='delete'><i class='bx bx-trash'></i></button>";
    html += "</div>";

    li.innerHTML = html;
    taskList.appendChild(li);
  });
}

// Add task
function addTask() {
  var text = taskInput.value.trim();
  var dateVal = dueDate.value;
  var priorityVal = priority.value;

  if (!text) {
    alert(" Please enter a task!");
    return;
  }

  tasks.push({
    text: text,
    dueDate: dateVal,
    priority: priorityVal,
    completed: false,
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDate.value = "";
  priority.value = "low";
}

// Toggle completed
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  var confirmDelete = confirm(" Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}


taskList.addEventListener("click", function (e) {
  var actionBtn = e.target.closest("button");
  if (!actionBtn) return;

  var index = parseInt(actionBtn.parentElement.getAttribute("data-index"), 10);

  if (actionBtn.classList.contains("toggle")) {
    toggleTask(index);
  } else if (actionBtn.classList.contains("delete")) {
    deleteTask(index);
  }
});


themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  themeToggle.innerHTML = document.body.classList.contains("dark")
    ? "<i class='bx bx-sun'></i>"
    : "<i class='bx bx-moon'></i>";
});

// Filters
allBtn.addEventListener("click", function () {
  renderTasks("all");
});
pendingBtn.addEventListener("click", function () {
  renderTasks("pending");
});
completedBtn.addEventListener("click", function () {
  renderTasks("completed");
});

// button
addBtn.addEventListener("click", addTask);

// Enter key add
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});


renderTasks();
