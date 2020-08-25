const getElement = (id) => document.getElementById(id);

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
}

const majorTasks = {}
const minorTasks = {}
const scheduleTasks = {}
const completedTasks = {}


