const TodoCreaterForm = require('./classes/TodoCreaterForm/TodoCreaterForm');
const Todos = require('./classes/Todos/Todos');
const ClearTodoBtn = require('./classes/ClearTodoBtn/ClearTodoBtn');
require('./index.css');

document.addEventListener('DOMContentLoaded', (e) => {
	const Container = document.querySelector('.container');
	Container.innerHTML += '<h1>Todo List</h1>';
	Container.appendChild(TodoCreaterForm.node);
	Container.appendChild(Todos.node);
	Container.appendChild(ClearTodoBtn.node);
});
