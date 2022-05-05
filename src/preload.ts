import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("sentenceBase", {
  getCurrentClipboardEntry: async () =>
    await ipcRenderer.invoke("getCurrentClipboardEntry"),
});
