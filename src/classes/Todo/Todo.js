export default class Todo {
	constructor({ id, todoText, isCompleted }) {
		this.value = {
			todoText: todoText,
			isCompleted: isCompleted || false,
			id: id || Math.random().toString(),
		};
		this.node = document.createElement('form');
		this.node.classList.add('todo');
		this.node.setAttribute('id', this.value.id);

		this.addInnerHtml();
		this.addEventListeners();
	}

	addInnerHtml() {
		this.node.innerHTML = `
            <button data-id="drag-btn" class="drag-grip"><i class="fa-solid fa-grip-lines-vertical"></i></button>
            <input data-id="checkbox" type="checkbox" ${
							this.value.isCompleted ? 'checked' : ''
						}/>
            <div class="todo-text">
				<p  ${this.value.isCompleted ? 'class="mark-done"' : ''}>${
			this.value.todoText
		}</p>
			</div>
            <button data-id="edit-todo-btn"><i class="fa-solid fa-pen-to-square edit-btn"></i></button>
			<button data-id="delete-todo-btn"><i class="fa-solid fa-xmark"></i></button>`;
	}

	addEventListeners() {
		const DragBtn = this.node.querySelector('button[data-id="drag-btn"]');

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
