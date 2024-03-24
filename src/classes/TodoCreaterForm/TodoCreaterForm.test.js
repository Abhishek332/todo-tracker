import '@testing-library/jest-dom';
import {
	getByPlaceholderText,
	getByText,
	fireEvent,
} from '@testing-library/dom';
import TodoCreaterForm from './TodoCreaterForm';
import Todos from '../Todos/Todos.js';

describe('TodoCreaterForm test', () => {
	document.body.appendChild(TodoCreaterForm.node);
	const Input = getByPlaceholderText(
		TodoCreaterForm.node,
		'Enter todo task here'
	);
	const Button = getByText(TodoCreaterForm.node, 'Add');
	const Alert = jest.fn();
	window.alert = Alert;

	it('should contain necessary elements', () => {
		expect(TodoCreaterForm.node).toHaveAttribute('id', 'todo-creater-form');
		expect(Input).toBeInTheDocument();
		expect(Input).toHaveAttribute('id', 'todo-creater-input');
		expect(Button).toBeInTheDocument();
	});

	it('should call event listener callback on form submit', () => {
		fireEvent.input(Input, {
			target: {
				value: 'todo-1',
			},
		});
		fireEvent.click(Button);

		expect(Todos.value).toHaveLength(1);
		expect(Input).toHaveAttribute('value', '');

		fireEvent.click(Button);
		expect(Alert).toHaveBeenCalledWith('Without text todos have no meaning');
		expect(Todos.value).toHaveLength(1);
	});
});
