const todoCreaterForm = document.getElementById('todo-creater-form');
const todoCreaterInput = document.getElementById('todo-creater-input');
const todosBox = document.getElementById('todos-box');

const renderSingleTodo = ({todoText, isCompleted}) => {
    const todoForm = document.createElement('form');
    const todoInput = document.createElement('input');
    todoInput.setAttribute('value', todoText);
    todosBox.appendChild(todoInput);
}

const renderTodos = ()=>{
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.forEach((todo)=>renderSingleTodo(todo));
}

window.addEventListener('load', renderTodos);

todoCreaterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!todoCreaterInput.value){
        alert('Without text todos have no meaning');
        return;
    }

    //create and save todo
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const newTodo = {
        isCompleted: false,
        todoText: todoCreaterInput.value
    };
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));

    renderSingleTodo(newTodo);
    todoCreaterInput.value = '';
});