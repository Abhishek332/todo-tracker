import Todos from '../Todos/Todos';

class ClearTodoBtn {
	constructor() {
		this.node = document.createElement('button');
		this.node.setAttribute('id', 'clear-todo');

		this.addInnerHtml();
		this.addEventListeners();
	}

	addInnerHtml() {
		this.node.innerHTML = 'Clear Todo';
	}

	addEventListeners() {
		this.node.addEventListener('click', (e) => Todos.clearTodos());
	}
}

const ClearTodoBtnInstance = new ClearTodoBtn();
export default ClearTodoBtnInstance;
