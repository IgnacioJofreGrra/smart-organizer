<<<<<<< HEAD
const { dialog } = require("electron");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  organizarArchivos: (ruta) => ipcRenderer.invoke("organizar-archivos", ruta),
  seleccionarCarpeta: () => ipcRenderer.invoke("seleccionar-carpeta"),
  revertirOrganizacion: (ruta) => ipcRenderer.invoke("revertir-organizacion", ruta) // ✅ nuevo
});
=======
const { dialog } = require("electron");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  organizarArchivos: (ruta) => ipcRenderer.invoke("organizar-archivos", ruta),
  seleccionarCarpeta: () => ipcRenderer.invoke("seleccionar-carpeta"),
  revertirOrganizacion: (ruta) => ipcRenderer.invoke("revertir-organizacion", ruta) // ✅ nuevo
});
>>>>>>> 175db49a9bfe356904395033af855f200abeda53
