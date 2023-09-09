<script setup lang="ts">
import CalendarWidget from "@/components/CalendarWidget.vue";
// import { ipcRenderer } from "electron";
// // import { onMounted } from "vue";
// const viteServer = process.env["VITE_DEV_SERVER_URL"];

// // onMounted(async () => {
// //   await ipcRenderer.on("main-screen-fn", (_e, data) => {
// //     console.log(data);
// //     // console.log("update-from-page", data);
// //   });
// // });

// const onNewWindow = async () => {
//   // console.log(viteServer);
//   await ipcRenderer.send("new-window", `${viteServer}new-window`);
//   await ipcRenderer.on("new-window-reply", (_e, data) => {
//     console.log(data);
//   });
// };
</script>
<template>
  <!-- <button @click="onNewWindow">New Window</button> -->
  <div class="container p-4 mx-auto">
    <CalendarWidget />
  </div>
</template>
