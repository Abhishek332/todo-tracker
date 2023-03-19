const Todos = require('../Todos/Todos');

class TodoCreaterForm {
	constructor() {
		this.node = document.createElement('form');
		this.node.setAttribute('id', 'todo-creater-form');

		this.addInnerHtml();
		this.addEventListeners();
	}

	addInnerHtml() {
		this.node.innerHTML = `<input
					placeholder="Enter todo task here"
					id="todo-creater-input"
					value=""
				/>
				<button>Add</button>`;
	}

	addEventListeners() {
		this.node.addEventListener('submit', (e) => {
			e.preventDefault();
			const todoCreaterInput = this.node.getElementsByTagName('input')[0];

			if (!todoCreaterInput.value) {
				alert('Without text todos have no meaning');
				return;
			}

			Todos.addTodo(todoCreaterInput.value);
			todoCreaterInput.value = '';
		});
	}
}

const TodoCreaterFormInstance = new TodoCreaterForm();
module.exports = TodoCreaterFormInstance;
