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
    "branch": "feature/task-2",
    "commit": "9be250f3b729ab946e5f722fcf5c443d9e9ab516",
    "changedFiles": [
      "app/[locale]/(auth)/sign-in/components/LoginComponent.tsx",
      "app/[locale]/(auth)/sign-in/page.tsx",
      "app/[locale]/(routes)/projects/boards/[boardId]/components/Kanban.tsx",
      "app/[locale]/(routes)/projects/boards/[boardId]/forms/NewSection.tsx"
    ],
    "diffStat": ".../(auth)/sign-in/components/LoginComponent.tsx   | 17 ++++++++++----\n app/[locale]/(auth)/sign-in/page.tsx               |  4 +++-\n .../boards/[boardId]/components/Kanban.tsx         | 27 ++++++++++------------\n .../projects/boards/[boardId]/forms/NewSection.tsx |  5 ++++\n 4 files changed, 33 insertions(+), 20 deletions(-)"
  }
}
```
