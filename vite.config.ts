import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@core": fileURLToPath(new URL("./src/core", import.meta.url)),
      "@entities": fileURLToPath(new URL("./src/entities", import.meta.url)),
      "@interfaces": fileURLToPath(new URL("./src/interfaces", import.meta.url)),
      "@ui": fileURLToPath(new URL("./src/ui", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
    },
  },
});
