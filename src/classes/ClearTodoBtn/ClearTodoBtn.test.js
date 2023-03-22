const ClearTodoBtn = require('./ClearTodoBtn');
const Todos = require('../Todos/Todos');
const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');

describe('ClearTodoBtn test', () => {
	it('should return expected node', () => {
		expect(ClearTodoBtn.node).toHaveTextContent('Clear Todo');
		expect(ClearTodoBtn.node).toHaveAttribute('id', 'clear-todo');
	});

	it('should delete all todos onclick of clear-todo button', () => {
		Todos.addTodo('todo-1');
		expect(Todos.value).toHaveLength(1);
		fireEvent.click(ClearTodoBtn.node);
		expect(Todos.value).toHaveLength(0);
	});
});
