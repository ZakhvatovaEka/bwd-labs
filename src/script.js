document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.burger');
    const sidebar = document.querySelector('.sidebar');
    
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
});
