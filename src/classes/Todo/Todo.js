class Todo {
	constructor({ id, todoText, isCompleted, testid }) {
		this.value = {
			todoText: todoText,
			isCompleted: isCompleted || false,
			id: id || testid || Math.random().toString(),
		};
		this.node = document.createElement('form');
		this.node.classList.add('todo');
		this.node.setAttribute('id', this.value.id);
		this.node.setAttribute('data-testid', 'todo');

		this.addInnerHtml();
		this.addEventListeners();
	}

	addInnerHtml() {
		this.node.innerHTML = `
            <button data-testid="drag-btn" class="drag-grip"><i class="fa-solid fa-grip-lines-vertical"></i></button>
            <input data-testid="checkbox" type="checkbox" ${
							this.value.isCompleted ? 'checked' : ''
						}/>
            <div data-testid="todo-text-block" class="todo-text">
				<p data-testid="todo-text-paragraph" ${
					this.value.isCompleted ? 'class="mark-done"' : ''
				}>${this.value.todoText}</p>
			</div>
            ${
							!this.value.isCompleted
								? '<button data-testid="edit-todo-btn"><i class="fa-solid fa-pen-to-square edit-btn"></i></button>'
								: ''
						}
			<button data-testid="delete-todo-btn"><i class="fa-solid fa-xmark"></i></button>`;
	}

	addEventListeners() {
		const DragBtn = this.node.querySelector('button[data-testid="drag-btn"]');

		this.node.addEventListener('dragstart', (e) => {
			this.node.classList.add('dragging');
			e.dataTransfer.effectAllowed = 'move';
		});

		this.node.addEventListener('dragend', (e) => {
			this.node.classList.remove('dragging');
		});

		DragBtn.addEventListener('mouseenter', () => {
			this.node.setAttribute('draggable', true);
		});

		DragBtn.addEventListener('mouseleave', () => {
			this.node.removeAttribute('draggable');
		});
	}
}

module.exports = Todo;
