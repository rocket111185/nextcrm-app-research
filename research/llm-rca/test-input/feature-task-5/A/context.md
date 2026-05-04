# Incident context

The following JSON object contains incident-related evidence collected from the application observability pipeline.

```json
{
  "events": [
    {
      "time": "2026-05-04T19:04:06.332Z",
      "timestampNs": "1777921446332505650",
      "labels": {
        "deployment_environment": "local",
        "detected_level": "error",
        "environment": "development",
        "err_digest": "1383626540",
        "err_message": "Cannot read properties of undefined (reading 'toString')",
        "err_stack": "TypeError: Cannot read properties of undefined (reading 'toString')\n    at parseEmployeesValue (/home/dmytro/Github/phd-work/nextcrm-app-update/.next/dev/server/chunks/ssr/_12nrsm3._.js:383:26)\n    at /home/dmytro/Github/phd-work/nextcrm-app-update/.next/dev/server/chunks/ssr/_12nrsm3._.js:416:27\n    at Array.forEach (<anonymous>)\n    at importTargets (/home/dmytro/Github/phd-work/nextcrm-app-update/.next/dev/server/chunks/ssr/_12nrsm3._.js:399:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)\n    at async executeActionAndPrepareForRender (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:64:5248)\n    at async /home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:64:1986\n    at async handleAction (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:62:25378)\n    at async renderToHTMLOrFlightImpl (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:69:55630)\n    at async doRender (/home/dmytro/Github/phd-work/nextcrm-app-update/.next/dev/server/chunks/ssr/node_modules__pnpm_0u~r44_._.js:4079:28)\n    at async AppPageRouteModule.handleResponse (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:71:63567)\n    at async handleResponse (/home/dmytro/Github/phd-work/nextcrm-app-update/.next/dev/server/chunks/ssr/node_modules__pnpm_0u~r44_._.js:4372:32)\n    at async Module.handler (/home/dmytro/Github/phd-work/nextcrm-app-update/.next/dev/server/chunks/ssr/node_modules__pnpm_0u~r44_._.js:4772:13)\n    at async DevServer.renderToResponseWithComponentsImpl (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/base-server.js:1454:9)\n    at async DevServer.renderPageComponent (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/base-server.js:1506:24)\n    at async DevServer.renderToResponseImpl (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/base-server.js:1556:32)\n    at async DevServer.pipeImpl (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/base-server.js:1043:25)\n    at async NextNodeServer.handleCatchallRenderRequest (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/next-server.js:338:17)\n    at async DevServer.handleRequestImpl (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/base-server.js:934:17)\n    at async /home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/dev/next-dev-server.js:394:20\n    at async Span.traceAsyncFn (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/trace/trace.js:164:20)\n    at async DevServer.handleRequest (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/dev/next-dev-server.js:390:24)\n    at async invokeRender (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/lib/router-server.js:266:21)\n    at async handleRequest (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/lib/router-server.js:465:24)\n    at async requestHandlerImpl (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/lib/router-server.js:514:13)\n    at async Server.requestListener (/home/dmytro/Github/phd-work/nextcrm-app-update/node_modules/.pnpm/next@16.2.4_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.58.2_react-d_d5dcdff52a2fa350539c8415eb2a346f/node_modules/next/dist/server/lib/start-server.js:225:13)",
        "err_type": "TypeError",
        "hostname": "localhost",
        "level": "error",
        "log_file_name": "nextcrm.log",
        "log_file_path": "/var/log/nextcrm/nextcrm.log",
        "pid": "94945",
        "request_method": "POST",
        "request_path": "/en/campaigns/targets",
        "route_path": "/[locale]/campaigns/targets",
        "route_renderSource": "react-server-components-payload",
        "route_routeType": "action",
        "route_routerKind": "App Router",
        "service": "nextcrm-app",
        "service_name": "nextcrm-app",
        "span_id": "af6b25b5543af455",
        "time": "2026-05-04T19:04:06.330Z",
        "trace_flags": "01",
        "trace_id": "b7fc50998917f6d53bb5de0ae8776eb5"
      },
      "line": "Unhandled request error",
      "metadata": {}
    }
  ]
}
```
