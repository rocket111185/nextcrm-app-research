start="$(date -u -d '2 hours ago' +%s%N)"
end="$(date -u +%s%N)"

curl -G -s http://localhost:3100/loki/api/v1/query_range \
  --data-urlencode 'query={service_name="nextcrm-app"} | level="error" or level="fatal"' \
  --data-urlencode "start=$start" \
  --data-urlencode "end=$end" \
  --data-urlencode "limit=1000" \
  --data-urlencode "direction=forward" \
| jq -c '
  .data.result[] as $stream
  | $stream.values[]
  | {
      time: (.[0] | tonumber / 1000000000 | todateiso8601),
      labels: $stream.stream,
      line: .[1],
      metadata: (.[2] // {})
    }
' > research/log-bundles/loki-errors-last-2h.jsonl
