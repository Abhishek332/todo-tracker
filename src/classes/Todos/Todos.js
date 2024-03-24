import Todo from '../Todo/Todo';

class Todos {
	insertAfterThisElement = null;
	constructor() {
		this.value = JSON.parse(localStorage.getItem('todos') || '[]');
		this.node = document.createElement('div');
		this.node.setAttribute('id', 'todos-box');
		this.node.setAttribute('testid', 'todos-box');

		this.#renderTodos(); //this.addInnerHtml in other classes
		this.#addEventListeners();
	}

	#renderTodos() {
		this.node.innerHTML = '';
		this.value.forEach((todoObj) => {
			const todo = new Todo(todoObj);
			this.node.appendChild(todo.node);
		});
	}

	#getInsertAfterThisElement(draggedTodoTop) {
		const allTodoElements = [...this.node.querySelectorAll('.todo')];

		const nearestTodo = allTodoElements.reduce(
			(nearestTodo, currentElement) => {
				const box = currentElement.getBoundingClientRect();

				if (box.top <= draggedTodoTop && box.top > nearestTodo.elementTop) {
					return { elementTop: box.top, element: currentElement };
				} else {
					return nearestTodo;
				}
			},
			{ elementTop: Number.NEGATIVE_INFINITY, element: null }
		);

		this.insertAfterThisElement = nearestTodo?.element;
	}

	#addEventListeners() {
		this.node.addEventListener('dragover', (e) => {
			e.preventDefault();

			if (e.target !== this.node && !e.target.classList.contains('todo')) {
				this.#getInsertAfterThisElement(e.clientY - e.offsetY + 0.3515625);
			}
		});

		this.node.addEventListener('drop', (e) => {
			const draggedTodo = this.node.querySelector('.todo.dragging');
			const allTodoElements = [...this.node.querySelectorAll('.todo')];

			if (!this.insertAfterThisElement) {
				//dragged at the end of the list
				this.node.insertBefore(draggedTodo, allTodoElements[0]);
			} else {
				this.node.insertBefore(
					draggedTodo,
					this.insertAfterThisElement.nextSibling
				);
			}

			const updatedTodoElements = [...this.node.querySelectorAll('.todo')];
			const draggedTodoIndex = updatedTodoElements.indexOf(draggedTodo);
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

	#saveValueToLocalStorageAndUpdateNode() {
		localStorage.setItem('todos', JSON.stringify(this.value));
		this.#renderTodos();
	}

	addTodo(todoText, testid) {
		const newTodo = new Todo({ todoText, testid });
		this.value.push(newTodo.value);
		this.#saveValueToLocalStorageAndUpdateNode();
	}

	deleteTodo(todoId) {
		this.value = this.value.filter((todoObj) => todoObj.id !== todoId);
		this.#saveValueToLocalStorageAndUpdateNode();
	}

	updateTodo(todoId, updatedText) {
		this.value.forEach((todoObj) => {
			if (todoObj.id === todoId) {
				todoObj.todoText = updatedText;
			}
		});
		this.#saveValueToLocalStorageAndUpdateNode();
	}

	updateTodoStatus(todoId, status) {
		this.value.forEach((todoObj) => {
			if (todoObj.id === todoId) {
				todoObj.isCompleted = status;
			}
		});
		this.#saveValueToLocalStorageAndUpdateNode();
	}

	clearTodos() {
		this.value = [];
		this.#saveValueToLocalStorageAndUpdateNode();
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
export default TodosInstance;
