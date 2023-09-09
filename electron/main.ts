process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
import { app, BrowserWindow, ipcMain, screen, Notification } from "electron";
import path from "node:path";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  // use secondary monitor for window if available
  const mainScreen = screen.getAllDisplays();
  const externalDisplay = mainScreen.find(
    (display) => display.bounds.x !== 0 || display.bounds.y !== 0,
  );
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "images/icon.png"),
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      webSecurity: false,
    },
    x: externalDisplay ? externalDisplay.bounds.x : 0,
    y: externalDisplay ? externalDisplay.bounds.y : 0,
    width: externalDisplay ? externalDisplay.bounds.width : width,
    height: externalDisplay ? externalDisplay.bounds.height : height,
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-screen-fn", mainScreen);
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
  }

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handler
app.on("ready", async () => {
  ipcMain.on("notification", (_event, message) => {
    const title = message.title;
    const body = message.body;

    // console.log(Notification.isSupported());
    const notification = new Notification({
      icon: path.join(process.env.VITE_PUBLIC, "images/icon.png"),
      title: title,
      body: body,
    });
    notification.show();
  });

  // ipcMain.on("new-window", async (_event, url) => {
  //   let newWin: BrowserWindow | null;
  //   newWin = new BrowserWindow({
  //     title: "New Window",
  //     icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
  //     width: 800,
  //     height: 600,
  //     webPreferences: {
  //       contextIsolation: false,
  //       nodeIntegrationInWorker: true,
  //       nodeIntegration: true,
  //       webSecurity: false,
  //     },
  //   });
  //   console.log(url);
  //   await newWin.loadURL(url);
  //   newWin.webContents.openDevTools();
  //   newWin?.webContents.send("new-window-reply", "success");
  // });
});

app.whenReady().then(createWindow);
