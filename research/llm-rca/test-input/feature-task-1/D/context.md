# Incident context

The following JSON object contains incident-related evidence collected from the application observability pipeline.

```json
{
  "groups": [
    {
      "key": "trace:e2980506f723a88135d38840469ec308",
      "eventCount": 1,
      "firstSeen": "2026-05-02T18:34:29.669Z",
      "lastSeen": "2026-05-02T18:34:29.669Z",
      "events": [
        {
          "time": "2026-05-02T18:34:29.669Z",
          "level": "error",
          "service": "nextcrm-app",
          "environment": "development",
          "module": "app.api.client-logs",
          "contextModule": "app.[locale].(routes).components.FeedbackForm",
          "route": "/en",
          "clientUrl": "http://localhost:3000/en",
          "message": "Feedback submission failed",
          "error": {
            "name": "AxiosError",
            "message": "Request failed with status code 500",
            "stack": "AxiosError@http://localhost:3000/_next/static/chunks/0vh~_axios_lib_00q~6c8._.js:797:9\nsettle@http://localhost:3000/_next/static/chunks/0vh~_axios_lib_00q~6c8._.js:2070:16\nonloadend@http://localhost:3000/_next/static/chunks/0vh~_axios_lib_00q~6c8._.js:2615:225\n"
          },
          "correlation": {
            "traceId": "e2980506f723a88135d38840469ec308",
            "spanId": "f184cde15745e45a",
            "clientSessionId": "4f335a33-9f27-425f-8755-32b3bc9b3859"
          }
        }
      ]
    }
  ],
  "repositoryContext": {
    "branch": "feature/task-1",
    "commit": "3fee71dca09d9793a1353b12f9895f053776680f",
    "changedFiles": [
      "app/[locale]/(routes)/components/Feedback.tsx",
      "app/[locale]/(routes)/components/FeedbackForm.tsx",
      "app/api/feedback/route.ts"
    ],
    "diffStat": "app/[locale]/(routes)/components/Feedback.tsx     |  2 +-\n app/[locale]/(routes)/components/FeedbackForm.tsx | 11 ++++++++++-\n app/api/feedback/route.ts                         | 12 +++++++++---\n 3 files changed, 20 insertions(+), 5 deletions(-)"
  }
}
```
