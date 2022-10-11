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
	todoStorage.forEach(()=> {
		createTodoList(todoStorage);
		counter++
	});
	itemCounter.innerHTML = counter;
};

// Displays task on submit
todoForm.addEventListener('submit', (e)=> {
	e.preventDefault();
	addTodo();
});

// Adds task to the list on user input
function addTodo() {
  	let inputValue = todoInput.value.trim().toLowerCase();

  	if(inputValue.length > 1 && !todoStorage.some(item => item.name === inputValue)) {
		todoStorage.push( {name: inputValue, completed: false} );

		createTodoList(todoStorage);
		todoInput.value = '';
		localStorage.setItem('Todo List', JSON.stringify(todoStorage));

		counter++
		itemCounter.innerHTML = counter;

		errorMsg.style.display = 'none';

    } else if(todoStorage.some(item => item.name === inputValue)) {
		errorMsg.innerHTML = 'Item already added to the list';
		errorMsg.style.display = 'block';

    } else if(inputValue.length < 1) {
		errorMsg.innerHTML = 'Input cannot be empty';
		errorMsg.style.display = 'block';
    }
}

// Creates and controls task list
function createTodoList(todo) {
	todoList.innerHTML = '';

	todo.forEach((task, index) => {
		let listItem = document.createElement('li');
		let taskValue = document.createElement('span');
		let taskOptions = document.createElement('span');
		let deleteBtn = document.createElement('button');
		let checkBtn = document.createElement('input');

		taskValue.innerHTML = `${task.name}`;

		checkBtn.setAttribute('type', 'checkbox');
		checkBtn.addEventListener('change', ()=> checkItem(task, taskValue));

		deleteBtn.innerHTML = `<i class="fa-solid fa-xmark delete-btn"></i>`;
		deleteBtn.classList.add('btn');
		deleteBtn.addEventListener('click', ()=> deleteItem(index));

		listItem.appendChild(taskValue);
		listItem.appendChild(taskOptions);

		taskOptions.appendChild(checkBtn);
		taskOptions.appendChild(deleteBtn);

		todoList.appendChild(listItem);

		// Checks state of task and maintains it
		if(task.completed) {
			task.completed = true;
			checkBtn.checked = true;
			taskValue.classList.add('completed');
		} else {
			task.completed = false;
			checkBtn.checked = false;
			taskValue.classList.remove('completed');
		}
   });

	// Empty message
	todoStorage.length > 0 ? emptyMsg.style.display = 'none' : emptyMsg.style.display = 'block';
}

// Marks task as completed
function checkItem(task, value) {
   if(!task.completed) {
		task.completed = true;
		localStorage.setItem('Todo List', JSON.stringify(todoStorage));
		value.classList.add('completed');
   } else {
		task.completed = false;
		localStorage.setItem('Todo List', JSON.stringify(todoStorage));
		value.classList.remove('completed');
   }
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


