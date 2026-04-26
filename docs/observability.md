# Observability

NextCRM ships local observability through Docker Compose:

- OpenTelemetry is registered in `instrumentation.ts` with `@vercel/otel`.
- Pino emits structured JSON logs and includes active `trace_id` / `span_id` when a trace is active.
- OpenTelemetry Collector receives OTLP traces on `4317` / `4318` and tails Pino log files from `logs/*.log`.
- Loki stores logs and Grafana is pre-provisioned with Loki as the default data source.

The Compose stack persists logs in Loki. Traces are accepted by the Collector and exported to its debug output; add Tempo later if you want durable trace storage in Grafana.

## Local Usage

Start the observability stack:

```sh
docker compose up -d loki otel-collector grafana
```

The bind mounts in `docker-compose.yml` include `:z` so SELinux-based hosts can let the containers read the local config files.

Run the app with OTLP export and file logging enabled:

```sh
OTEL_SERVICE_NAME=nextcrm-app \
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 \
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf \
LOG_FILE_PATH=logs/nextcrm.log \
pnpm dev
```

Open Grafana at `http://localhost:3001` and query Loki:

```logql
{service_name="nextcrm-app"} | json
```

Useful environment variables:

- `LOG_LEVEL`: defaults to `debug` in development and `info` in production.
- `LOG_FILE_PATH`: writes Pino JSON logs to a file collected by OpenTelemetry Collector.
- `PINO_PRETTY=true`: pretty-prints console logs while still writing JSON to `LOG_FILE_PATH`.
- `OTEL_EXPORTER_OTLP_ENDPOINT`: use `http://localhost:4318` locally, or `http://otel-collector:4318` from a Compose-managed app container.
- `OTEL_TRACES_SAMPLER` / `OTEL_TRACES_SAMPLER_ARG`: standard OpenTelemetry sampling controls.
