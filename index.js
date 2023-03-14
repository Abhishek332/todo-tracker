const todoForm = document.getElementById('todo-creater');
const todoInput = document.getElementById('todo-creater-input');

const createTodo = (text)=>{
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.push({
        isComplete: false,
        todoText: todoInput.value;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!todoInput.value){
        alert('Without text todos have no meaning');
    }
    createTodo(todoInput.value);
    todoInput.value = '';
});