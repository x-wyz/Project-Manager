const getElement = (id) => document.getElementById(id);

function createElement(txt, classes, type='p'){
	const element = document.createElement(type);
	element.innerHTML = txt;
	for (let i = 0; i < classes.length; i++) {
		element.classList.add(classes[i]);
	}
	return element;
}

function compileElement(ele, elements){
	for (let i = 0; i < elements.length; i++) {
		ele.appendChild(elements[i]);
	}
}

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
	// ****
	currentTimer: null,
	clearTimer: function(){
		clearInterval(this.currentTimer);
	}
}

const minorTasks = {};
const completedTasks = {};

function addMinorTask() {
	if (!APP.newTaskText.value) return;

	const task = document.createElement('div');

	const taskText = createElement(APP.newTaskText.value, ['task-text']);
	const taskCurrent = createElement('CU', ['task-current', 'task-btn']);
	const taskComplete = createElement('CP', ['task-complete', 'task-btn']);
	const taskRemove = createElement('RM', ['task-complete', 'task-btn']);

	compileElement(task, [taskText, taskCurrent, taskComplete, taskRemove]);

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
	taskRemove.addEventListener('click', () => removeHandler(uuid));
	taskComplete.addEventListener('click', () => completeHandler(uuid));

	APP.newTaskText.value = "";
}

function currentHandler(id) {
	APP.clearTimer();
	APP.currentTaskText.innerHTML = minorTasks[id].text;
	APP.currentTimer = timer(minorTasks[id].timer);
}

function removeHandler(id) {
	minorTasks[id].element.remove();
	delete minorTasks[id];
}

function completeHandler(id) {
	const newCompleted = document.createElement('div');

	const completedTaskText = minorTasks[id].text;
	const completedTaskTime = formatTime(minorTasks[id].timer);

	const completedText = createElement(completedTaskText, ['completed-text']);
	const completedTime = createElement(completedTaskTime, ['completed-time']);
	const removeCompleted = createElement('RM', ['remove']);

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
	removeHandler(id);
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
