const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const addBtn = document.querySelector('#add-btn');
const clearBtn = document.querySelector('#clear-btn');
const errorMsg = document.querySelector('#error-msg');
const emptyMsg = document.querySelector('#empty-msg');
const itemCounter = document.querySelector('#item-counter');

let todoStorage = [];
let counter = 0;

// Displays saved items on load if any
window.onload = ()=> {
  	todoStorage = JSON.parse(localStorage.getItem('Todo List')) || [];
	todoStorage.forEach(()=>  createTodoList(todoStorage));

    for (let items of todoStorage) counter++
    itemCounter.innerHTML = counter;
};

// Displays to-do item on submit
todoForm.addEventListener('submit', (e)=> {
	e.preventDefault();
	addTodo();
});

// Adds to-do item to the list on user input
function addTodo() {
    let inputValue = todoInput.value.trim().toLowerCase();

    if(inputValue.length > 1 && !todoStorage.some(item => item.title === inputValue)) {
        todoStorage.push( {title: inputValue, completed: false} );

        createTodoList(todoStorage);
        todoInput.value = ''
		localStorage.setItem('Todo List', JSON.stringify(todoStorage));

        counter++
        itemCounter.innerHTML = counter;

		errorMsg.style.display = 'none';

    } else if(todoStorage.some(item => item.title === inputValue)) {
		errorMsg.innerHTML = 'Item already added to the list'
		errorMsg.style.display = 'block'

	} else if (inputValue.length < 1) {
		errorMsg.innerHTML = 'Input cannot be empty'
		errorMsg.style.display = 'block'
	}
}

// Creates and controls to-do list
function createTodoList(todo) {
    todoList.innerHTML = ''

    todo.forEach((item, index) => {
        let listItem = document.createElement('li');
        let listValue = document.createElement('span');
        let listOptions = document.createElement('span');
        let deleteBtn = document.createElement('button');
        let checkBtn = document.createElement('input');

        listValue.innerHTML = `${item.title}`;

        checkBtn.setAttribute('type', 'checkbox');

        deleteBtn.innerHTML = `<i class="fa-solid fa-xmark delete-btn"></i>`;
        deleteBtn.classList.add('btn');
        deleteBtn.addEventListener('click', ()=> deleteItem(index));

        listItem.appendChild(listValue);
        listItem.appendChild(listOptions);

        listOptions.appendChild(checkBtn);
        listOptions.appendChild(deleteBtn);

        todoList.appendChild(listItem);
    });


    todoStorage.length > 0 ? emptyMsg.style.display = 'none' : emptyMsg.style.display = 'block';
}

// Delete single item from list
function deleteItem(index) {
    todoStorage.splice(index, 1);
    createTodoList(todoStorage);
	localStorage.setItem('Todo List', JSON.stringify(todoStorage));

    counter--
    itemCounter.innerHTML = counter;

	if(todoStorage.length < 1) localStorage.clear('Todo List');
}

// Delete all items from list
clearBtn.addEventListener('click', ()=> {
	todoStorage = [];
    counter = 0;

    itemCounter.innerHTML = counter;
    todoList.innerHTML = '';

    localStorage.clear('Todo List');
    emptyMsg.style.display = 'block';
});


