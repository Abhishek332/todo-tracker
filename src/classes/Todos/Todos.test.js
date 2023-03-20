require('@testing-library/jest-dom');
const {
	getByTestId,
	queryByTestId,
	getAllByTestId,
	fireEvent,
} = require('@testing-library/dom');
const Todos = require('./Todos');
const Todo = require('../Todo/Todo');

Todos.clearTodos();
Todos.addTodo({ todoText: 'test todo 1' });
Todos.addTodo({ todoText: 'test todo 2' });

document.body.appendChild(Todos.node);

describe('Todos class test', () => {
	beforeEach(() => {
		Todos.clearTodos();
		Todos.addTodo('todo-1', '1');
	});

	it('should return expected elements', () => {
		expect(Todos.value).toHaveLength(1);

		expect(getAllByTestId(Todos.node, 'todo')).toHaveLength(1);
	});

	it('onclick of delete todo button, should delete the todo', () => {
		fireEvent.click(getByTestId(Todos.node, 'delete-todo-btn'));
		expect(Todos.value).toHaveLength(0);
	});

	it('onclick of checkbox value should be update', () => {
		fireEvent.click(getByTestId(Todos.node, 'checkbox'));

		expect(getByTestId(Todos.node, 'checkbox')).toHaveAttribute('checked');
		expect(Todos.value[0].isCompleted).toBe(true);
	});

	it('onclick of edit btn, text paragraph should replace to textarea, and save btn append', () => {
		fireEvent.click(getByTestId(Todos.node, 'edit-todo-btn'));
		expect(
			queryByTestId(Todos.node, 'todo-text-paragraph')
		).not.toBeInTheDocument();
		expect(queryByTestId(Todos.node, 'edit-todo-btn')).not.toBeInTheDocument();

		expect(
			getByTestId(Todos.node, 'save-updated-todo-btn')
		).toBeInTheDocument();
		expect(getByTestId(Todos.node, 'todo-textarea')).toBeInTheDocument();
	});

	it('onclick save should update todo value', () => {
		fireEvent.click(getByTestId(Todos.node, 'edit-todo-btn'));
		fireEvent.change(getByTestId(Todos.node, 'todo-textarea'), {
			target: { value: 'test updated todo' },
		});
		fireEvent.click(getByTestId(Todos.node, 'save-updated-todo-btn'));

		expect(Todos.value[0].todoText).toBe('test updated todo');
		expect(queryByTestId(Todos.node, 'edit-todo-btn')).toBeInTheDocument();
		expect(
			queryByTestId(Todos.node, 'save-updated-todo-btn')
		).not.toBeInTheDocument();
	});

	it('test change todo order', () => {
		Todos.addTodo('todo-2', '2');
		Todos.addTodo('todo-3', '3');

		Todos.changeTodosOrder('1', 2);
		expect(Todos.value).toEqual([
			{
				id: '2',
				todoText: 'todo-2',
				isCompleted: false,
			},
			{
				id: '3',
				todoText: 'todo-3',
				isCompleted: false,
			},
			{
				id: '1',
				todoText: 'todo-1',
				isCompleted: false,
			},
		]);
	});
});
