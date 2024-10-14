<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let newTask = '';
    let tasks = writable([]);

    // Fetch tasks from the backend
    async function loadTasks() {
        const response = await fetch('http://localhost:3000/tasks');
        const data = await response.json();
        tasks.set(data);
    }

    // Add a new task
    async function addTask() {
        if (newTask.trim()) {
            await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newTask, completed: false })
            });
            newTask = '';
            loadTasks();
        }
    }

    // Remove a task
    async function removeTask(index) {
        await fetch(`http://localhost:3000/tasks/${index}`, {
            method: 'DELETE'
        });
        loadTasks();
    }

    // Toggle task completion
    async function toggleTask(index) {
        await fetch(`http://localhost:3000/tasks/${index}`, {
            method: 'PUT'
        });
        loadTasks();
    }

    onMount(loadTasks);
</script>

<style>
    .completed {
        text-decoration: line-through;
        color: gray;
    }
</style>

<div>
    <h2>To-Do List</h2>
    <input
        type="text"
        bind:value={newTask}
        placeholder="Add a new task"
        on:keydown="{(e) => e.key === 'Enter' && addTask()}"
    />
    <button on:click={addTask}>Add</button>

    <ul>
        {#each $tasks as task, index}
            <li>
                <input
                    type="checkbox"
                    bind:checked={task.completed}
                    on:change={() => toggleTask(index)}
                />
                <span class:completed={task.completed}>
                    {task.text}
                </span>
                <button on:click={() => removeTask(index)}>Remove</button>
            </li>
        {/each}
    </ul>
</div>
