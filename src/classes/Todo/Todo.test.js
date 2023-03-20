require('@testing-library/jest-dom');
const Todo = require('./Todo');
const { getByTestId, fireEvent } = require('@testing-library/dom');

describe('Todo class test', () => {
	let todo = new Todo({
		id: '0fdgdgd',
		todoText: 'todo-1',
		isCompleted: false,
	});

	document.body.appendChild(todo.node);

	it('testing return value and node', () => {
		expect(todo.value).toEqual({
			id: '0fdgdgd',
			todoText: 'todo-1',
			isCompleted: false,
		});

		expect(todo.node).not.toHaveAttribute('draggable');
		expect(getByTestId(todo.node, 'drag-btn')).toBeInTheDocument();

		const checkbox = getByTestId(todo.node, 'checkbox');
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).not.toBeChecked();
		expect(getByTestId(todo.node, 'todo-text-block')).toBeInTheDocument();

		const textPara = getByTestId(todo.node, 'todo-text-paragraph');
		expect(textPara).toBeInTheDocument();
		expect(textPara).not.toHaveAttribute('class', 'mark-done');
		expect(textPara).toHaveTextContent('todo-1');

		expect(getByTestId(todo.node, 'drag-btn')).toBeInTheDocument();
		expect(getByTestId(todo.node, 'edit-todo-btn')).toBeInTheDocument();
		expect(getByTestId(todo.node, 'delete-todo-btn')).toBeInTheDocument();
	});

	it('should make todo draggable on mouseenter in drag-btn', () => {
		const dragBtn = getByTestId(todo.node, 'drag-btn');

		fireEvent(dragBtn, new MouseEvent('mouseenter'));
		expect(todo.node).toHaveAttribute('draggable');
	});

	it('should make todo not draggable on mouseleave in drag-btn', () => {
		const dragBtn = getByTestId(todo.node, 'drag-btn');

		fireEvent(dragBtn, new MouseEvent('mouseleave'));
		expect(todo.node).not.toHaveAttribute('draggable');
	});
});
