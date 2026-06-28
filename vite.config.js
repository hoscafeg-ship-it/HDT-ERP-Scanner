import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/HDT-ERP-Scanner/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        cameraTest: resolve(__dirname, "tests/camera-test.html"),
      },
    },
  },
});