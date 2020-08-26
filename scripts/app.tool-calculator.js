let path = require('path');
let {getElement} = require(path.join(__dirname, '../scripts/element-functions'));

function addValue(baseElement, modifierElement, value, event="click") {
	modifierElement.addEventListener(event, () => {
		baseElement.innerHTML = `${baseElement.innerHTML == 0 ? value : baseElement.innerHTML + value}`;
	})
}

// without eval()
function calculate(equation){
	let equationFragment = equation.split(" ").filter(n => n);
	let orderOfOperations = ['/', '*', '+', '-'];
	let operations = ['divide', 'multiply', 'add', 'subtract'];
	let currentOperation = 0;

	while (equationFragment.length > 1) {
		if (equationFragment.indexOf('(') != -1) {
			let result = calculate(equationFragment.slice(equationFragment.indexOf('(') + 1, equationFragment.indexOf(')')).join(" "));
			equationFragment.splice(equationFragment.indexOf('('), equationFragment.indexOf(')') - equationFragment.indexOf('(') + 1, result);
		}
		else {
			let operation = equationFragment.indexOf(orderOfOperations[currentOperation]);
			let x = operation - 1;
			let y = operation + 1;

			if (operation != -1){
				let result = mathFunctions[operations[currentOperation]](equationFragment[x], equationFragment[y]).toString();
				equationFragment.splice(x, 3, result);
				continue;
			}
			else {
				currentOperation++;
			}
		}
	}
	return equationFragment.join("");
}

const mathFunctions = {
	add: function(x, y=0) {
		return parseFloat(x) + parseFloat(y);
	},
	subtract: function(x, y=0) {
		return parseFloat(x) - parseFloat(y);
	},
	multiply: function(x, y=0) {
		return parseFloat(x) * parseFloat(y);
	},
	divide: function(x, y=1) {
		return parseFloat(x) / parseFloat(y);
	}
}

/* With Eval

function calculateEval(equation){
	results.innerHTML = eval(equation);
}

*/

const CALCULATOR = {
	// Number Elements
	zero: getElement('zero'),
	one: getElement('one'),
	two: getElement('two'),
	three: getElement('three'),
	four: getElement('four'),
	five: getElement('five'),
	six: getElement('six'),
	seven: getElement('seven'),
	eight: getElement('eight'),
	nine: getElement('nine'),

	// Operation Elements
	add: getElement('add'),
	subtract: getElement('subtract'),
	multiply: getElement('multiply'),
	divide: getElement('divide'),
	equal: getElement('equal'),

	// Others
	flipSign: getElement('flipSign'),
	decimal: getElement('decimal'),
	switch: getElement('switch'),
	history: getElement('history'),
	clear: getElement('clear'),
	openParen: getElement('openParen'),
	closeParen: getElement('closeParen'),

	// Results
	calculatorResults: getElement('calculator-results'),
}

const { calculatorResults:results } = CALCULATOR;

addValue(results, CALCULATOR.one, '1');
addValue(results, CALCULATOR.two, '2');
addValue(results, CALCULATOR.three, '3');
addValue(results, CALCULATOR.four, '4');
addValue(results, CALCULATOR.five, '5');
addValue(results, CALCULATOR.six, '6');
addValue(results, CALCULATOR.seven, '7');
addValue(results, CALCULATOR.eight, '8');
addValue(results, CALCULATOR.nine, '9');
addValue(results, CALCULATOR.zero, '0');

addValue(results, CALCULATOR.add, ' + ');
addValue(results, CALCULATOR.subtract, ' - ');
addValue(results, CALCULATOR.multiply, ' * ');
addValue(results, CALCULATOR.divide, ' / ');

addValue(results, CALCULATOR.openParen, ' ( ');
addValue(results, CALCULATOR.closeParen, ' ) ');

CALCULATOR.equal.addEventListener('click', () => {
	results.innerHTML = calculate(results.innerHTML);
})

CALCULATOR.clear.addEventListener('click', () => {
	results.innerHTML = '0';
})