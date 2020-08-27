const path = require('path');
const {getElement} = require(path.join(__dirname, '../scripts/element-functions'));

const POMODORO = {
	minutes: 15,
	seconds: 0,
	// Pomodoro elements
	minutesDisplay: getElement('pomodoro-hours'),
	secondsDisplay: getElement('pomodoro-seconds'),
	add10: getElement('add-10'),
	add5: getElement('add-5'),
	subtract10: getElement('subtract-10'),
	subtract5: getElement('subtract-5'),
	// Controls
	play: getElement('play'),
	pause: getElement('pause'),
	resetBtn: getElement('reset'), 
	// Timer
	timer: null,
	clear: function() {
		clearInterval(this.timer);
	},
	reset: function(min, sec) {
		this.clear();
		this.minutes = min;
		this.seconds = sec;
		this.updateDisplay();
	},
	updateDisplay: function (){
		this.minutesDisplay.innerHTML = `${this.minutes > 9 ? this.minutes : '0'+ this.minutes}`;
		this.secondsDisplay.innerHTML = `${this.seconds > 9 ? this.seconds : '0'+ this.seconds}`;
	},
	updateTime: function(operation, amt) {
		if (operation == 'add') {
			this.minutes = this.minutes + amt;
		}
		else if (operation == 'subtract') {
			this.minutes = this.minutes - amt;
		}

		this.updateDisplay();
	},
	startTimer: function() {
		function countdown(){
			this.seconds--;
			if (this.seconds < 0) {
				if (this.minutes == 0) {
					this.clear();
					return;
				}
				this.minutes--;
				this.seconds = 59;
			}
			this.updateDisplay();
		}

		const boundCountdown = countdown.bind(this);

		this.timer = setInterval(boundCountdown, 1000);
	}
}

POMODORO.add10.addEventListener('click', () => POMODORO.updateTime('add', 10));
POMODORO.add5.addEventListener('click', () => POMODORO.updateTime('add', 5));
POMODORO.subtract10.addEventListener('click', () => POMODORO.updateTime('subtract', 10));
POMODORO.subtract5.addEventListener('click', () => POMODORO.updateTime('subtract', 5));

POMODORO.updateDisplay();

POMODORO.pause.addEventListener('click', () => POMODORO.clear());
POMODORO.resetBtn.addEventListener('click', () => POMODORO.reset(15, 0));
POMODORO.play.addEventListener('click', () => POMODORO.startTimer());
