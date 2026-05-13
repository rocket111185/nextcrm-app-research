# Observability

NextCRM ships local observability through Docker Compose:

- OpenTelemetry is registered in `instrumentation.ts` with `@vercel/otel`.
- Pino emits structured JSON logs and includes active `trace_id` / `span_id` when a trace is active.
- Pino log records are exported to OpenTelemetry Logs through OTLP/gRPC by default.
- OpenTelemetry Collector receives OTLP traces and logs on `4317` / `4318`.
- Loki stores logs and Grafana is pre-provisioned with Loki as the default data source.

The Compose stack persists logs in Loki. Traces are accepted by the Collector and exported to its debug output; add Tempo later if you want durable trace storage in Grafana.

## Local Usage

Start the observability stack:

```sh
docker compose up -d loki otel-collector grafana
```

The bind mounts in `docker-compose.yml` include `:z` so SELinux-based hosts can let the containers read the local config files.

Run the app with direct OTLP log export enabled:

```sh
OTEL_SERVICE_NAME=nextcrm-app \
OTEL_LOGS_EXPORTER=otlp \
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317 \
OTEL_EXPORTER_OTLP_PROTOCOL=grpc \
pnpm dev
```

For platforms where the Node.js gRPC exporter is not available, use OTLP over
HTTP/protobuf instead:

```sh
OTEL_SERVICE_NAME=nextcrm-app \
OTEL_LOGS_EXPORTER=otlp \
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
pnpm dev
```

Open Grafana at `http://localhost:3001` and query Loki:

```logql
{service_name="nextcrm-app"} | json
```

Useful environment variables:

- `LOG_LEVEL`: defaults to `debug` in development and `info` in production.
- `OTEL_LOGS_EXPORTER=otlp`: enables the Pino-to-OpenTelemetry log stream.
- `OTEL_EXPORTER_OTLP_PROTOCOL`: defaults to `grpc`; use `http/protobuf` when gRPC is not supported.
- `OTEL_EXPORTER_OTLP_ENDPOINT`: use `http://localhost:4317` for local gRPC, or `http://otel-collector:4317` from a Compose-managed app container.
- `LOG_FILE_PATH`: optionally writes an additional local Pino JSON log file for debugging; the Collector no longer depends on this file.
- `PINO_PRETTY=true`: pretty-prints console logs.
- `OTEL_TRACES_SAMPLER` / `OTEL_TRACES_SAMPLER_ARG`: standard OpenTelemetry sampling controls.
