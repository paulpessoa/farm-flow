import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(_on, config) {
      // Merge env variables
      config.env = {
        ...config.env,
        apiUrl: process.env.VITE_API_URL || config.env.API_URL,
      };
      return config;
    },
  },
});
