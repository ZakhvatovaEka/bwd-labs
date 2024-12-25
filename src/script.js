document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.burger');
    const sidebar = document.querySelector('.sidebar');

    window.showDialog = showDialog;
    window.closeDialog = closeDialog;
    window.addTask = addTask;
    window.showHistoryDialog = showHistoryDialog;
    window.closeHistoryDialog = closeHistoryDialog;
    window.restoreTask = restoreTask;
    window.changeStatus = changeStatus;
    window.deleteTask = deleteTask;
    // Показать или скрыть боковое меню
    burger.addEventListener('click', function () {
        burger.classList.toggle('open');
        sidebar.classList.toggle('open');
    });

    // Закрытие бокового меню при клике на ссылку
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            burger.classList.remove('open');
            sidebar.classList.remove('open');
        });
    });

    const tasks = [];

    // Сохранение задач в localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Загрузка задач из localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks.push(...JSON.parse(savedTasks));
        }
    }

    // Добавление записи в историю задачи
    function addToHistory(task) {
        if (!task.history) {
            task.history = [];
        }
        task.history.push({ text: task.text, status: task.status, timestamp: new Date() });
    }

    // Открытие модального окна
    function showDialog() {
        const dialog = document.getElementById('taskDialog');
        dialog.showModal();

        // Добавляем событие закрытия модального окна при клике вне его
        dialog.addEventListener('click', (event) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            );

            if (!isInDialog) {
                closeDialog();
            }
        });
    }

    // Закрытие модального окна
    function closeDialog() {
        const dialog = document.getElementById('taskDialog');
        dialog.close();
    }

    // Добавление задачи
    function addTask() {
        const text = document.getElementById('taskText').value;
        if (text) {
            const newTask = { text, status: 'todo', history: [] };
            addToHistory(newTask);
            tasks.push(newTask);
            document.getElementById('taskText').value = '';
            closeDialog();
            saveTasks();
            render();
        }
    }

    // Изменение статуса задачи
    function changeStatus(index, newStatus) {
        const task = tasks[index];
        addToHistory(task);
        task.status = newStatus;
        saveTasks();
        render();
    }

    // Удаление задачи
    function deleteTask(index) {
        const task = tasks[index];
        addToHistory(task); // Сохраняем перед удалением
        tasks.splice(index, 1);
        saveTasks();
        render();
    }

    // Показ истории задачи
    function showHistory(index) {
        const task = tasks[index];
        if (!task.history || task.history.length === 0) {
            alert('История изменений отсутствует.');
            return;
        }
        let historyText = 'История изменений:\n';
        task.history.forEach((entry, i) => {
            historyText += `${i + 1}. [${entry.timestamp}] ${entry.status}: ${entry.text}\n`;
        });
        const restoreIndex = prompt(`${historyText}\nВведите номер версии для восстановления:`);
        if (restoreIndex && task.history[restoreIndex - 1]) {
            const version = task.history[restoreIndex - 1];
            task.text = version.text;
            task.status = version.status;
            saveTasks();
            render();
        }
    }

    // Отображение задач
    function render() {
        const statuses = { todo: '', inprogress: '', done: '' };

        tasks.forEach((task, i) => {
            statuses[task.status] += `
                <div class="task-card">
                    ${task.status === 'done' ? '<span class="checkmark">✔️</span>' : ''}
                    ${task.text}
                    <button class="delete-button" onclick="deleteTask(${i})">Удалить</button>
                    <button onclick="showHistory(${i})">История</button>
                    ${task.status === 'todo' ? `<button onclick="changeStatus(${i}, 'inprogress')">В работу</button>` : ''}
                    ${task.status === 'inprogress' ? `<button onclick="changeStatus(${i}, 'done')">Завершить</button>` : ''}
                </div>`;
        });

        document.getElementById('todo').innerHTML = statuses.todo;
        document.getElementById('inprogress').innerHTML = statuses.inprogress;
        document.getElementById('done').innerHTML = statuses.done;
    }
    let task = JSON.parse(localStorage.getItem('tasks')) || [];
    let history = JSON.parse(localStorage.getItem('history')) || [];

    // Открытие модального окна
    function showDialog() {
        const dialog = document.getElementById('taskDialog');
        dialog.showModal();
    }

    // Открытие истории
    function showHistoryDialog() {
        const dialog = document.getElementById('historyDialog');
        const historyContent = document.getElementById('historyContent');

        historyContent.innerHTML = history.map((entry, index) => `
            <div class="history-entry">
                <p>${entry.action}: <strong>${entry.text}</strong> (${entry.timestamp})</p>
                ${entry.action.includes('Удалена') ? `<button class="restore-button" onclick="restoreTask(${index})">Восстановить</button>` : ''}
            </div>
        `).join('');

        dialog.showModal();
    }

    // Закрытие истории
    function closeHistoryDialog() {
        const dialog = document.getElementById('historyDialog');
        dialog.close();
    }

    // Добавление задачи
    function addTask() {
        const text = document.getElementById('taskText').value;
        if (text) {
            const newTask = { text, status: 'todo' };
            tasks.push(newTask);
            saveHistory('Добавлена задача', text);
            saveTasks();
            render();
        }
        closeDialog();
    }

    // Изменение статуса задачи
    function changeStatus(index, newStatus) {
        const task = tasks[index];
        saveHistory(`Изменён статус задачи на '${newStatus}'`, task.text);
        task.status = newStatus;
        saveTasks();
        render();
    }

    // Удаление задачи
    function deleteTask(index) {
        const task = tasks[index];
        saveHistory('Удалена задача', task.text);
        tasks.splice(index, 1);
        saveTasks();
        render();
    }

    // Сохранение задач
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Сохранение истории
    function saveHistory(action, text) {
        const timestamp = new Date().toLocaleString();
        history.push({ action, text, timestamp, restored: false});
        localStorage.setItem('history', JSON.stringify(history));
    }

    // Восстановление задачи
function restoreTask(index) {
    const entry = history[index];
    if (entry.action.includes('Удалена') && !entry.restored) {
        tasks.push({ text: entry.text, status: 'todo' }); // Восстанавливаем задачу
        entry.restored = true; // Помечаем задачу как восстановленную
        saveTasks(); // Сохраняем обновлённый список задач
        localStorage.setItem('history', JSON.stringify(history)); // Сохраняем обновлённую историю
        render(); // Обновляем отображение
    } else {
        alert('Эта задача уже восстановлена!');
    }
}

    loadTasks();
    render();
});
