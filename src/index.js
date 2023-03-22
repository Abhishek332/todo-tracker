import TodoCreaterForm from './classes/TodoCreaterForm/TodoCreaterForm';
import Todos from './classes/Todos/Todos';
import ClearTodoBtn from './classes/ClearTodoBtn/ClearTodoBtn';
import './index.css';

document.addEventListener('DOMContentLoaded', (e) => {
	const Container = document.querySelector('.container');
	Container.innerHTML += '<h1>Todo List</h1>';
	Container.appendChild(TodoCreaterForm.node);
	Container.appendChild(Todos.node);
	Container.appendChild(ClearTodoBtn.node);
});
