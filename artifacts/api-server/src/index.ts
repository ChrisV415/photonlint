import app from "./app";
import { logger } from "./lib/logger";

// ── Crash safety — log before the process dies ────────────────────────────────
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception — exiting");
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.fatal({ reason }, "Unhandled promise rejection — exiting");
  process.exit(1);
});

// ── Port validation ───────────────────────────────────────────────────────────
const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error(
    `Invalid PORT value: "${rawPort}". Must be an integer between 1 and 65535.`,
  );
}

// ── Start server ──────────────────────────────────────────────────────────────
const server = app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
// Allow in-flight requests to complete before the process exits. Gives the
// orchestrator (Docker, Fly, Replit) time to drain connections cleanly.
function shutdown(signal: string) {
  logger.info({ signal }, "Shutdown signal received — closing server");
  server.close((err) => {
    if (err) {
      logger.error({ err }, "Error closing HTTP server");
      process.exit(1);
    }
    logger.info("HTTP server closed — process exiting");
    process.exit(0);
  });

  // If the server hasn't closed within 10 s, force-exit.
  setTimeout(() => {
    logger.warn("Graceful shutdown timed out after 10 s — forcing exit");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
