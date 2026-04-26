import { createLogger } from "@/lib/logger";
import { NextResponse } from "next/server";

const logger = createLogger({ module: "app.api.client-logs" });
const levels = new Set(["debug", "info", "warn", "error"]);
const MAX_BODY_BYTES = 64 * 1024;

interface ClientLogBody {
  context?: unknown;
  level?: unknown;
  message?: unknown;
  pathname?: unknown;
  sessionId?: unknown;
  timestamp?: unknown;
  url?: unknown;
}

function limitString(value: unknown, fallback: string) {
  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  return value.length > 1_000 ? `${value.slice(0, 1_000)}...[truncated]` : value;
}

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: ClientLogBody;
  try {
    const parsed = await req.json();
    body = parsed && typeof parsed === "object" ? (parsed as ClientLogBody) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const level = typeof body.level === "string" && levels.has(body.level) ? body.level : "info";
  const message = limitString(body?.message, "Client log");
  const payload = {
    client: {
      sessionId: limitString(body?.sessionId, "unknown"),
      pathname: limitString(body?.pathname, "unknown"),
      url: limitString(body?.url, "unknown"),
      timestamp: limitString(body?.timestamp, "unknown"),
      userAgent: limitString(req.headers.get("user-agent"), "unknown"),
    },
    context: body.context && typeof body.context === "object" ? body.context : {},
  };

  switch (level) {
    case "debug":
      logger.debug(payload, message);
      break;
    case "warn":
      logger.warn(payload, message);
      break;
    case "error":
      logger.error(payload, message);
      break;
    default:
      logger.info(payload, message);
  }

  return new NextResponse(null, { status: 204 });
}
