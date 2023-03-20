const Todo = require('../Todo/Todo');

class Todos {
	constructor() {
		this.value = JSON.parse(localStorage.getItem('todos') || '[]');
		this.node = document.createElement('div');
		this.node.setAttribute('id', 'todos-box');
		this.node.setAttribute('testid', 'todos-box');

		this.renderTodos(); //this.addInnerHtml in other classes
		this.addEventListeners();
	}

	renderTodos() {
		this.node.innerHTML = '';
		this.value.forEach((todoObj) => {
			const todo = new Todo(todoObj);
			this.node.appendChild(todo.node);
		});
	}

	addEventListeners() {
		function getElementsAfterTodo(clientY) {
			const remainDraggableTodos = [
				...this.node.querySelectorAll('.todo:not(.dragging)'),
			];

			const closestAfterTodo = remainDraggableTodos.reduce(
				(closestTodo, remainDraggableTodo) => {
					const box = remainDraggableTodo.getBoundingClientRect();
					const offset = clientY - box.top - box.height / 2;

					if (offset < 0 && offset > closestTodo.offset) {
						return { offset, element: remainDraggableTodo };
					} else {
						return closestTodo;
					}
				},
				{ offset: Number.NEGATIVE_INFINITY, element: null }
			);

			return closestAfterTodo.element;
		}

		this.node.addEventListener('dragover', (e) => {
			e.preventDefault();

			const draggedTodo = this.node.querySelector('.todo.dragging');
			const afterElement = getElementsAfterTodo.call(this, e.clientY);

			if (afterElement === null) {
				//dragged at the end of the list
				this.node.appendChild(draggedTodo);
			} else {
				this.node.insertBefore(draggedTodo, afterElement);
			}
		});

		this.node.addEventListener('drop', (e) => {
			const draggedTodo = this.node.querySelector('.todo.dragging');
			const allTodoElements = [...this.node.querySelectorAll('.todo')];
			const draggedTodoIndex = allTodoElements.indexOf(draggedTodo);

			this.changeTodosOrder(draggedTodo.id, draggedTodoIndex);
		});

		this.node.addEventListener('click', (e) => {
			const clickedCurrentTodoChildNode = e.target;
			const currentTodoNode = clickedCurrentTodoChildNode.parentNode;
			const currentTodoTextBlockNode =
				currentTodoNode.querySelector('.todo-text');
			const DeleteBtnNode = currentTodoNode.querySelector(
				'[data-testid=delete-todo-btn]'
			);

			switch (clickedCurrentTodoChildNode.dataset.testid) {
				case 'checkbox': {
					this.updateTodoStatus(
						currentTodoNode.id,
						clickedCurrentTodoChildNode.checked
					);
					break;
				}

				case 'edit-todo-btn': {
					currentTodoNode.removeChild(clickedCurrentTodoChildNode);
					currentTodoNode.removeChild(DeleteBtnNode);

					currentTodoTextBlockNode.innerHTML = `<textarea data-testid="todo-textarea" class="todo-text-input">${currentTodoTextBlockNode.innerText}</textarea>`;
					currentTodoNode.innerHTML += `<button data-testid="save-updated-todo-btn"><i class="fa-solid fa-floppy-disk"></i></button>
										<button data-testid="delete-todo-btn" disabled><i class="fa-solid fa-xmark"></i></button>`;

					currentTodoNode.querySelector('textarea').focus();
					break;
				}

				case 'save-updated-todo-btn': {
					e.preventDefault();
					this.updateTodo(
						currentTodoNode.id,
						currentTodoTextBlockNode.firstElementChild.value
					);
					break;
				}

				case 'delete-todo-btn': {
					e.preventDefault();
					this.deleteTodo(currentTodoNode.id);
					break;
				}
			}
		});
	}

	saveValueToLocalStorageAndUpdateNode() {
		localStorage.setItem('todos', JSON.stringify(this.value));
		this.renderTodos();
	}

	addTodo(todoText, testid) {
		const newTodo = new Todo({ todoText, testid });
		this.value.push(newTodo.value);
		this.saveValueToLocalStorageAndUpdateNode();
	}

	deleteTodo(todoId) {
		this.value = this.value.filter((todoObj) => todoObj.id !== todoId);
		this.saveValueToLocalStorageAndUpdateNode();
	}

	updateTodo(todoId, updatedText) {
		this.value.forEach((todoObj) => {
			if (todoObj.id === todoId) {
				todoObj.todoText = updatedText;
			}
		});
		this.saveValueToLocalStorageAndUpdateNode();
	}

	updateTodoStatus(todoId, status) {
		this.value.forEach((todoObj) => {
			if (todoObj.id === todoId) {
				todoObj.isCompleted = status;
			}
		});
		this.saveValueToLocalStorageAndUpdateNode();
	}

	clearTodos() {
		this.value = [];
		this.saveValueToLocalStorageAndUpdateNode();
	}

	changeTodosOrder(draggedTodoId, draggedTodoIndex) {
		const draggedTodoObj = this.value.find(
			(todoObj) => todoObj.id === draggedTodoId
		);

		this.value = this.value.filter((todoObj) => todoObj.id !== draggedTodoId);
		this.value.splice(draggedTodoIndex, 0, draggedTodoObj);
		localStorage.setItem('todos', JSON.stringify(this.value));
	}
}

//exporting instance so whole lifecycle of app instance not get change;
let TodosInstance = new Todos();
module.exports = TodosInstance;
