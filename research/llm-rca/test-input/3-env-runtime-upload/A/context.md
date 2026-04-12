Failed to generate presigned URL: TypeError: Invalid URL
    at buildPublicFileUrl (app/api/upload/presigned-url/route.ts:13:25)
    at POST (app/api/upload/presigned-url/route.ts:61:21)
  11 |
  12 | function buildPublicFileUrl(key: string) {
> 13 |   const publicBaseUrl = new URL(MINIO_PUBLIC_URL!);
     |                         ^
  14 |   publicBaseUrl.pathname = `/${MINIO_BUCKET}/${key}`;
  15 |   return publicBaseUrl.toString();
  16 | } {
  code: 'ERR_INVALID_URL',
  input: ''
}
 POST /api/upload/presigned-url 500 in 778ms (next.js: 506ms, application-code: 271ms)
 
