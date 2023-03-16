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

	deleteTodo(todoId) {
		this.items = this.items.filter((item) => item.id !== Number(todoId));
		localStorage.setItem('todos', JSON.stringify(this.items));
		Screen.renderChild();
	}

	updateTodo(todoId, updatedText) {
		console.log(todoId, updatedText);
		this.items.forEach((item) => {
			if (item.id === Number(todoId)) {
				item.todoText = updatedText;
			}
		});
		localStorage.setItem('todos', JSON.stringify(this.items));
		Screen.renderChild();
	}

	updateTodoStatus(todoId, status) {
		this.items.forEach((item) => {
			if (item.id === Number(todoId)) {
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

	changeTodosOrder(draggedTodoId, draggedTodoIndex) {
		const draggableTodoItem = this.items.find(
			(item) => item.id === Number(draggedTodoId)
		);
		this.items = this.items.filter((item) => item.id !== Number(draggedTodoId));
		this.items.splice(draggedTodoIndex, 0, draggableTodoItem);
		localStorage.setItem('todos', JSON.stringify(this.items));
	}
}

class ScreenHandler {
	renderChild() {
		todosBox.innerHTML = '';
		const allTodos = TodosList.items.map(
			(TodoListItem) => `
            <form class="todo-list-item" id="${TodoListItem.id}">
			<button data-id="drag-btn" class="drag-grip"><i class="fa-solid fa-grip-lines-vertical"></i></button>
                <input data-id="checkbox" type="checkbox" ${
									TodoListItem.isCompleted ? 'checked' : ''
								}/>
                <div class="todo-text">
					<p  ${TodoListItem.isCompleted ? 'class="mark-done"' : ''}>${
				TodoListItem.todoText
			}</p>
				</div>
               <button data-id="edit-todo-btn"><i class="fa-solid fa-pen-to-square edit-btn"></i></button>
				<button data-id="delete-todo-btn"><i class="fa-solid fa-xmark"></i></button>
            </form>
        `
		);
		todosBox.innerHTML = allTodos.join(' ');
		this.addEventListeners();
	}

	addEventListeners() {
		TodosList.items.forEach((TodoListItem) => {
			const Todo = document.getElementById(TodoListItem.id);
			const CheckBox = Todo.querySelector("input[type='checkbox']");
			const EditBtn = Todo.querySelector('button[data-id="edit-todo-btn"]');
			const DeleteBtn = Todo.querySelector('button[data-id="delete-todo"]');
			const DragBtn = Todo.querySelector('button[data-id="drag-btn"]');

			Todo.addEventListener('submit', (e) => {
				e.preventDefault();
			});

			Todo.addEventListener('dragstart', (e) => {
				Todo.classList.add('dragging');
				e.dataTransfer.effectAllowed = 'move';
			});

			Todo.addEventListener('dragend', (e) => {
				Todo.classList.remove('dragging');
			});

			DragBtn.addEventListener('mouseenter', () => {
				Todo.setAttribute('draggable', true);
			});

			DragBtn.addEventListener('mouseleave', () => {
				Todo.removeAttribute('draggable');
			});
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

todosBox.addEventListener('dragover', (e) => {
	e.preventDefault();
	const afterElement = getClosestTodo(todosBox, e.clientY);
	console.log('abhishek');
	const draggedTodo = document.querySelector('.todo-list-item.dragging');
	if (afterElement == null) {
		todosBox.appendChild(draggedTodo);
	} else {
		todosBox.insertBefore(draggedTodo, afterElement);
	}
});

todosBox.addEventListener('drop', (e) => {
	const draggedTodo = document.querySelector('.todo-list-item.dragging');
	const allTodoElements = [...todosBox.querySelectorAll('.todo-list-item')];
	const draggedTodoIndex = allTodoElements.indexOf(draggedTodo);
	console.log('callled');
	TodosList.changeTodosOrder(draggedTodo.id, draggedTodoIndex);
});

todosBox.addEventListener('click', (e) => {
	const clickedCurrentTodoChildNode = e.target;
	const currentTodoNode = clickedCurrentTodoChildNode.parentNode;
	const currentTodoTextBlockNode = currentTodoNode.querySelector('.todo-text');
	const DeleteBtnNode = currentTodoNode.querySelector(
		'[data-id=delete-todo-btn]'
	);

	switch (clickedCurrentTodoChildNode.dataset.id) {
		case 'checkbox': {
			TodosList.updateTodoStatus(
				currentTodoNode.id,
				clickedCurrentTodoChildNode.checked
			);
			break;
		}

		case 'edit-todo-btn': {
			currentTodoNode.removeChild(clickedCurrentTodoChildNode);
			currentTodoNode.removeChild(DeleteBtnNode);

			currentTodoTextBlockNode.innerHTML = `<textarea class="todo-text-input">${currentTodoTextBlockNode.innerText}</textarea>`;
			currentTodoNode.innerHTML += `<button data-id="save-updated-todo-btn"><i class="fa-solid fa-floppy-disk"></i></button>
										<button data-id="delete-todo-btn"><i class="fa-solid fa-xmark"></i></button>`;

			currentTodoNode.querySelector('textarea').focus();
			break;
		}

		case 'save-updated-todo-btn': {
			e.preventDefault();
			TodosList.updateTodo(
				currentTodoNode.id,
				currentTodoTextBlockNode.firstElementChild.value
			);
			break;
		}

		case 'delete-todo-btn': {
			e.preventDefault();
			TodosList.deleteTodo(currentTodoNode.id);
			break;
		}
	}
});

function getClosestTodo(todosBox, y) {
	const remainDraggableTodos = [
		...todosBox.querySelectorAll('.todo-list-item:not(.dragging)'),
	];

	const closestTodo = remainDraggableTodos.reduce(
		(closestTodo, remainDraggableTodo) => {
			const box = remainDraggableTodo.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;

			if (offset < 0 && offset > closestTodo.offset) {
				return { offset, element: remainDraggableTodo };
			} else {
				return closestTodo;
			}
		},
		{ offset: Number.NEGATIVE_INFINITY, element: null }
	);

	return closestTodo.element;
}
