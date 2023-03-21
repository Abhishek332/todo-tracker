import ClearTodoBtn from './ClearTodoBtn';
import Todos from '../Todos/Todos';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('ClearTodoBtn test', () => {
	it('should return expected node', () => {
		expect(ClearTodoBtn.node).toHaveTextContent('Clear Todo');
		expect(ClearTodoBtn.node).toHaveAttribute('id', 'clear-todo');
	});

	it('should delete all todos onclick of clear-todo button', () => {
		Todos.addTodo({ todoText: 'todo-1' });
		expect(Todos.value.length).toEqual(1);
		fireEvent.click(ClearTodoBtn.node);
		expect(Todos.value.length).toEqual(0);
	});
});
