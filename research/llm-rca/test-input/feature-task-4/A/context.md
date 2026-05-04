# Incident context

The following JSON object contains incident-related evidence collected from the application observability pipeline.

```json
{
  "events": [
    {
      "time": "2026-05-04T20:12:29.375Z",
      "timestampNs": "1777925549375342231",
      "labels": {
        "build_id": "5e4f6fc7-16c7-471d-ba24-48734cd50ee7",
        "command": "node -e console.log('plain line'); console.error('app/[locale]/(routes)/components/Footer.tsx(4,10): error TS2305: demo'); process.exit(1)",
        "deployment_environment": "local",
        "detected_level": "error",
        "environment": "development",
        "event": "build_failed",
        "exit_code": "1",
        "failure_phase": "build",
        "git_branch": "feature/task-4",
        "git_commit": "4ef0d23699000b8fcd3c5d7a0c060856627af982",
        "hostname": "localhost",
        "level": "error",
        "log_file_name": "build.log",
        "log_file_path": "/var/log/nextcrm/build.log",
        "log_source": "build",
        "module": "scripts.build-with-logs",
        "pid": "2",
        "service": "nextcrm-app",
        "service_name": "nextcrm-app",
        "time": "2026-05-04T20:12:29.352Z"
      },
      "line": "Build logging finished",
      "metadata": {}
    },
    {
      "time": "2026-05-04T20:15:46.777Z",
      "timestampNs": "1777925746777695145",
      "labels": {
        "build_id": "6bc34798-b92b-470e-a0d7-d3367dbdb274",
        "command": "pnpm exec tsc --noEmit --pretty false --incremental false",
        "deployment_environment": "local",
        "detected_level": "error",
        "environment": "development",
        "event": "build_failed",
        "exit_code": "2",
        "failure_phase": "build",
        "git_branch": "feature/task-4",
        "git_commit": "4ef0d23699000b8fcd3c5d7a0c060856627af982",
        "hostname": "localhost",
        "level": "error",
        "log_file_name": "build.log",
        "log_file_path": "/var/log/nextcrm/build.log",
        "log_source": "build",
        "module": "scripts.build-with-logs",
        "pid": "2",
        "service": "nextcrm-app",
        "service_name": "nextcrm-app",
        "time": "2026-05-04T20:15:46.668Z"
      },
      "line": "Build logging finished",
      "metadata": {}
    },
    {
      "time": "2026-05-04T20:15:46.777Z",
      "timestampNs": "1777925746777692360",
      "labels": {
        "build_id": "6bc34798-b92b-470e-a0d7-d3367dbdb274",
        "command": "pnpm exec tsc --noEmit --pretty false --incremental false",
        "deployment_environment": "local",
        "detected_level": "error",
        "environment": "development",
        "event": "build_output",
        "failure_phase": "build",
        "git_branch": "feature/task-4",
        "git_commit": "4ef0d23699000b8fcd3c5d7a0c060856627af982",
        "hostname": "localhost",
        "level": "error",
        "log_file_name": "build.log",
        "log_file_path": "/var/log/nextcrm/build.log",
        "log_source": "build",
        "module": "scripts.build-with-logs",
        "pid": "2",
        "service": "nextcrm-app",
        "service_name": "nextcrm-app",
        "stream": "stdout",
        "time": "2026-05-04T20:15:46.668Z"
      },
      "line": "app/[locale]/(routes)/components/Footer.tsx(4,10): error TS2305: Module '\"./footer-links\"' has no exported member 'footerBadgeLabels'.",
      "metadata": {}
    },
    {
      "time": "2026-05-04T20:15:46.777Z",
      "timestampNs": "1777925746777694657",
      "labels": {
        "build_id": "6bc34798-b92b-470e-a0d7-d3367dbdb274",
        "command": "pnpm exec tsc --noEmit --pretty false --incremental false",
        "deployment_environment": "local",
        "detected_level": "error",
        "environment": "development",
        "event": "build_output",
        "failure_phase": "build",
        "git_branch": "feature/task-4",
        "git_commit": "4ef0d23699000b8fcd3c5d7a0c060856627af982",
        "hostname": "localhost",
        "level": "error",
        "log_file_name": "build.log",
        "log_file_path": "/var/log/nextcrm/build.log",
        "log_source": "build",
        "module": "scripts.build-with-logs",
        "pid": "2",
        "service": "nextcrm-app",
        "service_name": "nextcrm-app",
        "stream": "stdout",
        "time": "2026-05-04T20:15:46.668Z"
      },
      "line": "app/[locale]/(routes)/components/Footer.tsx(21,12): error TS5076: '??' and '||' operations cannot be mixed without parentheses.",
      "metadata": {}
    },
    {
      "time": "2026-05-04T20:11:49.374Z",
      "timestampNs": "1777925509374828310",
      "labels": {
        "build_id": "95817347-8149-4413-aa70-880ba63e971b",
        "command": "pnpm exec tsc --noEmit --pretty false --incremental false",
        "deployment_environment": "local",
        "detected_level": "error",
        "environment": "development",
        "event": "build_failed",
        "exit_code": "2",
        "failure_phase": "build",
        "git_branch": "feature/task-4",
        "git_commit": "4ef0d23699000b8fcd3c5d7a0c060856627af982",
        "hostname": "localhost",
        "level": "error",
        "log_file_name": "build.log",
        "log_file_path": "/var/log/nextcrm/build.log",
        "log_source": "build",
        "module": "scripts.build-with-logs",
        "pid": "2",
        "service": "nextcrm-app",
        "service_name": "nextcrm-app",
        "time": "2026-05-04T20:11:49.268Z"
      },
      "line": "Build logging finished",
      "metadata": {}
    }
  ]
}
```
