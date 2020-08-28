// setup
let path = require('path');
let dictPath = path.join(__dirname, '../node_modules/owlbot-js');
let {getElement, compileElement, createElement} = require(path.join(__dirname, '../scripts/element-functions'));

let token = 'a5fbdc0fc742739bb0359e5baa5fe92959c6d748';
let Owlbot = require(dictPath);

let client = Owlbot(token);

// dictionary elements
const DICTIONARY = {
	define: getElement('lookup-btn'),
	definition: getElement('definition'),
	word: getElement('word-lookup'),
	clear: function() {
		this.definition.innerHTML = '';
	},
	addDefinition: function(def, type) {
		let container = document.createElement('div');
		let tag = createElement(type, ['type']);
		let definition = createElement(def, ['definition']);
		container.classList.add('def-container');
		compileElement(container, [tag, definition]);
		this.definition.appendChild(container);
	}
}

function define(word) {
	client.define(word)
	.then( result => result.definitions)
	.then( definitions => {
		DICTIONARY.clear();
		for (let i = 0; i < definitions.length; i++) {
			DICTIONARY.addDefinition(definitions[i].definition, definitions[i].type);
		}
		DICTIONARY.word.value = '';
	})
	.catch( error => {
		DICTIONARY.clear();
		if (error.toString() == 'Error: Network Error') {
			DICTIONARY.addDefinition(`Unable to connect to the internet.`, 'Network Error');
			return;
		}
		DICTIONARY.addDefinition(`Unable to lookup definition for: ${DICTIONARY.word.value}`, 'Error');
		DICTIONARY.word.value = '';
	})
}

DICTIONARY.define.addEventListener('click', () => define(DICTIONARY.word.value));
