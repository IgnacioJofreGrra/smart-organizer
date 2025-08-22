<<<<<<< HEAD
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { organizarDirectorio, revertirOrganizacion } = require("./logic/organizer"); // ✅ ahora incluye revertirOrganizacion

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile("renderer/index.html");
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("organizar-archivos", async (_, ruta) => {
    return await organizarDirectorio(ruta);
  });

  ipcMain.handle("revertir-organizacion", async (_, ruta) => { // ✅ nuevo handler
    return await revertirOrganizacion(ruta);
  });

  ipcMain.handle("seleccionar-carpeta", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
    return result.canceled ? null : result.filePaths[0];
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
=======
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { organizarDirectorio, revertirOrganizacion } = require("./logic/organizer"); // ✅ ahora incluye revertirOrganizacion

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile("renderer/index.html");
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("organizar-archivos", async (_, ruta) => {
    return await organizarDirectorio(ruta);
  });

  ipcMain.handle("revertir-organizacion", async (_, ruta) => { // ✅ nuevo handler
    return await revertirOrganizacion(ruta);
  });

  ipcMain.handle("seleccionar-carpeta", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
    return result.canceled ? null : result.filePaths[0];
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
>>>>>>> 175db49a9bfe356904395033af855f200abeda53
