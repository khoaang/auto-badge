const { app, BrowserWindow } = require("electron");
const path = require("path");
const ipc = require("electron").ipcMain;

app.commandLine.appendArgument("kiosk-printing");

if (require("electron-squirrel-startup")) return app.quit();

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 850,
        height: 800,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        },
    });
    win.loadFile("src/index.html");

    win.webContents.on("did-finish-load", function () {
        ipc.on("silent-print", (event, arg) => {
            console.log("Print request received");
            win.webContents.print({ pageRanges: "1", silent: true, printBackground: true, pageSize: {width:54000 , height:86000}});
            win.webContents.send("silent-print-response", "done");
            console.log("Done");
        });
    });
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
