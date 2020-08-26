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

module.exports = {getElement, createElement, compileElement};
