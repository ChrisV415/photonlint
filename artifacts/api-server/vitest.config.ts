import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Give DB-backed integration tests a generous timeout
    testTimeout: 15_000,
    // Exclude compiled output — vitest's default glob matches *.test.js which
    // would otherwise also pick up files under dist/ and fail on their
    // relative import paths.
    exclude: ["**/dist/**", "**/node_modules/**"],
  },
});
