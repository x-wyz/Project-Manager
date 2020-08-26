function openWindow(src, height=700, width=550) {
    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;
    const win = new BrowserWindow({
        height: height,
        width: width,
        webPreferences: {
          nodeIntegration: true,
        }
    });
    win.loadURL(src);
    // win.removeMenu();
}

module.exports = { openWindow }
