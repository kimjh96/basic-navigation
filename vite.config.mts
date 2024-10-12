import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: "index.ts",
        name: "basic-stack-router"
      },
      rollupOptions: {
        external: [...Object.keys(pkg.peerDependencies), /jsx-runtime/g]
      }
    },
    plugins: [react(), dts()]
  };
});
