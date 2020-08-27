let path = require('path');
let {getElement, compileElement, createElement} = require(path.join(__dirname, 'scripts/element-functions'));
let {openWindow} = require(path.join(__dirname, 'scripts/electron-window'));


const { v4: generateId } = require('uuid');

const APP = {
	// C1 headers
	majorHeader: getElement('header-major'),
	minorHeader: getElement('header-minor'),
	scheduleHeader: getElement('header-schedule'),
	completedHeader: getElement('header-completed'),
	// C1 containers
	majorContainer: getElement('generated-major'),
	minorContainer: getElement('generated-minor'),
	scheduleContainer: getElement('generated-schedule'),
	completedContainer: getElement('completed-tasks'),
	// C2 - New Task
	newTaskText: getElement('new-task-text'),
	addMinorBtn: getElement('add-minor'),
	addMajorBtn: getElement('add-major'),
	// C2 - New Schedule
	newScheduleText: getElement('new-schedule-text'),
	newScheduleDate: getElement('schedule-date'),
	newScheduleHour: getElement('schedule-hour'),
	newScheduleMinute: getElement('schedule-minute'),
	addSchedule: getElement('add-schedule'),
	// C2 - Current Task
	currentTaskText: getElement('current-task-text'),
	currentTaskTimer: getElement('current-timer'),
	// Additional Tools / FS
	TOOLS: {
		dictionary: getElement('dictionary'),
		calculator: getElement('calculator'),
		whiteboard: getElement('whiteboard'),
		notebooks: getElement('notebooks'),
		pomodoro: getElement('pomodoro')
	},
	// Timer
	currentTimer: null,
	clearTimer: function(){
		clearInterval(this.currentTimer);
	}
}

// Data will be used to save into a file for future loading
const majorTasks = {};
const minorTasks = {};
const completedTasks = {};
const scheduleTasks = [/* Will be sorted everytime new task is added */];

function addMajorTask() {
	if (!APP.newTaskText.value) return;

	 function addNotesHandler(field, container) {
	 	const newNote = document.createElement('div');

	 	const noteText = createElement(field.value, ['notes-text']);
	 	const removeNote = createElement('RM', ['remove-note'], 'button');

	 	compileElement(newNote, [noteText, removeNote]);

	 	const uuid2 = generateId();

	 	container.appendChild(newNote);

	 	majorTasks[uuid].notes[uuid2] = {
	 		element: newNote,
	 		id: uuid2,
	 		text: noteText.innerHTML
	 	}

	 	removeNote.addEventListener('click', () => removeHandler(uuid2, majorTasks[uuid].notes));

	 	field.value = "";
	 }

	const task = document.createElement('div');
	const general = document.createElement('div');
	const notes = document.createElement('div');
	const newNotes = document.createElement('div');

	const taskText = createElement(APP.newTaskText.value, ['task-text']);
	const addNotes = createElement('+Note', ['task-note', 'task-btn'], 'button');
	const taskLock = createElement('LK', ['task-complete', 'task-btn'], 'button');
	const taskRemove = createElement('RM', ['task-complete', 'task-btn'], 'button');

	const inputField = document.createElement("input");
	const addNotesBtn = createElement("+", ['add-notes', 'notes-btn'], 'button');

	inputField.setAttribute('type', 'text');
	inputField.classList.add("new-notes-field");

	compileElement(newNotes, [inputField, addNotesBtn]);

	newNotes.classList.add('hidden');

	compileElement(general, [taskText, addNotes, taskLock, taskRemove]);
	compileElement(task, [general, newNotes, notes]);

	const uuid = generateId();

	task.id = uuid;

	task.classList.add('generated-task');

	APP.majorContainer.appendChild(task);

	majorTasks[uuid] = {
		element: task,
		id: uuid,
		text: taskText.innerHTML,
		notes: {},
		locked: false,
		buttons: [addNotes, taskRemove],
		newNotesField: newNotes,
		hidden: true
	}

	APP.newTaskText.value = "";

	taskRemove.addEventListener('click', () => removeHandler(uuid, majorTasks));
	taskLock.addEventListener('click', () => lockHandler(uuid));
	addNotes.addEventListener('click', () => notesHandler(uuid));

	addNotesBtn.addEventListener('click', () => addNotesHandler(inputField, notes));

}

function addMinorTask() {
	if (!APP.newTaskText.value) return;

	const task = document.createElement('div');

	const taskText = createElement(APP.newTaskText.value, ['task-text']);
	const taskCurrent = createElement('CU', ['task-current', 'task-btn'], 'button');
	const taskComplete = createElement('CP', ['task-complete', 'task-btn'], 'button');
	const taskRemove = createElement('RM', ['task-complete', 'task-btn'], 'button');

	compileElement(task, [taskText, taskCurrent, taskComplete, taskRemove]);

	task.classList.add('generated-task');

	const uuid = generateId();

	task.id = uuid;

	APP.minorContainer.appendChild(task);

	minorTasks[uuid] = {
		element: task,
		id: uuid,
		text: taskText.innerHTML,
		timer: {
			minutes: 0,
			seconds: 0
		}
	}

	taskCurrent.addEventListener('click', () => currentHandler(uuid));
	taskRemove.addEventListener('click', () => removeHandler(uuid, minorTasks));
	taskComplete.addEventListener('click', () => completeHandler(uuid, minorTasks));

	APP.newTaskText.value = "";
}

function addScheduleTask(){
	// tomorrow :D
}

function notesHandler(id) {
	majorTasks[id].hidden = !majorTasks[id].hidden;
	if (majorTasks[id].hidden) {
		majorTasks[id].newNotesField.classList.add('hidden');
	}
	else {
		majorTasks[id].newNotesField.classList.remove('hidden');
	}
}

function lockHandler(id) {
	majorTasks[id].locked = !majorTasks[id].locked;
	for (let i = 0; i < majorTasks[id].buttons.length; i++) {
		if(majorTasks[id].locked) {
			majorTasks[id].buttons[i].setAttribute("disabled", "true");
		} else {
			majorTasks[id].buttons[i].removeAttribute("disabled");
		}
	}

	if (majorTasks[id].locked) {
		majorTasks[id].element.classList.add('isLocked');
	} else {
		majorTasks[id].element.classList.remove('isLocked');
	}
}

function currentHandler(id) {
	APP.clearTimer();
	APP.currentTaskText.innerHTML = minorTasks[id].text;
	APP.currentTimer = timer(minorTasks[id].timer);
}

function removeHandler(id, container) {
	container[id].element.remove();
	delete container[id];
}

function completeHandler(id, container) {
	const newCompleted = document.createElement('div');

	const completedTaskText = minorTasks[id].text;
	const completedTaskTime = formatTime(minorTasks[id].timer);

	const completedText = createElement(completedTaskText, ['completed-text']);
	const completedTime = createElement(completedTaskTime, ['completed-time']);
	const removeCompleted = createElement('RM', ['remove'], 'button');

	compileElement(newCompleted, [completedText, completedTime, removeCompleted]);

	completedTasks[id] = {
		element: newCompleted,
		id: id,
		text: completedTaskText,
		timer: {
			minutes: minorTasks[id].timer.minutes,
			seconds: minorTasks[id].timer.seconds
		}
	}

	APP.completedContainer.appendChild(newCompleted);
	removeHandler(id, container);

	removeCompleted.addEventListener('click', () => removeHandler(id, completedTasks));
}

function timer(obj) {
	function start(){
		obj.seconds++;
		if (obj.seconds >= 60) {
			obj.seconds = 0;
			obj.minutes++;
		}
		APP.currentTaskTimer.innerHTML = formatTime(obj);
	}
	return setInterval(start, 1000);
}

function formatTime(timerObj) {
	return `${timerObj.minutes > 9 ? timerObj.minutes : '0'+timerObj.minutes}:${timerObj.seconds > 9 ? timerObj.seconds : '0'+timerObj.seconds}`
}

APP.addMinorBtn.addEventListener('click', () => addMinorTask());
APP.addMajorBtn.addEventListener('click', () => addMajorTask());
APP.addSchedule.addEventListener('click', () => addScheduleTask());

APP.TOOLS.dictionary.addEventListener('click', () => openWindow(path.join(__dirname,'/tools/dictionary.tool.html'), 300, 450));
APP.TOOLS.calculator.addEventListener('click', () => openWindow(path.join(__dirname,'/tools/calculator.tool.html'), 400, 300));
APP.TOOLS.pomodoro.addEventListener('click', () => openWindow(path.join(__dirname,'/tools/pomodoro.tool.html'), 350, 400));

