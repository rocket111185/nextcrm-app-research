# Incident context

The following JSON object contains incident-related evidence collected from the application observability pipeline.

```json
{
  "groups": [
    {
      "key": "trace:b7fc50998917f6d53bb5de0ae8776eb5",
      "eventCount": 1,
      "firstSeen": "2026-05-04T19:04:06.332Z",
      "lastSeen": "2026-05-04T19:04:06.332Z",
      "events": [
        {
          "time": "2026-05-04T19:04:06.332Z",
          "level": "error",
          "service": "nextcrm-app",
          "environment": "development",
          "module": null,
          "contextModule": null,
          "route": null,
          "clientUrl": null,
          "message": "Unhandled request error",
          "error": {
            "name": null,
            "message": null,
            "stack": null
          },
          "correlation": {
            "traceId": "b7fc50998917f6d53bb5de0ae8776eb5",
            "spanId": "af6b25b5543af455",
            "clientSessionId": null
          }
        }
      ]
    }
  ],
  "repositoryContext": {
    "branch": "feature/task-5",
    "commit": "9790f4c1a07f8e6f46df8cf643cd5e516b93d2a2",
    "changedFiles": [
      "actions/crm/targets/import-targets.ts",
      "components/modals/ImportTargetsModal.tsx"
    ],
    "diffStat": "actions/crm/targets/import-targets.ts    | 28 ++++++++++++++++++++++------\n components/modals/ImportTargetsModal.tsx |  9 +++++++++\n 2 files changed, 31 insertions(+), 6 deletions(-)"
  }
}
```
