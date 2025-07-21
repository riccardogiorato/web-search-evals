import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    testTimeout: 20000, // 20 seconds for all tests
    reporters: ["html", "default"],
  },
});
