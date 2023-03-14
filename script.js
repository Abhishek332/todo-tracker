const todoCreaterForm = document.getElementById('todo-creater-form');
const todoCreaterInput = document.getElementById('todo-creater-input');
const todosBox = document.getElementById('todos-box');
const clearTodoBtn = document.getElementById('clear-todo');

let TodosList = [];
let Screen;

window.addEventListener('load', () => {
	TodosList = new Todos();
	Screen = new ScreenHandler();
	Screen.renderChild();
});

class Todo {
	constructor(todoText) {
		this.isCompleted = false;
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
		Screen.clearInput();
		Screen.renderChild();
	}

	deleteTodo(todo) {
		this.items = this.items.filter((item) => item.id !== todo.id);
		localStorage.setItem('todos', JSON.stringify(this.items));
		Screen.renderChild();
	}

	updateTodo(todo, updatedText) {
		this.items.forEach((item) => {
			if (item.id === todo.id) {
				item.todoText = updatedText;
			}
		});
		localStorage.setItem('todos', JSON.stringify(this.items));
		Screen.renderChild();
	}

    updateTodoStatus(todo, status){
        this.items.forEach((item) => {
            if (item.id === todo.id) {
                item.isCompleted = status;
            }
        });
        localStorage.setItem('todos', JSON.stringify(this.items));
        Screen.renderChild();
    }

	clearTodos() {
		this.items = [];
		localStorage.clear();
	}
}

class ScreenHandler {
	renderChild() {
		todosBox.innerHTML = '';
		const allTodos = TodosList.items.map(
			(TodoListItem) => `
            <form class="todo-list-item" id="${TodoListItem.id}">
                <button data-id="delete-todo"><i class="fa-solid fa-xmark"></i></button>
                <input type="checkbox" ${TodoListItem.isCompleted ? 'checked' : ''}/>
                <textarea disabled  ${TodoListItem.isCompleted ? 'class="mark-done"': ''}>${TodoListItem.todoText}</textarea>
                <button data-id="edit-todo-btn"><i class="fa-solid fa-pen-to-square edit-btn"></i></button>
            </form>
        `
		);
		todosBox.innerHTML = allTodos.join(' ');
		this.addEventListeners();
	}

	addEventListeners() {
		TodosList.items.forEach((TodoListItem) => {
			const Todo = document.getElementById(TodoListItem.id);
			Todo.addEventListener('submit', (e) => {
				e.preventDefault();
				//checking which button was clicked
				const ClickedBtn = document.querySelector('form button:focus');
				if (ClickedBtn.dataset.id === 'delete-todo') {
					TodosList.deleteTodo(TodoListItem);
				} else if (ClickedBtn.dataset.id === 'edit-todo-btn') {
					Todo.removeChild(ClickedBtn);
					Todo.innerHTML += `<button data-id="save-updated-todo">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                            </button>`;
					Todo.querySelector('textarea').removeAttribute('disabled');
					Todo.querySelector('textarea').focus();
				} else if (ClickedBtn.dataset.id === 'save-updated-todo') {
					const textareaValue = Todo.querySelector('textarea').value;
					TodosList.updateTodo(TodoListItem, textareaValue);
				}
			});

            const CheckBox = Todo.querySelector("input[type='checkbox']");
            CheckBox.addEventListener('click', (e) => {
                console.log(e.target.checked)
                TodosList.updateTodoStatus(TodoListItem, e.target.checked);
            })
		});
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
});

clearTodoBtn.addEventListener('click', () => {
	TodosList.clearTodos();
	Screen.renderChild();
});
