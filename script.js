const todoCreaterForm = document.getElementById('todo-creater-form');
const todoCreaterInput = document.getElementById('todo-creater-input');
const todosBox = document.getElementById('todos-box');

let TodosList = [];
let Screen;

window.addEventListener('load', () => {
	TodosList = new Todos();
    Screen = new ScreenHandler();
    Screen.renderChild();
});

class Todo {
	constructor(todoText) {
		this.isCompleted = true;
		this.todoText = todoText;
		this.id = Math.random();
	}
}

class Todos {
	constructor() {
		this.items = JSON.parse(localStorage.getItem('todos') || '[]');
	}

	addTodo(todoText) {
		const newTodo = new Todo(todoText);
		this.items.push(newTodo);
		localStorage.setItem('todos', JSON.stringify(this.items));
	}
}

class ScreenHandler {
	renderChild() {
		todosBox.innerHTML = '';
		const allTodos = TodosList.items.map(
			(TodoListItem) => `
            <form class="todo-list-item" id="${TodoListItem.id}">
                <i class="fa-solid fa-xmark"></i>
                <input type="checkbox" ${TodoListItem.isCompleted && 'checked'}"/>
                <textarea>${TodoListItem.todoText}</textarea>
                <button type="submit"><i class="fa-solid fa-pen-to-square edit-btn"></i></button>
            </form>
        `
		);
        todosBox.innerHTML = allTodos.join(" ");
	}

    clearInput() {
        todoCreaterInput.value = '';
    }
}

todoCreaterForm.addEventListener('submit', (e) => {
	e.preventDefault();
	if (!todoCreaterInput.value) {
		alert('Without text todos have no meaning');
		return;
	}

    TodosList.addTodo(todoCreaterInput.value);
    Screen.clearInput();
    Screen.renderChild();
});
