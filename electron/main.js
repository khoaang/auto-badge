const { app, BrowserWindow } = require("electron");
const path = require("path");

app.commandLine.appendSwitch("kiosk-printing", "");

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 920,
        kiosk: true,
    });
    win.loadFile("src/index.html");
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
