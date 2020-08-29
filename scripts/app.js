const path = require('path');
const { getElement, compileElement, createElement } = require(path.join(__dirname, 'scripts/element-functions'));
const { openWindow } = require(path.join(__dirname, 'scripts/electron-window'));
const { v4: generateId } = require('uuid');

const APP = {
	// C1 headers
	majorHeader: getElement('header-major'),
	minorHeader: getElement('header-minor'),
	scheduleHeader: getElement('header-schedule'),
	completedHeader: getElement('header-completed'),
	// C1 lighters
	majorLighter: getElement('major-lighter'),
	minorLighter: getElement('minor-lighter'),
	scheduleLighter: getElement('schedule-lighter'),
	completedLighter: getElement('completed-lighter'),
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
		notebooks: getElement('notebooks'),
		pomodoro: getElement('pomodoro')
	},
	// Timer
	currentTimer: null,
	clearTimer: function(){
		clearInterval(this.currentTimer);
	},
	setCurrentDate: function(){
		const today = new Date();
		const month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)
		this.newScheduleDate.value = `${today.getFullYear()}-${month}-${today.getDate()}`;
	},
	majorTasks: {},
	minorTasks: {},
	completedTasks: {},
	scheduleTasks: []
}

function addMajorTask() {
	const { newTaskText:text, majorTasks:tasks, majorContainer:container } = APP;
	if (!text.value) return;

	function addNotesHandler(field, container) {
		if (!field.value) return;
	 	const newNote = document.createElement('div');

	 	const noteText = createElement(field.value, ['notes-text']);
	 	const removeNote = createElement('RM', ['remove-note'], 'button');

	 	compileElement(newNote, [noteText, removeNote]);

	 	const uuid2 = generateId();

	 	container.appendChild(newNote);

	 	tasks[uuid].notes[uuid2] = {
	 		element: newNote,
	 		id: uuid2,
	 		text: noteText.innerHTML
	 	}

	 	removeNote.addEventListener('click', () => removeHandler(uuid2, tasks[uuid].notes));

	 	field.value = "";
	}

	const task = document.createElement('div');
	const btnContainer = document.createElement('div');
	const general = document.createElement('div');
	const notes = document.createElement('div');
	const newNotes = document.createElement('div');

	const taskText = createElement(text.value, ['task-text-major']);
	const addNotes = createElement('+Note', ['task-note', 'task-btn-major'], 'button');
	const taskLock = createElement('LK', ['lock-major', 'task-btn-major'], 'button');
	const taskRemove = createElement('RM', ['remove-major', 'task-btn-major'], 'button');

	const inputField = document.createElement("input");
	const addNotesBtn = createElement("+", ['add-notes', 'notes-btn'], 'button');

	inputField.setAttribute('type', 'text');
	inputField.classList.add("new-notes-field");

	compileElement(newNotes, [inputField, addNotesBtn]);
	compileElement(btnContainer, [addNotes, taskLock, taskRemove])

	newNotes.classList.add('hidden');
	newNotes.classList.add('new-notes-container');
	btnContainer.classList.add('btn-container');
	notes.classList.add('notes-container');
	general.classList.add('major-task-controller');

	compileElement(general, [taskText, btnContainer]);
	compileElement(task, [general, newNotes, notes]);

	const uuid = generateId();

	task.id = uuid;

	task.classList.add('generated-task-major');

	container.appendChild(task);

	tasks[uuid] = {
		element: task,
		id: uuid,
		text: taskText.innerHTML,
		notes: {},
		locked: false,
		buttons: [addNotes, taskRemove],
		newNotesField: newNotes,
		hidden: true
	}

	text.value = "";

	taskRemove.addEventListener('click', () => removeHandler(uuid, tasks));
	taskLock.addEventListener('click', () => lockHandler(uuid));
	addNotes.addEventListener('click', () => notesHandler(uuid));

	addNotesBtn.addEventListener('click', () => addNotesHandler(inputField, notes));

}

function addMinorTask() {
	const { newTaskText:text, minorContainer:container, minorTasks: tasks } = APP;
	if (!text.value) return;

	const task = document.createElement('div');
	const btnContainer = document.createElement('div');

	const taskText = createElement(text.value, ['task-text']);
	const taskCurrent = createElement('CU', ['task-current', 'task-btn'], 'button');
	const taskComplete = createElement('CP', ['task-complete', 'task-btn'], 'button');
	const taskRemove = createElement('RM', ['task-remove', 'task-btn'], 'button');

	compileElement(btnContainer, [ taskCurrent, taskComplete, taskRemove ]);
	compileElement(task, [taskText, btnContainer]);

	task.classList.add('generated-task');
	btnContainer.classList.add('btn-container');

	const uuid = generateId();

	task.id = uuid;

	container.appendChild(task);

	tasks[uuid] = {
		element: task,
		id: uuid,
		text: taskText.innerHTML,
		timer: {
			minutes: 0,
			seconds: 0
		}
	}

	taskCurrent.addEventListener('click', () => currentHandler(uuid));
	taskRemove.addEventListener('click', () => removeHandler(uuid, tasks));
	taskComplete.addEventListener('click', () => completeHandler(uuid, tasks));

	text.value = "";
}

function addScheduleTask(){
	const { newScheduleText:task, newScheduleDate:date, newScheduleHour:hour, newScheduleMinute:minute} = APP;

	if (!task.value || !date.value) return;

	if (!hour.value) hour.value = 0;

	if (!minute.value) minute.value = 0;

	let time = new Date(date.value);
	let offset = 3600000 * ((time.getTimezoneOffset() / 60) + parseInt(hour.value)) + 60000 * parseInt(minute.value);
	time = new Date(time.getTime() + offset);

	const uuid = generateId();

	APP.scheduleTasks.push({
		date: time,
		task: task.value,
		id: uuid
	})

	task.value = '';

	organizeSchedule();
}

function organizeSchedule() {
	const { scheduleContainer:container, scheduleTasks:tasks } = APP;

	container.innerHTML = '';
	tasks.sort((a, b) => a.date - b.date);

	tasks.forEach(task => {
		const hours = task.date.getHours();
		const minutes = task.date.getMinutes() > 9 ? task.date.getMinutes() : '0' + task.date.getMinutes();
		const scheduleTask = document.createElement('div');
		const taskText = createElement(task.task, ['scheduled-task']);
		const taskTime = createElement(`${task.date.toDateString()} | ${hours}:${minutes}`, ['date-time']);
		const remove = createElement('RM', ['task-remove'], 'button');

		compileElement(scheduleTask, [taskTime, taskText, remove]);

		remove.addEventListener('click', () => removeScheduledTask(tasks.id));
		container.appendChild(scheduleTask);
	})

	return;
}

function removeScheduledTask(uuid) {
	APP.scheduleTasks = APP.scheduleTasks.filter(n => n.id != uuid);
	organizeSchedule();
}

function notesHandler(id) {
	APP.majorTasks[id].hidden = !APP.majorTasks[id].hidden;
	if (APP.majorTasks[id].hidden) {
		APP.majorTasks[id].newNotesField.classList.add('hidden');
	}
	else {
		APP.majorTasks[id].newNotesField.classList.remove('hidden');
	}
}

function lockHandler(id) {
	const { majorTasks:tasks } = APP;
	tasks[id].locked = !tasks[id].locked;

	tasks[id].buttons.forEach(button => {
		if(tasks[id].locked) {
			button.setAttribute("disabled", "true");
		} else {
			button.removeAttribute("disabled");
		}
	})

	if (tasks[id].locked) {
		tasks[id].element.classList.add('isLocked');
	} else {
		tasks[id].element.classList.remove('isLocked');
	}
}

function currentHandler(id) {
	APP.clearTimer();
	APP.currentTaskText.innerHTML = APP.minorTasks[id].text;
	APP.currentTimer = timer(APP.minorTasks[id].timer);
}

function removeHandler(id, container) {
	container[id].element.remove();
	delete container[id];
}

function completeHandler(id, container) {
	const newCompleted = document.createElement('div');

	const completedTaskText = APP.minorTasks[id].text;
	const completedTaskTime = formatTime(APP.minorTasks[id].timer);

	const completedText = createElement(completedTaskText, ['completed-text']);
	const completedTime = createElement(completedTaskTime, ['completed-time']);
	const removeCompleted = createElement('RM', ['remove'], 'button');

	compileElement(newCompleted, [completedText, completedTime, removeCompleted]);

	APP.completedTasks[id] = {
		element: newCompleted,
		id: id,
		text: completedTaskText,
		timer: {
			minutes: APP.minorTasks[id].timer.minutes,
			seconds: APP.minorTasks[id].timer.seconds
		}
	}

	APP.completedContainer.appendChild(newCompleted);
	removeHandler(id, container);

	removeCompleted.addEventListener('click', () => removeHandler(id, APP.completedTasks));
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
	return `${timerObj.minutes > 9 ? timerObj.minutes : '0'+timerObj.minutes}:${timerObj.seconds > 9 ? timerObj.seconds : '0'+timerObj.seconds}`;
}

function hideBody(head, body, lighter){
	head.addEventListener('click', () => {
		body.style.display = `${body.style.display == 'none' ? 'flex' : 'none'}`;
		if (lighter.classList.contains('closed-lighter')){
			lighter.classList.remove('closed-lighter');
		}
		else {
			lighter.classList.add('closed-lighter');
		}
	})
}

APP.addMinorBtn.addEventListener('click', () => addMinorTask());
APP.addMajorBtn.addEventListener('click', () => addMajorTask());
APP.addSchedule.addEventListener('click', () => addScheduleTask());

APP.TOOLS.dictionary.addEventListener('click', () => openWindow(path.join(__dirname,'/tools/dictionary.tool.html'), 300, 450));
APP.TOOLS.calculator.addEventListener('click', () => openWindow(path.join(__dirname,'/tools/calculator.tool.html'), 400, 300));
APP.TOOLS.pomodoro.addEventListener('click', () => openWindow(path.join(__dirname,'/tools/pomodoro.tool.html'), 300, 400));

hideBody(APP.majorHeader, APP.majorContainer, APP.majorLighter);
hideBody(APP.minorHeader, APP.minorContainer, APP.minorLighter);
hideBody(APP.scheduleHeader, APP.scheduleContainer, APP.scheduleLighter);
hideBody(APP.completedHeader, APP.completedContainer, APP.completedLighter);

// Sets value of calandar to today on app launch
APP.setCurrentDate();
