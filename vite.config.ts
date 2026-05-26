import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isProductionBuild = process.env.NODE_ENV === "production";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  vite: {
    base: isProductionBuild ? "/MyPrivateSpace/" : "/",
  },
});