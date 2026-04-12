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

