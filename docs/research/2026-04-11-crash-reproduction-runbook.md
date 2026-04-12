# Crash Reproduction Runbook

This runbook is for manual reproduction of the five research crash cases created in the local git branches.

Use it together with:

1. [`research/llm-rca/cases.template.jsonl`](/research/llm-rca/cases.template.jsonl)
2. [`research/llm-rca/results.template.csv`](/research/llm-rca/results.template.csv)
3. [`research/llm-rca/evidence/README.md`](/research/llm-rca/evidence/README.md)
4. [`research/llm-rca/rubric.md`](/research/llm-rca/rubric.md)

## General rules

1. Stay on one crash branch at a time.
2. Record the exact branch name and commit hash in `context.json`.
3. Use the same Node, pnpm, database, and env setup across all cases.
4. Keep one terminal for the app process and one terminal for git and note-taking.
5. Do not fix the crash before you finish collecting evidence.
6. Save raw evidence first, then create A/B/C prompt inputs from that evidence.

## Before each case

1. Start from `main`.
2. Confirm local status with `git status --short`.
3. Switch to the target branch.
4. Record the branch and commit:
   `git branch --show-current`
   `git rev-parse HEAD`
5. Start the app with your standard command, usually `pnpm dev`.
6. Record:
   date and time in UTC
   branch name
   commit hash
   whether you used `pnpm dev` or `pnpm build`
   the page or route being tested

## What to capture for every case

Put these files under `research/llm-rca/evidence/<case-id>/`.

1. `symptom.txt`
   Write 2 to 5 lines describing what a user sees.
   Include HTTP status if relevant.
   Include whether the failure is visible in UI, browser console, server terminal, or build output.

2. `error.txt`
   Paste the raw error fragment.
   Keep line breaks.
   Include stack trace if available.
   For browser-side cases, include console output.
   For build cases, include the compiler error block.

3. `recent-change.diff`
   Save:
   `git diff main...HEAD --stat`
   `git diff main...HEAD`
   If the full diff is too large, save at least the changed-file list and the hunk around the true root cause.

4. `context.json`
   Include:
   branch
   commit
   timestamp_utc
   command_run
   route_or_page
   browser_used if relevant
   key env assumptions
   exact reproduction steps

5. `ground-truth.md`
   Write:
   direct root cause
   failing file
   failing line or expression
   why it fails
   smallest fix

## CSV discipline

For `research/llm-rca/results.template.csv`, fill one row per model run.

Required fields after each run:

1. `run_id`
2. `case_id`
3. `variant`
4. `model`
5. `date_utc`
6. `temperature`
7. `max_output_tokens`
8. `predicted_root_cause`
9. `component_or_layer`
10. `fix_summary`
11. `confidence`
12. `root_cause_correct`
13. `evidence_useful`
14. `fix_relevant`
15. `hallucination_present`
16. `notes`

For scoring fields, use the rubric file and keep grading blinded if possible.

## Case 1

Case ID: `server-runtime-feedback-route`
Branch: `research-1`
Commit: `3e3a3e1`

### Intent

This branch simulates a server-side runtime failure in the feedback submission path.

### Changed files

1. [`app/api/feedback/route.ts`](/app/api/feedback/route.ts)
2. [`app/[locale]/(routes)/components/FeedbackForm.tsx`](/app/[locale]/(routes)/components/FeedbackForm.tsx)
3. [`app/[locale]/(routes)/components/Feedback.tsx`](/app/[locale]/(routes)/components/Feedback.tsx)

### Reproduction

1. `git switch research-1`
2. Start the app with `pnpm dev`
3. Sign in with a valid user account
4. Open any page where the feedback popover is available in the header
5. Open the feedback form
6. Type a non-empty feedback message
7. Submit the form

### Expected symptom

1. The request fails on the server.
2. The client shows the generic error toast.
3. The response should be a `500`.

### Where to collect evidence

1. Browser DevTools Network tab:
   inspect `POST /api/feedback`
   capture status code
   copy request payload
   copy response body if present
2. Server terminal:
   copy the exception and stack trace
3. Git diff:
   capture the change in the API route and the form payload shape

### Important notes

1. The crash is triggered only after submission reaches the API route.
2. The bug is tied to a payload shape assumption made during a small feedback-flow refactor.
3. Do not summarize the raw error yet; save it first.

### Suggested `symptom.txt`

1. User submits the feedback form while authenticated.
2. The UI reports failure instead of success.
3. `POST /api/feedback` returns `500`.

## Case 2

Case ID: `client-hydration-kanban`
Branch: `research-2`
Commit: `5bd2de5`

### Intent

This branch simulates a client-side hydration mismatch on the public sign-in page.

### Changed files

1. [`app/[locale]/(auth)/sign-in/components/LoginComponent.tsx`](/app/[locale]/(auth)/sign-in/components/LoginComponent.tsx)
2. [`app/[locale]/(auth)/sign-in/page.tsx`](/app/[locale]/(auth)/sign-in/page.tsx)

### Reproduction

1. `git switch research-2`
2. Start the app with `pnpm dev`
3. Open `/sign-in`
4. Wait for the sign-in page to render
6. Open the browser console immediately
7. Refresh the page once to confirm the symptom is reproducible

### Expected symptom

1. The sign-in page produces a hydration warning or hydration failure in the browser console.
2. The UI may still partially render, but the console evidence matters.

### Where to collect evidence

1. Browser console:
   capture the hydration mismatch block exactly
2. Browser page source or DOM:
   note the conflicting rendered text if visible
3. Git diff:
   capture the sign-in component render change

### Important notes

1. This is not a server exception case.
2. The primary evidence is in the browser console, not only the terminal.
3. Record the exact page URL you used, including locale if present.

### Suggested `symptom.txt`

1. Opening the sign-in page triggers a hydration warning in the browser.
2. The mismatch is reproducible on refresh.
3. The problem originates in the client-rendered sign-in UI.

## Case 3

Case ID: `env-runtime-minio-upload`
Branch: `research-3`
Commit: `0dc39fc`

### Intent

This branch simulates a runtime failure caused by a missing or invalid environment variable in the upload flow.

### Changed files

1. [`app/api/upload/presigned-url/route.ts`](/app/api/upload/presigned-url/route.ts)
2. [`components/ui/minio-uploader.tsx`](/components/ui/minio-uploader.tsx)

### Required setup

Use an env state where `NEXT_PUBLIC_MINIO_ENDPOINT` is missing, empty, or invalid as a URL string.

Examples:

1. missing value
2. empty string
3. malformed URL such as `not-a-url`

### Reproduction

1. `git switch research-3`
2. Ensure `NEXT_PUBLIC_MINIO_ENDPOINT` is invalid for this run
3. Start the app with `pnpm dev`
4. Open a screen that uses the MinIO uploader
5. Select a valid file and trigger upload URL generation

### Expected symptom

1. Upload flow fails during server-side presigned URL generation.
2. The client should report upload failure.
3. The server terminal should show a runtime error related to URL construction or env usage.

### Where to collect evidence

1. Browser Network tab:
   inspect `POST /api/upload/presigned-url`
2. Browser UI:
   note the upload error message
3. Server terminal:
   capture the thrown error and stack trace
4. Env context:
   record whether the env var was missing or malformed

### Important notes

1. This is a runtime env issue, not a build issue.
2. The same branch may appear to work if the env value is valid, so record the env state carefully.

### Suggested `symptom.txt`

1. Upload starts but fails before a presigned URL is returned.
2. The request to `/api/upload/presigned-url` fails.
3. The server error mentions invalid URL handling or env-derived configuration.

## Case 4

Case ID: `build-failure-invalid-import-footer`
Branch: `research-4`
Commit: `875c7a6`

### Intent

This branch simulates a build-time failure caused by an invalid import or export mismatch.

### Changed files

1. [`app/[locale]/(routes)/components/Footer.tsx`](/app/[locale]/(routes)/components/Footer.tsx)
2. [`app/[locale]/(routes)/components/footer-links.ts`](/app/[locale]/(routes)/components/footer-links.ts)

### Reproduction

1. `git switch research-4`
2. Run `pnpm build`
3. Wait for compilation to fail

### Expected symptom

1. The build stops with a module export or import error.
2. No browser reproduction is needed for this case.

### Where to collect evidence

1. Terminal output from `pnpm build`
2. The exact compiler message naming the file and missing export
3. The diff around the new footer metadata extraction

### Important notes

1. Save the raw build block exactly as printed.
2. Include the full failing import line in `ground-truth.md`.

### Suggested `symptom.txt`

1. Production build fails during compilation.
2. The error points to the footer component import path or export name.
3. No runtime execution is required to trigger the failure.

## Case 5

Case ID: `data-shape-target-import`
Branch: `research-5`
Commit: `234a54c`

### Intent

This branch simulates a data-processing failure caused by a null or missing field during CSV import.

### Changed files

1. [`actions/crm/targets/import-targets.ts`](/actions/crm/targets/import-targets.ts)
2. [`components/modals/ImportTargetsModal.tsx`](/components/modals/ImportTargetsModal.tsx)

### Required test data

Prepare a CSV with at least one row like this:

```csv
last_name,first_name,email,company,employees
Smith,John,john@example.com,Acme,50
```

The important condition is:

1. `last_name` present
2. `company` present or mapped normally
3. `employees` contains a plain scalar such as `50`, `100`, or an empty value instead of a structured object shape

### Reproduction

1. `git switch research-5`
2. Start the app with `pnpm dev`
3. Open the target import modal
4. Upload the crafted CSV
5. Keep or confirm the inferred mapping
6. Run the import

### Expected symptom

1. Import processing fails for rows that have a non-structured `employees` value.
2. The failure is caused by an unsafe assumption during normalization.
3. The terminal should show the thrown exception.

### Where to collect evidence

1. Browser UI:
   capture the import error toast if shown
2. Server terminal:
   capture the thrown exception and stack trace
3. CSV sample:
   save the exact input file content used for reproduction
4. Git diff:
   capture the normalization code path

### Important notes

1. This case depends on the input shape.
2. The easiest trigger is a normal scalar `employees` cell such as `50`.
3. Preserve the exact CSV content as evidence.

### Suggested `symptom.txt`

1. Importing a CSV with a plain `employees` value such as `50` causes the import flow to fail.
2. The failure occurs during server-side data normalization of the employee range field.
3. The error is input-shape dependent.

## After collecting evidence

For each case:

1. Build Variant A using only `symptom.txt` and a minimal raw fragment from `error.txt`.
2. Build Variant B using symptom, broader logs, recent changes, and context in loose text.
3. Build Variant C using the fixed structured template from `research/llm-rca/prompts/variant-c.md`.
4. Run the same model settings for all three variants.
5. Fill the CSV immediately after each run so nothing is lost.

## Suggested per-case checklist

Copy this checklist into your own notes if useful.

1. Switched to the correct branch
2. Recorded branch name and commit hash
3. Started app or build command
4. Reproduced the failure
5. Saved raw symptom text
6. Saved raw error text
7. Saved diff
8. Saved context JSON
9. Wrote ground truth
10. Built Variant A prompt
11. Built Variant B prompt
12. Built Variant C prompt
13. Ran the model
14. Logged the result into CSV
15. Scored the result with the rubric
