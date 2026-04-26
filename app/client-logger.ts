"use client";

type ClientLogLevel = "debug" | "info" | "warn" | "error";
type ClientLogContext = Record<string, unknown>;

const MAX_STRING_LENGTH = 4_000;
const MAX_DEPTH = 4;
const ENDPOINT = "/api/client-logs";

const sessionId =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function truncate(value: string) {
  return value.length > MAX_STRING_LENGTH
    ? `${value.slice(0, MAX_STRING_LENGTH)}...[truncated]`
    : value;
}

function serialize(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: truncate(value.message),
      stack: value.stack ? truncate(value.stack) : undefined,
    };
  }

  if (value === null || typeof value !== "object") {
    return typeof value === "string" ? truncate(value) : value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  if (depth >= MAX_DEPTH) {
    return "[MaxDepth]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => serialize(item, depth + 1, seen));
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .slice(0, 50)
      .map(([key, item]) => [key, serialize(item, depth + 1, seen)])
  );
}

function send(level: ClientLogLevel, message: string, context: ClientLogContext) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify({
    level,
    message,
    context: serialize(context),
    sessionId,
    url: window.location.href,
    pathname: window.location.pathname,
    timestamp: new Date().toISOString(),
  });

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      ENDPOINT,
      new Blob([payload], { type: "application/json" })
    );
    if (sent) {
      return;
    }
  }

  fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // Client logging must never break the UI.
  });
}

export function createClientLogger(bindings: ClientLogContext) {
  const log = (level: ClientLogLevel, context: ClientLogContext, message: string) => {
    send(level, message, { ...bindings, ...context });
  };

  return {
    debug: (context: ClientLogContext, message: string) => log("debug", context, message),
    info: (context: ClientLogContext, message: string) => log("info", context, message),
    warn: (context: ClientLogContext, message: string) => log("warn", context, message),
    error: (context: ClientLogContext, message: string) => log("error", context, message),
  };
}
