import { fileURLToPath } from "node:url";
import { extname, resolve } from "path";

import react from "@vitejs/plugin-react-swc";
import { glob } from "glob";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const inputs = ["hooks", "utils", "core"];

export default defineConfig({
  build: {
    lib: {
      entry: inputs
    },
    rollupOptions: {
      external: [/react/g, /react-dom/g],
      input: Object.fromEntries(
        inputs
          .map((input) =>
            glob
              .sync(`${input}/**/*.{ts,tsx}`)
              .map((file) => [
                file.slice(0, file.length - extname(file).length),
                fileURLToPath(new URL(file, import.meta.url))
              ])
          )
          .flat()
      ),
      output: [
        {
          interop: "auto",
          format: "es",
          banner: (_) => "",
          manualChunks: (id) => {
            if (id.indexOf("node_modules") !== -1) {
              return "core/vendor";
            }

            return null;
          },
          entryFileNames: "[name].mjs"
        }
      ]
    }
  },
  plugins: [react(), dts()],
  resolve: {
    alias: inputs.map((input) => ({
      find: `@${input}`,
      replacement: resolve(__dirname, input)
    }))
  }
});
