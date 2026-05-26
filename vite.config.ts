import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

const isProductionBuild = process.env.NODE_ENV === "production";

export default defineConfig({
  base: isProductionBuild ? "/MyPrivateSpace/" : "/",
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tsConfigPaths(),
    tailwindcss(),
  ],
});
