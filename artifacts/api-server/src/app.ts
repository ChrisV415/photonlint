import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors, { type CorsOptions } from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import multer from "multer";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ── Structured logging ────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── Security headers ──────────────────────────────────────────────────────────
// Sets X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.
// This is a JSON API so the CSP header is not relevant, but the rest are.
app.use(helmet({ contentSecurityPolicy: false }));

// ── Clerk proxy — must be BEFORE body parsers ─────────────────────────────────
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// ── CORS ──────────────────────────────────────────────────────────────────────
const REPLIT_DEV_DOMAIN = process.env["REPLIT_DEV_DOMAIN"];
const EXTRA_ALLOWED_ORIGIN = process.env["ALLOWED_ORIGIN"];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // null origin = same-origin / server-to-server request (curl, health checks) — allow
    if (!origin) { callback(null, true); return; }
    // Only allow the specific Replit dev domain for this repl, not all *.replit.dev
    const isDevDomain =
      REPLIT_DEV_DOMAIN !== undefined && origin === `https://${REPLIT_DEV_DOMAIN}`;
    const isExtraAllowed = EXTRA_ALLOWED_ORIGIN !== undefined && origin === EXTRA_ALLOWED_ORIGIN;
    callback(null, isDevDomain || isExtraAllowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "X-Override-Key"],
};

app.use(cors(corsOptions));

// ── Clerk auth middleware ─────────────────────────────────────────────────────
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

// ── Body parsers ──────────────────────────────────────────────────────────────
// 2 MB cap on JSON bodies — enough for the largest CLI import payload (violation
// metadata only; raw GDS geometry is stripped before upload). Requests that
// exceed the limit get a 413 before any route handler runs.
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use("/api", router);

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Maximum upload size is 50 MB."
        : `Upload error: ${err.message}`;
    res.status(400).json({ error: msg });
    return;
  }

  if (err instanceof Error) {
    if (err.message.startsWith("Only .gds")) {
      res.status(400).json({ error: err.message });
      return;
    }
    logger.error({ err }, "Unhandled route error");
    res.status(500).json({ error: "An unexpected server error occurred." });
    return;
  }

  logger.error({ err }, "Unknown error type");
  res.status(500).json({ error: "An unexpected server error occurred." });
});

export default app;
