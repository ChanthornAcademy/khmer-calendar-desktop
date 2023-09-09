import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: "electron/main.ts",
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, "electron/preload.ts"),
      },
      // Ployfill the Electron and Node.js built-in modules for Renderer process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {
        resolve: {
          // C/C++ modules must be pre-bundle
          serialport: { type: "cjs" },
          // `esm` modules only if Vite does not pre-bundle them correctly
          got: { type: "esm" },
        },
      },
    }),
  ],
  build: {
    minify: false,
  },
  optimizeDeps: {
    // If an npm package is a pure ESM format package,
    // and the packages it depends on are also in ESM format,
    // then put it in `optimizeDeps.exclude` and it will work normally.
    // exclude: ['only-support-pure-esmodule-package'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
