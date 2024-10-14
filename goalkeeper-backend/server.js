const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const TASKS_FILE = 'tasks.json';

// Load tasks from file
function loadTasks() {
    if (fs.existsSync(TASKS_FILE)) {
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

// Save tasks to file
function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// API endpoint to get tasks
app.get('/tasks', (req, res) => {
    const tasks = loadTasks();
    res.json(tasks);
});

// API endpoint to add a task
app.post('/tasks', (req, res) => {
    const task = req.body;
    const tasks = loadTasks();
    tasks.push(task);
    saveTasks(tasks);
    res.json({ message: 'Task added successfully' });
});

// API endpoint to delete a task
app.delete('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    let tasks = loadTasks();
    tasks = tasks.filter((_, i) => i !== index);
    saveTasks(tasks);
    res.json({ message: 'Task removed successfully' });
});

// API endpoint to toggle a task's completion status
app.put('/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    let tasks = loadTasks();
    tasks = tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task));
    saveTasks(tasks);
    res.json({ message: 'Task updated successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
