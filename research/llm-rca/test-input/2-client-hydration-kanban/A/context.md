 GET /en/sign-in 200 in 1538ms (next.js: 539ms, proxy.ts: 5ms, application-code: 994ms)
[browser] Uncaught Error: Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <HTTPAccessFallbackBoundary notFound={undefined} forbidden={undefined} unauthorized={undefined}>
      <RedirectBoundary>
        <RedirectErrorBoundary router={{...}}>
          <InnerLayoutRouter url="/en/sign-in" tree={[...]} params={{locale:"en"}} cacheNode={{rsc:{...}, ...}} ...>
            <SegmentViewNode type="page" pagePath="[locale]/(...">
              <SegmentTrieNode>
              <SignInPage>
                <div className="h-full">
                  <div>
                  <div>
                    <LoginComponent>
                      <Card className="shadow-lg ...">
                        <div ref={undefined} className="rounded-lg...">
                          <CardHeader className="space-y-1">
                            <div ref={undefined} className="flex flex-...">
                              <CardTitle className="text-2xl">
                                <div ref={undefined} className="font-semibold tracking-tight text-2xl">
+                                 Sign in
-                                 Login
                              ...
                          ...
            ...
          ...

    at div (unknown)
    at CardTitle (components/ui/card.tsx:39:3)
    at LoginComponent (app/[locale]/(auth)/sign-in/components/LoginComponent.tsx:107:9)
    at SignInPage (app/[locale]/(auth)/sign-in/page.tsx:14:9)
  37 |   ...props
  38 | }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) => (
> 39 |   <div
     |   ^
  40 |     ref={ref}
  41 |     className={cn(
  42 |       "text-2xl font-semibold leading-none tracking-tight",
