import { context } from "@opentelemetry/api";
import { SeverityNumber, type LogAttributes, type LogBody } from "@opentelemetry/api-logs";
import { OTLPLogExporter as OTLPGrpcLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import { OTLPLogExporter as OTLPHttpLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
  type LogRecordExporter,
} from "@opentelemetry/sdk-logs";
import type pino from "pino";

const RESERVED_PINO_FIELDS = new Set(["level", "time", "timestamp", "message", "msg", "v"]);

type PinoLogRecord = Record<string, unknown>;

interface OtelLogState {
  provider: LoggerProvider;
  stream: pino.DestinationStream;
}

const globalForOtelLogs = globalThis as typeof globalThis & {
  __nextcrmOtelLogState?: OtelLogState;
  __nextcrmOtelLogShutdownHookRegistered?: boolean;
};

function isOtelLogExportEnabled() {
  const logsExporter = process.env.OTEL_LOGS_EXPORTER?.trim().toLowerCase();

  if (logsExporter === "none") {
    return false;
  }

  if (logsExporter === "otlp") {
    return true;
  }

  return Boolean(
    process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT ||
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  );
}

function createLogExporter(): LogRecordExporter {
  const protocol = (
    process.env.OTEL_EXPORTER_OTLP_LOGS_PROTOCOL ||
    process.env.OTEL_EXPORTER_OTLP_PROTOCOL ||
    "grpc"
  )
    .trim()
    .toLowerCase();

  if (protocol === "http/protobuf" || protocol === "http/json") {
    return new OTLPHttpLogExporter();
  }

  return new OTLPGrpcLogExporter();
}

function severityFromPinoLevel(level: unknown) {
  if (typeof level === "number") {
    if (level >= 60) return { severityNumber: SeverityNumber.FATAL, severityText: "fatal" };
    if (level >= 50) return { severityNumber: SeverityNumber.ERROR, severityText: "error" };
    if (level >= 40) return { severityNumber: SeverityNumber.WARN, severityText: "warn" };
    if (level >= 30) return { severityNumber: SeverityNumber.INFO, severityText: "info" };
    if (level >= 20) return { severityNumber: SeverityNumber.DEBUG, severityText: "debug" };
    return { severityNumber: SeverityNumber.TRACE, severityText: "trace" };
  }

  switch (String(level).toLowerCase()) {
    case "trace":
      return { severityNumber: SeverityNumber.TRACE, severityText: "trace" };
    case "debug":
      return { severityNumber: SeverityNumber.DEBUG, severityText: "debug" };
    case "warn":
      return { severityNumber: SeverityNumber.WARN, severityText: "warn" };
    case "error":
      return { severityNumber: SeverityNumber.ERROR, severityText: "error" };
    case "fatal":
      return { severityNumber: SeverityNumber.FATAL, severityText: "fatal" };
    default:
      return { severityNumber: SeverityNumber.INFO, severityText: "info" };
  }
}

function timestampFromPinoRecord(record: PinoLogRecord) {
  const value = record.time ?? record.timestamp;

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const millis = Date.parse(value);
    return Number.isFinite(millis) ? new Date(millis) : undefined;
  }

  return undefined;
}

function attributesFromPinoRecord(record: PinoLogRecord) {
  const attributes: LogAttributes = {};

  for (const [key, value] of Object.entries(record)) {
    if (RESERVED_PINO_FIELDS.has(key) || value === undefined) {
      continue;
    }

    attributes[key] = value as LogAttributes[string];
  }

  return attributes;
}

function bodyFromPinoRecord(record: PinoLogRecord) {
  const body = record.message ?? record.msg;

  if (
    body === null ||
    typeof body === "string" ||
    typeof body === "number" ||
    typeof body === "boolean"
  ) {
    return body;
  }

  if (Array.isArray(body) || typeof body === "object") {
    return body as LogBody;
  }

  return undefined;
}

function registerShutdownHook(provider: LoggerProvider) {
  if (globalForOtelLogs.__nextcrmOtelLogShutdownHookRegistered) {
    return;
  }

  process.once("beforeExit", () => {
    void provider.forceFlush().catch(() => undefined);
  });

  globalForOtelLogs.__nextcrmOtelLogShutdownHookRegistered = true;
}

export function createOtelLogStream({
  environment,
  serviceName,
}: {
  environment: string;
  serviceName: string;
}) {
  if (!isOtelLogExportEnabled()) {
    return undefined;
  }

  if (globalForOtelLogs.__nextcrmOtelLogState) {
    return globalForOtelLogs.__nextcrmOtelLogState.stream;
  }

  const provider = new LoggerProvider({
    resource: resourceFromAttributes({
      "deployment.environment": environment,
      "service.name": serviceName,
    }),
    processors: [new BatchLogRecordProcessor(createLogExporter())],
  });
  const otelLogger = provider.getLogger("nextcrm-pino");

  const stream: pino.DestinationStream = {
    write(message: string) {
      for (const line of message.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) {
          continue;
        }

        try {
          const record = JSON.parse(trimmed) as PinoLogRecord;
          const { severityNumber, severityText } = severityFromPinoLevel(record.level);

          otelLogger.emit({
            attributes: attributesFromPinoRecord(record),
            body: bodyFromPinoRecord(record),
            context: context.active(),
            observedTimestamp: new Date(),
            severityNumber,
            severityText,
            timestamp: timestampFromPinoRecord(record),
          });
        } catch {
          otelLogger.emit({
            body: trimmed,
            context: context.active(),
            observedTimestamp: new Date(),
            severityNumber: SeverityNumber.INFO,
            severityText: "info",
          });
        }
      }
    },
  };

  globalForOtelLogs.__nextcrmOtelLogState = { provider, stream };
  registerShutdownHook(provider);

  return stream;
}
