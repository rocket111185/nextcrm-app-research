Error message:
⨯ TypeError: Cannot read properties of undefined (reading 'toString')
    at parseEmployeesValue (actions/crm/targets/import-targets.ts:17:24)
    at <unknown> (actions/crm/targets/import-targets.ts:59:23)
    at Array.forEach (<anonymous>)
    at importTargets (actions/crm/targets/import-targets.ts:41:8)
  15 |   };
  16 |
> 17 |   return `${parsed.min.toString()}-${parsed.max.toString()}`;
     |                        ^
  18 | }
  19 |
  20 | export async function importTargets( {
  digest: '2744837048'
}
 POST /en/campaigns/targets 500 in 472ms (next.js: 18ms, proxy.ts: 6ms, application-code: 447ms)
  └─ ƒ importTargets({}) in 11ms actions/crm/targets/import-targets.ts 

Incident date: 2026-04-12T00:18:46.263Z

Last changes:
 actions/crm/targets/import-targets.ts    | 28 ++++++++++++++++++++++------
 components/modals/ImportTargetsModal.tsx |  9 +++++++++
 2 files changed, 31 insertions(+), 6 deletions(-)

