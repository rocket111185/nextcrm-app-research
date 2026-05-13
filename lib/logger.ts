import { context, trace } from "@opentelemetry/api";
import { mkdirSync } from "node:fs";
import { hostname } from "node:os";
import { dirname, resolve } from "node:path";
import pino from "pino";
import { createOtelLogStream } from "./otel-log-stream";

const serviceName = process.env.OTEL_SERVICE_NAME || "nextcrm-app";
const environment = process.env.NODE_ENV || "development";
const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");

function getTraceBindings() {
  const spanContext = trace.getSpan(context.active())?.spanContext();

  if (!spanContext || !trace.isSpanContextValid(spanContext)) {
    return {};
  }

  return {
    trace_id: spanContext.traceId,
    span_id: spanContext.spanId,
    trace_flags: spanContext.traceFlags.toString(16).padStart(2, "0"),
  };
}

function createLogStreams(): pino.MultiStreamRes | pino.DestinationStream {
  const streams: pino.StreamEntry[] = [];
  const prettyLogs = process.env.PINO_PRETTY === "true";
  const otelLogStream = createOtelLogStream({ environment, serviceName });

  streams.push({
    level: logLevel as pino.Level,
    stream: prettyLogs
      ? pino.transport({
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        })
      : pino.destination({ dest: 1, sync: false }),
  });

  if (process.env.LOG_FILE_PATH) {
    const logFilePath = resolve(process.cwd(), process.env.LOG_FILE_PATH);
    mkdirSync(dirname(logFilePath), { recursive: true });

    streams.push({
      level: logLevel as pino.Level,
      stream: pino.destination({ dest: logFilePath, sync: false }),
    });
  }

  if (otelLogStream) {
    streams.push({
      level: logLevel as pino.Level,
      stream: otelLogStream,
    });
  }

  return streams.length === 1 ? streams[0].stream : pino.multistream(streams, { dedupe: true });
}

export const logger = pino(
  {
    base: {
      service: serviceName,
      environment,
      pid: process.pid,
      hostname: hostname(),
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    level: logLevel,
    messageKey: "message",
    mixin: getTraceBindings,
    redact: {
      censor: "[REDACTED]",
      paths: [
        "authorization",
        "cookie",
        "password",
        "secret",
        "token",
        "apiKey",
        "headers.authorization",
        "headers.cookie",
        "*.authorization",
        "*.cookie",
        "*.password",
        "*.secret",
        "*.token",
        "*.apiKey",
      ],
    },
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  createLogStreams()
);

export function createLogger(bindings: pino.Bindings) {
  return logger.child(bindings);
}
