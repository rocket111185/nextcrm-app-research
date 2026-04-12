Error message:
 POST /api/feedback 500 in 1643ms (next.js: 1582ms, application-code: 61ms)
[browser] AxiosError: Request failed with status code 500
    at <unknown> (httpMethod@http://localhost:3000/_next/static/chunks/0inl_axios_lib_0bqsryd._.js:3428:25)
    at onSubmit (app/[locale]/(routes)/components/FeedbackForm.tsx:45:19)
  43 |     setLoading(true);
  44 |     try {
> 45 |       await axios.post("/api/feedback", {
     |                   ^
  46 |         ...data,
  47 |         page: window.location.pathname,
  48 |         submittedAt: new Date().toISOString(),

Incident date: 2026-04-11T21:37:43.644Z

Last changes:
 app/[locale]/(routes)/components/Feedback.tsx     |  2 +-
 app/[locale]/(routes)/components/FeedbackForm.tsx | 11 ++++++++++-
 app/api/feedback/route.ts                         | 13 ++++++++++---
 3 files changed, 21 insertions(+), 5 deletions(-)

