import { resolve } from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

export default defineConfig(() => {
  return {
    build: {
      lib: {
        entry: "core/index.ts",
        name: "index",
        formats: ["es"],
        fileName: (format) => `[name].${format}.js`
      },
      rollupOptions: {
        external: [...Object.keys(pkg.peerDependencies), /jsx-runtime/g]
      }
    },
    plugins: [
      react(),
      dts({
        rollupTypes: true
      })
    ],
    resolve: {
      alias: [
        {
          find: `@core`,
          replacement: resolve(__dirname, "core")
        },
        {
          find: `@hooks`,
          replacement: resolve(__dirname, "hooks")
        },
        {
          find: `@utils`,
          replacement: resolve(__dirname, "utils")
        }
      ]
    }
  };
});
