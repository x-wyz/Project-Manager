const fs = require('fs');
const { dialog } = require('electron').remote;


function createNewProject(reset){
	// Only confirms if user wants to reset page to default, main app still supplies reset function
	const resetConfirm = confirm("Are you sure you want to reset and create a new project? (Unsaved data will be deleted)");
	if (resetConfirm) {
		reset();
	}
}

function saveProject(data){
	const content = JSON.stringify(data);
	// Sometimes file will save only after app is reset or closed
	dialog.showSaveDialog({}).then(result => {
		const filePath = result.filePath;
		fs.writeFile(filePath, content, err => {
			if (err) {
				alert('An error occurred while trying to save your file');
			}
		})
	})
}

function openProject(build){
	dialog.showOpenDialog({ properties: ['openFile'] }).then(result => {
		const filePath = result.filePaths[0];
		const fileData = fs.readFileSync(filePath, 'utf-8');
		// This supplies the data main app still needs to build it
		build(fileData);
	})
}

module.exports = { createNewProject, saveProject, openProject };
