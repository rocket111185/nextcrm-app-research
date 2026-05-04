#!/usr/bin/env node

/**
 * Generate A/B/C/D LLM context variants from a single Loki query_range request.
 *
 * A — raw Loki logs
 * B — filtered diagnostic logs
 * C — trace/session-correlated incident bundle
 * D — trace/session-correlated incident bundle + Git repository context
 *
 * Important:
 * - context.json is LLM-facing and contains only incident evidence.
 * - manifest.json is experiment-facing and contains case id, variant id,
 *   Loki query metadata, transformation rules and reproducibility metadata.
 *
 * Requires Node.js 18+ because it uses the built-in fetch API.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));

const config = {
  lokiUrl: args.lokiUrl ?? "http://localhost:3100",
  caseId: required(args.caseId, "--case-id"),
  outRoot: args.outRoot ?? "research/llm-rca/test-input",
  evidenceRoot: args.evidenceRoot ?? "research/llm-rca/evidence/loki-export",
  query: args.query ?? '{service_name="nextcrm-app"} | level=~"error|fatal"',
  start: args.start ?? null,
  end: args.end ?? null,
  since: args.since ?? null,
  limit: args.limit ?? "5000",
  direction: args.direction ?? "forward",
  includePatch: args.includePatch === "true",
  maxStackChars: Number(args.maxStackChars ?? 4000),
  maxLineChars: Number(args.maxLineChars ?? 4000),
};

validateTimeConfig(config);

const generatedAt = new Date().toISOString();

const lokiResponse = await queryLokiRange(config);
const rawEvents = flattenLokiResponse(lokiResponse);
const normalizedEvents = rawEvents.map((event) => normalizeEvent(event, config));

const baseMetadata = {
  caseId: config.caseId,
  generatedAt,
  source: "loki-query-range",
  loki: {
    url: config.lokiUrl,
    query: config.query,
    start: config.start,
    end: config.end,
    since: config.since,
    limit: Number(config.limit),
    direction: config.direction,
    returnedEventCount: rawEvents.length,
    reachedLimit: rawEvents.length >= Number(config.limit),
  },
};

await writeSharedExport({
  evidenceRoot: config.evidenceRoot,
  caseId: config.caseId,
  generatedAt,
  rawEvents,
  normalizedEvents,
  baseMetadata,
});

const variants = {
  A: {
    context: buildVariantA({ rawEvents }),
    transformation: {
      name: "raw_loki_logs",
      description:
        "Raw Loki events exported from the selected time range without diagnostic field filtering.",
      grouped: false,
      includedRepositoryContext: false,
      includedPatch: false,
    },
  },
  B: {
    context: buildVariantB({ normalizedEvents }),
    transformation: {
      name: "filtered_diagnostic_logs",
      description:
        "Selected diagnostic fields from Loki events: time, level, service, module, route, message, error and correlation identifiers.",
      grouped: false,
      includedRepositoryContext: false,
      includedPatch: false,
    },
  },
  C: {
    context: buildVariantC({ normalizedEvents }),
    transformation: {
      name: "correlated_incident_bundle",
      description:
        "Filtered diagnostic events grouped by trace_id, client_sessionId, route or fallback key.",
      grouped: true,
      groupingKeys: ["trace_id", "client_sessionId", "route", "uncorrelated"],
      includedRepositoryContext: false,
      includedPatch: false,
    },
  },
  D: {
    context: buildVariantD({
      normalizedEvents,
      includePatch: config.includePatch,
    }),
    transformation: {
      name: "correlated_incident_bundle_with_repository_context",
      description:
        "Correlated diagnostic events enriched with Git branch, commit, changed files and diff statistics.",
      grouped: true,
      groupingKeys: ["trace_id", "client_sessionId", "route", "uncorrelated"],
      includedRepositoryContext: true,
      includedPatch: config.includePatch,
    },
  },
};

for (const [variantId, variant] of Object.entries(variants)) {
  await writeVariantContext({
    outRoot: config.outRoot,
    caseId: config.caseId,
    variantId,
    context: variant.context,
    manifest: {
      caseId: config.caseId,
      variantId,
      generatedAt,
      source: baseMetadata.source,
      loki: baseMetadata.loki,
      transformation: variant.transformation,
    },
  });
}

console.log(`Generated contexts for case "${config.caseId}"`);
console.log(`Events retrieved from Loki: ${rawEvents.length}`);
console.log(`Output root: ${path.join(config.outRoot, config.caseId)}`);

if (rawEvents.length >= Number(config.limit)) {
  console.warn(
    `Warning: Loki returned ${rawEvents.length} events, which reaches the configured limit. ` +
      "The context may be incomplete. Consider increasing --limit or narrowing --start/--end.",
  );
}

async function queryLokiRange(config) {
  const url = new URL("/loki/api/v1/query_range", config.lokiUrl);

  url.searchParams.set("query", config.query);
  url.searchParams.set("limit", config.limit);
  url.searchParams.set("direction", config.direction);

  if (config.start) {
    url.searchParams.set("start", config.start);
  }

  if (config.end) {
    url.searchParams.set("end", config.end);
  }

  if (config.since) {
    url.searchParams.set("since", config.since);
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Loki request failed: ${response.status} ${response.statusText}\n${body}`,
    );
  }

  const json = await response.json();

  if (json.status !== "success") {
    throw new Error(
      `Loki returned non-success status: ${JSON.stringify(json, null, 2)}`,
    );
  }

  return json;
}

function flattenLokiResponse(response) {
  const streams = response?.data?.result ?? [];

  return streams.flatMap((stream) => {
    const streamLabels = stream.stream ?? {};
    const values = stream.values ?? [];

    return values.map((value) => {
      const [timestampNs, line, metadata = {}] = value;

      return {
        time: nsToIso(timestampNs),
        timestampNs,
        labels: streamLabels,
        line,
        metadata,
      };
    });
  });
}

function normalizeEvent(event, config) {
  const parsedLine = parseJsonSafe(event.line);
  const labels = event.labels ?? {};
  const metadata = event.metadata ?? {};

  const level =
    labels.level ??
    labels.detected_level ??
    metadata.level ??
    parsedLine?.level ??
    null;

  const service =
    labels.service_name ??
    labels.service ??
    metadata.service_name ??
    metadata.service ??
    parsedLine?.service_name ??
    parsedLine?.service ??
    null;

  const message =
    parsedLine?.msg ??
    parsedLine?.message ??
    parsedLine?.line ??
    event.line ??
    null;

  const errorName =
    labels.context_err_name ??
    metadata.context_err_name ??
    parsedLine?.context_err_name ??
    parsedLine?.err?.name ??
    parsedLine?.error?.name ??
    null;

  const errorMessage =
    labels.context_err_message ??
    metadata.context_err_message ??
    parsedLine?.context_err_message ??
    parsedLine?.err?.message ??
    parsedLine?.error?.message ??
    null;

  const errorStack =
    labels.context_err_stack ??
    metadata.context_err_stack ??
    parsedLine?.context_err_stack ??
    parsedLine?.err?.stack ??
    parsedLine?.error?.stack ??
    null;

  return {
    time: event.time,
    level,
    service,
    environment:
      labels.environment ??
      labels.deployment_environment ??
      metadata.environment ??
      parsedLine?.environment ??
      null,
    module:
      labels.module ??
      metadata.module ??
      parsedLine?.module ??
      null,
    contextModule:
      labels.context_module ??
      metadata.context_module ??
      parsedLine?.context_module ??
      null,
    route:
      labels.client_pathname ??
      metadata.client_pathname ??
      parsedLine?.client_pathname ??
      parsedLine?.route ??
      null,
    clientUrl:
      labels.client_url ??
      metadata.client_url ??
      parsedLine?.client_url ??
      null,
    message: truncate(message, config.maxLineChars),
    error: {
      name: errorName,
      message: errorMessage,
      stack: truncate(errorStack, config.maxStackChars),
    },
    correlation: {
      traceId:
        labels.trace_id ??
        metadata.trace_id ??
        parsedLine?.trace_id ??
        parsedLine?.traceId ??
        null,
      spanId:
        labels.span_id ??
        metadata.span_id ??
        parsedLine?.span_id ??
        parsedLine?.spanId ??
        null,
      clientSessionId:
        labels.client_sessionId ??
        metadata.client_sessionId ??
        parsedLine?.client_sessionId ??
        null,
    },
    raw: event,
  };
}

/**
 * LLM-facing context.
 * No caseId, no variant name, no Loki query metadata.
 */
function buildVariantA({ rawEvents }) {
  return {
    events: rawEvents,
  };
}

/**
 * LLM-facing context.
 * No caseId, no variant name, no Loki query metadata.
 */
function buildVariantB({ normalizedEvents }) {
  return {
    events: normalizedEvents.map(stripRaw),
  };
}

/**
 * LLM-facing context.
 * No caseId, no variant name, no Loki query metadata.
 */
function buildVariantC({ normalizedEvents }) {
  return {
    groups: groupEvents(normalizedEvents),
  };
}

/**
 * LLM-facing context.
 * No caseId, no variant name, no Loki query metadata.
 *
 * This variant intentionally includes repositoryContext because it is part of
 * the evidence being evaluated, not experiment metadata.
 */
function buildVariantD({ normalizedEvents, includePatch }) {
  return {
    groups: groupEvents(normalizedEvents),
    repositoryContext: getGitContext({ includePatch }),
  };
}

function groupEvents(events) {
  const groups = new Map();

  for (const event of events) {
    const key = getCorrelationKey(event);

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(stripRaw(event));
  }

  return [...groups.entries()].map(([key, groupedEvents]) => {
    const sortedEvents = groupedEvents.sort((a, b) =>
      a.time.localeCompare(b.time),
    );

    return {
      key,
      eventCount: sortedEvents.length,
      firstSeen: sortedEvents[0]?.time ?? null,
      lastSeen: sortedEvents.at(-1)?.time ?? null,
      events: sortedEvents,
    };
  });
}

function getCorrelationKey(event) {
  if (event.correlation?.traceId) {
    return `trace:${event.correlation.traceId}`;
  }

  if (event.correlation?.clientSessionId) {
    return `session:${event.correlation.clientSessionId}`;
  }

  if (event.route) {
    return `route:${event.route}`;
  }

  return "uncorrelated";
}

function getGitContext({ includePatch }) {
  const context = {
    branch: safeExec("git branch --show-current"),
    commit: safeExec("git rev-parse HEAD"),
    changedFiles: safeExec("git diff --name-only develop...HEAD")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    diffStat: safeExec("git diff --stat develop...HEAD"),
  };

  if (includePatch) {
    context.patch = safeExec("git diff --unified=3 develop...HEAD");
  }

  return context;
}

async function writeSharedExport({
  evidenceRoot,
  caseId,
  generatedAt,
  rawEvents,
  normalizedEvents,
  baseMetadata,
}) {
  const safeGeneratedAt = generatedAt.replaceAll(":", "").replaceAll(".", "");
  const outDir = path.join(evidenceRoot, caseId, safeGeneratedAt);

  await fs.mkdir(outDir, { recursive: true });

  await fs.writeFile(
    path.join(outDir, "loki-raw-events.jsonl"),
    toJsonl(rawEvents),
    "utf8",
  );

  await fs.writeFile(
    path.join(outDir, "loki-normalized-events.jsonl"),
    toJsonl(normalizedEvents.map(stripRaw)),
    "utf8",
  );

  await fs.writeFile(
    path.join(outDir, "manifest.json"),
    JSON.stringify(baseMetadata, null, 2),
    "utf8",
  );
}

async function writeVariantContext({
  outRoot,
  caseId,
  variantId,
  context,
  manifest,
}) {
  const outDir = path.join(outRoot, caseId, variantId);

  await fs.mkdir(outDir, { recursive: true });

  await fs.writeFile(
    path.join(outDir, "context.json"),
    JSON.stringify(context, null, 2),
    "utf8",
  );

  await fs.writeFile(
    path.join(outDir, "context.md"),
    renderMarkdownContext(context),
    "utf8",
  );

  await fs.writeFile(
    path.join(outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );
}

function renderMarkdownContext(context) {
  return [
    "# Incident context",
    "",
    "The following JSON object contains incident-related evidence collected from the application observability pipeline.",
    "",
    "```json",
    JSON.stringify(context, null, 2),
    "```",
    "",
  ].join("\n");
}

function stripRaw(event) {
  const { raw, ...withoutRaw } = event;

  return withoutRaw;
}

function parseJsonSafe(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function nsToIso(timestampNs) {
  return new Date(Number(BigInt(timestampNs) / 1000000n)).toISOString();
}

function truncate(value, maxLength) {
  if (value === null || value === undefined) {
    return null;
  }

  const stringValue = String(value);

  if (stringValue.length <= maxLength) {
    return stringValue;
  }

  return `${stringValue.slice(0, maxLength)}\n...[truncated]`;
}

function safeExec(command) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function toJsonl(values) {
  return values.map((value) => JSON.stringify(value)).join("\n") + "\n";
}

function validateTimeConfig(config) {
  if (config.start && config.end && config.since) {
    throw new Error("Use either --start/--end or --since, not both.");
  }

  if ((config.start && !config.end) || (!config.start && config.end)) {
    throw new Error("Both --start and --end must be provided together.");
  }

  if (!config.since && !config.start && !config.end) {
    throw new Error("Provide either --since or both --start and --end.");
  }
}

function parseArgs(argv) {
  const parsed = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg
      .slice(2)
      .replace(/-([a-z])/g, (_, char) => char.toUpperCase());

    const next = argv[i + 1];

    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
    } else {
      parsed[key] = next;
      i += 1;
    }
  }

  return parsed;
}

function required(value, name) {
  if (!value) {
    throw new Error(`Missing required argument: ${name}`);
  }

  return value;
}
