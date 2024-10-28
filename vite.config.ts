import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	server: {
		host: "0.0.0.0",
		port: 5544,
	},
	test: {
		globals: true,
		environment: "happy-dom",
	},
});
