<script>
    import { onMount } from 'svelte';
    let newTask = '';
    let tasks = [];

    // Load tasks from localStorage on mount
    onMount(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    });

    // Save tasks to localStorage whenever tasks change
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask() {
        if (newTask.trim()) {
            tasks = [...tasks, { text: newTask, completed: false }];
            newTask = '';
            saveTasks();
        }
    }

    function removeTask(index) {
        tasks = tasks.filter((_, i) => i !== index);
        saveTasks();
    }

    function toggleTask(index) {
        tasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
    }
</script>

<style>
    .completed {
        text-decoration: line-through;
        color: gray;
    }
</style>

<div>

    <input
        type="text"
        bind:value={newTask}
        placeholder="Add a new task"
        on:keydown="{(e) => e.key === 'Enter' && addTask()}"
    />
    <button on:click={addTask}>Add</button>

    <ul>
        {#each tasks as task, index}
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
