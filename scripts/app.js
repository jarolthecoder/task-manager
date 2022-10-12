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
let listItem;

// Displays saved items on load if any
window.onload = () => {
	todoStorage = JSON.parse(localStorage.getItem('Todo List')) || [];
	todoStorage.forEach(() => {
		createTodoList(todoStorage);
		counter++
	});
	itemCounter.innerHTML = counter;
};

// Displays task on submit
todoForm.addEventListener('submit', (e) => {
	e.preventDefault();
	addTask();
});

// Adds task to the list on user input
function addTask() {
  	let inputValue = todoInput.value.trim().toLowerCase();

  	if(inputValue.length > 1 && !todoStorage.some(task => task.name === inputValue)) {
		todoStorage.push( {name: inputValue, completed: false} );

		createTodoList(todoStorage);
		listItem.classList.add('animated', 'animatedFadeInUp', 'fadeInUp');
		todoInput.value = '';
		localStorage.setItem('Todo List', JSON.stringify(todoStorage));

		counter++
		itemCounter.innerHTML = counter;

		errorMsg.style.display = 'none';

    } else if(todoStorage.some(task => task.name === inputValue)) {
		errorMsg.innerHTML = 'Item already added to the list.';
		errorMsg.style.display = 'block';

    } else if(inputValue.length < 1) {
		errorMsg.innerHTML = 'Input cannot be empty! Enter a task.';
		errorMsg.style.display = 'block';
    }
}

// Creates and controls task list
function createTodoList(todo) {
	todoList.innerHTML = '';

	todo.forEach((task, index) => {
		let taskValue = document.createElement('span');
		let taskOptions = document.createElement('span');
		let deleteBtn = document.createElement('button');
		let checkBtn = document.createElement('input');

		listItem = document.createElement("li");
		listItem.classList.add('task');
	
		taskValue.innerHTML = `${task.name}`;
		taskValue.classList.add("task-name");

		checkBtn.setAttribute('type', 'checkbox');
		checkBtn.addEventListener('change', () => checkTask(task, taskValue));

		deleteBtn.innerHTML = `<i class="fa-solid fa-xmark delete-btn"></i>`;
		deleteBtn.addEventListener('click', () => deleteTask(index));
		deleteBtn.classList.add("btn");
	
		listItem.appendChild(taskOptions);
		listItem.appendChild(deleteBtn);
		taskOptions.appendChild(checkBtn);
		taskOptions.appendChild(taskValue);
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

	// Empty message & Clear button
	if(todoStorage.length > 0)  {
		emptyMsg.style.display = 'none';
        clearBtn.style.display = "block";
	} else {
		emptyMsg.style.display = 'block';
		clearBtn.style.display = "none";
	}
}

// Marks task as completed
function checkTask(task, value) {
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

// Delete single task from list
function deleteTask(index) {
	todoStorage.splice(index, 1);
	createTodoList(todoStorage);
	localStorage.setItem('Todo List', JSON.stringify(todoStorage));

	counter--
	itemCounter.innerHTML = counter;

	if(todoStorage.length < 1) localStorage.clear('Todo List');
}

// Delete all items from list
clearBtn.addEventListener('click', () => {
	todoStorage = [];
	counter = 0;

	itemCounter.innerHTML = counter;
	todoList.innerHTML = '';

	localStorage.clear('Todo List');
	emptyMsg.style.display = 'block';
});


