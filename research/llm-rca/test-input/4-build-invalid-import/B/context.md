Error message:
⨯ ./app/[locale]/(routes)/components/Footer.tsx:21:12
Nullish coalescing operator(??) requires parens when mixing with logical operators
  19 | ...rMeta.poweredBy}
  20 | ...className="bg-black dark:bg-white rounded-md text-white dark:text-black px-1 mx-1">
> 21 | ...terBadgeLabels.nextjs ?? nextVersion.substring(1, 7) || process.env.NEXT_PUBLIC_NEXT_VER...
     |    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  22 | ...>
  23 | ...
  24 | ...href={footerLinks[0].href}>

Parsing ecmascript source code failed

Import trace:
  Server Component:
    ./app/[locale]/(routes)/components/Footer.tsx
    ./app/[locale]/(routes)/layout.tsx


 GET /en 500 in 262ms (next.js: 118ms, proxy.ts: 9ms, application-code: 135ms)
[browser] ./app/[locale]/(routes)/components/Footer.tsx:21:12
Nullish coalescing operator(??) requires parens when mixing with logical operators
  19 | ...rMeta.poweredBy}
  20 | ...className="bg-black dark:bg-white rounded-md text-white dark:text-black px-1 mx-1">
> 21 | ...terBadgeLabels.nextjs ?? nextVersion.substring(1, 7) || process.env.NEXT_PUBLIC_NEXT_VER...
     |    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  22 | ...>
  23 | ...
  24 | ...href={footerLinks[0].href}>

Parsing ecmascript source code failed

Import trace:
  Server Component:
    ./app/[locale]/(routes)/components/Footer.tsx
    ./app/[locale]/(routes)/layout.tsx 
[browser] ./app/[locale]/(routes)/components/Footer.tsx:21:12
Nullish coalescing operator(??) requires parens when mixing with logical operators
  19 | ...rMeta.poweredBy}
  20 | ...className="bg-black dark:bg-white rounded-md text-white dark:text-black px-1 mx-1">
> 21 | ...terBadgeLabels.nextjs ?? nextVersion.substring(1, 7) || process.env.NEXT_PUBLIC_NEXT_VER...
     |    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  22 | ...>
  23 | ...
  24 | ...href={footerLinks[0].href}>

Parsing ecmascript source code failed

Import trace:
  Server Component:
    ./app/[locale]/(routes)/components/Footer.tsx
    ./app/[locale]/(routes)/layout.tsx 
[browser] Uncaught Error: ./app/[locale]/(routes)/components/Footer.tsx:21:12
Nullish coalescing operator(??) requires parens when mixing with logical operators
  19 | ...rMeta.poweredBy}
  20 | ...className="bg-black dark:bg-white rounded-md text-white dark:text-black px-1 mx-1">
> 21 | ...terBadgeLabels.nextjs ?? nextVersion.substring(1, 7) || process.env.NEXT_PUBLIC_NEXT_VER...
     |    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  22 | ...>
  23 | ...
  24 | ...href={footerLinks[0].href}>

Parsing ecmascript source code failed

Import trace:
  Server Component:
    ./app/[locale]/(routes)/components/Footer.tsx
    ./app/[locale]/(routes)/layout.tsx


    at <unknown> (Error: ./app/[locale]/(routes)/components/Footer.tsx:21:12)
    at <unknown> (Error: (./app/[locale]/(routes)/components/Footer.tsx:21:12)
[browser] ./app/[locale]/(routes)/components/Footer.tsx:21:12
Nullish coalescing operator(??) requires parens when mixing with logical operators
  19 | ...rMeta.poweredBy}
  20 | ...className="bg-black dark:bg-white rounded-md text-white dark:text-black px-1 mx-1">
> 21 | ...terBadgeLabels.nextjs ?? nextVersion.substring(1, 7) || process.env.NEXT_PUBLIC_NEXT_VER...
     |    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  22 | ...>
  23 | ...
  24 | ...href={footerLinks[0].href}>

Parsing ecmascript source code failed

Import trace:
  Server Component:
    ./app/[locale]/(routes)/components/Footer.tsx
    ./app/[locale]/(routes)/layout.tsx 


Incident date: 2026-04-11T23:46:55.311Z

Last changes:
 app/[locale]/(routes)/components/Footer.tsx      | 18 +++++++++---------
 app/[locale]/(routes)/components/footer-links.ts | 15 +++++++++++++++
 2 files changed, 24 insertions(+), 9 deletions(-)

