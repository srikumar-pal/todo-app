// ===== Select Elements =====
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");

// Filter buttons
const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

// ===== Load tasks from LocalStorage =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ===== Render Tasks =====
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("completed");
        }

        // Toggle complete
        li.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            tasks.splice(tasks.indexOf(task), 1);
            saveTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// ===== Save Tasks =====
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    updateStats();
}

// ===== Add Task =====
addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
});

// ===== Enter Key Support =====
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

// ===== Clear All Tasks =====
clearAllBtn.addEventListener("click", () => {
    if (tasks.length === 0) {
        alert("No tasks to clear!");
        return;
    }

    if (confirm("Are you sure you want to delete all tasks?")) {
        tasks = [];
        saveTasks();
    }
});

// ===== Task Stats =====
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById("totalCount").textContent = `Total: ${total}`;
    document.getElementById("completedCount").textContent = `Completed: ${completed}`;
    document.getElementById("pendingCount").textContent = `Pending: ${pending}`;
}

// ===== Filter Logic =====
function setActive(btn) {
    [allBtn, pendingBtn, completedBtn].forEach(b =>
        b.classList.remove("active")
    );
    btn.classList.add("active");
}

allBtn.addEventListener("click", () => {
    currentFilter = "all";
    setActive(allBtn);
    renderTasks();
});

pendingBtn.addEventListener("click", () => {
    currentFilter = "pending";
    setActive(pendingBtn);
    renderTasks();
});

completedBtn.addEventListener("click", () => {
    currentFilter = "completed";
    setActive(completedBtn);
    renderTasks();
});

// ===== Initial Load =====
renderTasks();
updateStats();
