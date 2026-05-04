# Incident context

The following JSON object contains incident-related evidence collected from the application observability pipeline.

```json
{
  "events": [
    {
      "time": "2026-05-04T18:30:26.512Z",
      "timestampNs": "1777919426512249554",
      "labels": {
        "client_pathname": "/en/sign-in",
        "client_sessionId": "f4e338ce-1d65-492f-9a53-16026bf86155",
        "client_timestamp": "2026-05-04T18:30:26.368Z",
        "client_url": "http://localhost:3000/en/sign-in",
        "client_userAgent": "Mozilla/5.0 (X11; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0",
        "context_err_message": "Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\nhttps://react.dev/link/hydration-mismatch\n\n  ...\n    <HTTPAccessFallbackBoundary notFound={undefined} forbidden={undefined} unauthorized={undefined}>\n      <RedirectBoundary>\n        <RedirectErrorBoundary router={{...}}>\n          <InnerLayoutRouter url=\"/en/sign-in\" tree={[...]} params={{locale:\"en\"}} cacheNode={{rsc:{...}, ...}} ...>\n            <SegmentViewNode type=\"page\" pagePath=\"[locale]/(...\">\n              <SegmentTrieNode>\n              <SignInPage>\n                <div className=\"h-full\">\n                  <div>\n                  <div>\n                    <LoginComponent>\n                      <Card className=\"shadow-lg ...\">\n                        <div ref={undefined} className=\"rounded-lg...\">\n                          <CardHeader className=\"space-y-1\">\n                            <div ref={undefined} className=\"flex flex-...\">\n                              <CardTitle className=\"text-2xl\">\n                                <div ref={undefined} className=\"font-semibold tracking-tight text-2xl\">\n+                                 Sign in\n-                                 Login\n                              ...\n                          ...\n            ...\n          ...\n",
        "context_err_name": "Error",
        "context_err_stack": "throwOnHydrationMismatch@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:3318:56\nprepareToHydrateHostInstance@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:3372:23\ncompleteWork@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:6922:88\nrunWithFiberInDEV@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:965:131\ncompleteUnitOfWork@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:9622:23\nperformUnitOfWork@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:9557:28\nworkLoopConcurrentByScheduler@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:9551:75\nrenderRootConcurrent@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:9534:71\nperformWorkOnRoot@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:9061:150\nperformWorkOnRootViaSchedulerTask@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_react-dom_05bqvg8._.js:10255:26\nperformWorkUntilDeadline@http://localhost:3000/_next/static/chunks/0sc8_next_dist_compiled_13m26rn._.js:2647:72\n",
        "context_module": "app.client-error-listener",
        "deployment_environment": "local",
        "detected_level": "error",
        "environment": "development",
        "hostname": "localhost",
        "level": "error",
        "log_file_name": "nextcrm.log",
        "log_file_path": "/var/log/nextcrm/nextcrm.log",
        "module": "app.api.client-logs",
        "pid": "86917",
        "service": "nextcrm-app",
        "service_name": "nextcrm-app",
        "span_id": "f6f18ebb5ee63701",
        "time": "2026-05-04T18:30:26.432Z",
        "trace_flags": "01",
        "trace_id": "e205c05bab2c1e0f7842fa624396f721"
      },
      "line": "Unhandled client error",
      "metadata": {}
    }
  ]
}
```
