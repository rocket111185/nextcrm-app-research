# Evidence Folder Layout

Create one folder per case:

`research/llm-rca/evidence/<case-id>/`

Recommended files:

1. `symptom.txt`
2. `error.txt`
3. `recent-change.diff`
4. `context.json`
5. `ground-truth.md`

Minimal `context.json` example:

```json
{
  "branch": "exp/server-runtime-feedback-route",
  "timestamp_utc": "2026-04-11T12:00:00Z",
  "entrypoint": "POST /api/feedback",
  "command": "pnpm dev",
  "route_or_page": "/api/feedback",
  "env_flags": {
    "RESEARCH_CRASH_MODE": "server-runtime"
  }
}
```
