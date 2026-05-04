# Incident context

The following JSON object contains incident-related evidence collected from the application observability pipeline.

```json
{
  "groups": [
    {
      "key": "uncorrelated",
      "eventCount": 5,
      "firstSeen": "2026-05-04T20:11:49.374Z",
      "lastSeen": "2026-05-04T20:15:46.777Z",
      "events": [
        {
          "time": "2026-05-04T20:11:49.374Z",
          "level": "error",
          "service": "nextcrm-app",
          "environment": "development",
          "module": "scripts.build-with-logs",
          "contextModule": null,
          "route": null,
          "clientUrl": null,
          "message": "Build logging finished",
          "error": {
            "name": null,
            "message": null,
            "stack": null
          },
          "correlation": {
            "traceId": null,
            "spanId": null,
            "clientSessionId": null
          }
        },
        {
          "time": "2026-05-04T20:12:29.375Z",
          "level": "error",
          "service": "nextcrm-app",
          "environment": "development",
          "module": "scripts.build-with-logs",
          "contextModule": null,
          "route": null,
          "clientUrl": null,
          "message": "Build logging finished",
          "error": {
            "name": null,
            "message": null,
            "stack": null
          },
          "correlation": {
            "traceId": null,
            "spanId": null,
            "clientSessionId": null
          }
        },
        {
          "time": "2026-05-04T20:15:46.777Z",
          "level": "error",
          "service": "nextcrm-app",
          "environment": "development",
          "module": "scripts.build-with-logs",
          "contextModule": null,
          "route": null,
          "clientUrl": null,
          "message": "Build logging finished",
          "error": {
            "name": null,
            "message": null,
            "stack": null
          },
          "correlation": {
            "traceId": null,
            "spanId": null,
            "clientSessionId": null
          }
        },
        {
          "time": "2026-05-04T20:15:46.777Z",
          "level": "error",
          "service": "nextcrm-app",
          "environment": "development",
          "module": "scripts.build-with-logs",
          "contextModule": null,
          "route": null,
          "clientUrl": null,
          "message": "app/[locale]/(routes)/components/Footer.tsx(4,10): error TS2305: Module '\"./footer-links\"' has no exported member 'footerBadgeLabels'.",
          "error": {
            "name": null,
            "message": null,
            "stack": null
          },
          "correlation": {
            "traceId": null,
            "spanId": null,
            "clientSessionId": null
          }
        },
        {
          "time": "2026-05-04T20:15:46.777Z",
          "level": "error",
          "service": "nextcrm-app",
          "environment": "development",
          "module": "scripts.build-with-logs",
          "contextModule": null,
          "route": null,
          "clientUrl": null,
          "message": "app/[locale]/(routes)/components/Footer.tsx(21,12): error TS5076: '??' and '||' operations cannot be mixed without parentheses.",
          "error": {
            "name": null,
            "message": null,
            "stack": null
          },
          "correlation": {
            "traceId": null,
            "spanId": null,
            "clientSessionId": null
          }
        }
      ]
    }
  ],
  "repositoryContext": {
    "branch": "feature/task-4",
    "commit": "4ef0d23699000b8fcd3c5d7a0c060856627af982",
    "changedFiles": [
      "app/[locale]/(routes)/components/Footer.tsx",
      "app/[locale]/(routes)/components/footer-links.ts"
    ],
    "diffStat": "app/[locale]/(routes)/components/Footer.tsx      | 18 +++++++++---------\n app/[locale]/(routes)/components/footer-links.ts | 15 +++++++++++++++\n 2 files changed, 24 insertions(+), 9 deletions(-)"
  }
}
```
