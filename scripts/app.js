const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const itemCounter = document.querySelector('#item-counter');
const addBtn = document.querySelector('#add-btn');
const clearBtn = document.querySelector('#clear-btn');
const errorMsg = document.querySelector('#error-msg');
const emptyMsg = document.querySelector('#empty-msg');
const notification = document.querySelector('.notification');
const popupModal = document.querySelector('#popup-modal');
const popup = document.querySelector('.popup-body');
const popupDeleteBtn = document.querySelector('.popup-delete-btn');
const popupCancelBtn = document.querySelector('.popup-cancel-btn');

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

	if ((window.matchMedia('screen and (max-width: 750px)').matches)) {
		clearBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
	} else {
		clearBtn.innerHTML = `<i class="fa-solid fa-trash"></i> Delete list`;
	}
};

// Displays task on submit
todoForm.addEventListener('submit', (e) => {
	e.preventDefault();
	addTask();
});

// Validates user input and adds task to list
function addTask() {
  	let inputValue = todoInput.value.trim().toLowerCase();

  	if(inputValue.length > 1 && !todoStorage.some(task => task.name === inputValue)) {
		todoStorage.push( {name: inputValue, completed: false} );
		todoInput.value = '';

		createTodoList(todoStorage);
		notify('Task added!', 2500);

		listItem.classList.add('animated', 'animatedFadeInUp', 'fadeInUp');
		localStorage.setItem('Todo List', JSON.stringify(todoStorage));

		counter++
		itemCounter.innerHTML = counter;

		errorMsg.style.display = 'none';

    } else if(todoStorage.some(task => task.name === inputValue)) {
		errorMsg.innerHTML = 'Task already added to the list.';
		errorMsg.style.display = 'block';

    } else if(inputValue.length < 1) {
		errorMsg.innerHTML = 'Enter a task!';
		errorMsg.style.display = 'block';
    }
}

// Creates and controls task list
function createTodoList(todo) {
	todoList.innerHTML = '';

	todo.forEach((task, index) => {
		let taskName = document.createElement('span');
		let taskOptions = document.createElement('span');
		let deleteBtn = document.createElement('button');
		let checkBtn = document.createElement('input');

		listItem = document.createElement("li");
		listItem.classList.add('task');
	
		taskName.innerHTML = `${task.name}`;
		taskName.classList.add('task-name');

		checkBtn.setAttribute('type', 'checkbox');
		checkBtn.classList.add('check-btn');
		checkBtn.addEventListener('change', () => checkTask(task, taskName));

		deleteBtn.innerHTML = `<i class="fa-solid fa-xmark delete-btn"></i>`;
		deleteBtn.classList.add('btn');
		deleteBtn.addEventListener('click', () => deleteTask(index));

		listItem.appendChild(taskOptions);
		listItem.appendChild(deleteBtn);
		taskOptions.appendChild(checkBtn);
		taskOptions.appendChild(taskName);
		todoList.appendChild(listItem);

		// Checks state of task and maintains it
		if(task.completed) {
			task.completed = true;
			checkBtn.checked = true;
			taskName.classList.add('completed');
		} else {
			task.completed = false;
			checkBtn.checked = false;
			taskName.classList.remove('completed');
		}
   	});

	// Empty message & Clear button
	if(todoStorage.length > 0)  {
		emptyMsg.style.display = 'none';
        clearBtn.classList.add('btn-active');
	} else {
		emptyMsg.style.display = 'block';
		clearBtn.classList.remove('btn-active');
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

// Notification alert
function notify(text, duration) {
	notification.innerHTML =`${text}`;
	notification.classList.toggle('active');
    setTimeout(() => {
        notification.classList.remove('active');
    }, duration);
}

// Delete single task from list
function deleteTask(index) {
	todoStorage.splice(index, 1);

	createTodoList(todoStorage);
	notify('Task deleted!', 2500);

	counter--
	itemCounter.innerHTML = counter;

	localStorage.setItem("Todo List", JSON.stringify(todoStorage));
	if(todoStorage.length < 1) localStorage.clear('Todo List');
}

// Delete all items from list
function deleteList() {
	notify('To do list was deleted!', 3000);
	
	todoStorage = [];
	localStorage.clear("Todo List");

	counter = 0;
	itemCounter.innerHTML = counter;
	todoList.innerHTML = '';

	emptyMsg.style.display = 'block';
	clearBtn.style.display = 'none';
}

// Toggle delete popup window
clearBtn.addEventListener('click', () => {
	popupModal.classList.add('popup-active');
	popup.classList.add('animated', 'animatedFadeInUp', 'fadeInUp');
});

popupDeleteBtn.addEventListener('click', ()=> {
	deleteList();
	popupModal.classList.remove('popup-active');
	popup.classList.remove('animated', 'animatedFadeInUp', 'fadeInUp');
});

popupCancelBtn.addEventListener('click', ()=> {
	popupModal.classList.remove('popup-active');
	popup.classList.remove('animated', 'animatedFadeInUp', 'fadeInUp');
});
