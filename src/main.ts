import { createApp } from "vue";
// import { ipcRenderer } from "electron";
import "./css/style.css";
import App from "./App.vue";

createApp(App)
  .mount("#app")
  .$nextTick(() => {
    // Remove Preload scripts loading
    // postMessage({ payload: 'removeLoading' }, '*')
    // Use contextBridge
    // ipcRenderer.on("main-process-message", (_event, message) => {
    //   console.log(message);
    // });
  });
