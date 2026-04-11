# LLM Root Cause Analysis Study Kit

This kit is a repo-specific starting point for the crash-injection and root-cause-analysis study in `nextcrm-app`.

The templates live in [`research/llm-rca`](/research/llm-rca).

## Scope

The target crash classes are:

1. Server-side runtime exception in an API route or server action
2. Client-side rendering or hydration failure
3. Runtime failure caused by a missing or invalid environment variable
4. Build-time failure caused by invalid import, dependency issue, or configuration
5. Data-processing failure caused by unexpected response shape, null value, or schema mismatch

## Suggested repo-specific crash targets

1. Server runtime
   File: [`app/api/feedback/route.ts`](/app/api/feedback/route.ts)
   Trigger: authenticated `POST /api/feedback`
   Injection: guarded `throw new Error("RESEARCH_SERVER_RUNTIME_CRASH")`

2. Client render or hydration
   File: [`app/[locale]/(routes)/projects/boards/[boardId]/components/Kanban.tsx`](/app/[locale]/(routes)/projects/boards/[boardId]/components/Kanban.tsx)
   Trigger: board page render in browser
   Injection: client-only mismatch or guarded render-time throw when `RESEARCH_CRASH_MODE=client-hydration`

3. Missing env runtime
   Files: [`lib/minio.ts`](/lib/minio.ts), [`app/api/upload/presigned-url/route.ts`](/app/api/upload/presigned-url/route.ts)
   Trigger: upload URL generation
   Injection: unset `MINIO_ENDPOINT` or `MINIO_ACCESS_KEY`

4. Build-time failure
   File candidate: [`app/[locale]/(routes)/components/Footer.tsx`](/app/[locale]/(routes)/components/Footer.tsx)
   Trigger: `pnpm build`
   Injection: invalid import path or broken alias

5. Data-processing or schema mismatch
   File candidates: [`actions/crm/targets/import-targets.ts`](/actions/crm/targets/import-targets.ts), [`actions/campaigns/templates/generate-template.ts`](/actions/campaigns/templates/generate-template.ts)
   Trigger: CSV import or template generation
   Injection: invalid row shape, `null` field, or malformed JSON response

## Recommended execution flow

1. Duplicate `cases.template.jsonl` to a working file such as `cases.run-01.jsonl`.
2. For each crash, inject the failure on an isolated branch.
3. Reproduce the crash and save evidence into `research/llm-rca/evidence/<case-id>/`.
4. Build prompts using the A/B/C templates.
5. Run the same model across all variants with fixed settings.
6. Record outcomes in `results.template.csv` or a copied run-specific file.

## Evidence collection standard

For each case, capture:

1. `symptom.txt`: what a user or operator observed
2. `error.txt`: raw stack trace, console fragment, or build error
3. `recent-change.diff`: minimal diff or changed-file list
4. `context.json`: branch, timestamp, route/page, env flags, reproduction command
5. `ground-truth.md`: true root cause and intended fix

## Suggested experiment controls

1. Use one model per experiment batch.
2. Keep temperature fixed.
3. Keep max output tokens fixed.
4. Run at least 5 to 10 repetitions per case and variant.
5. Score blindly against the rubric in [`rubric.md`](/research/llm-rca/rubric.md).

## Using Codex CLI

Codex CLI is a reasonable choice for:

1. Injecting and reverting controlled failures on branches
2. Collecting evidence from the repo and terminal
3. Running repeated prompt-based RCA experiments with stable local context

For rigorous evaluation, pair it with API-based batch execution if you later need larger-scale repeated runs and automated scoring.
