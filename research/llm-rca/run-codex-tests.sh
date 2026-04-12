#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
TEST_INPUT_DIR="${PROJECT_ROOT}/research/llm-rca/test-input"
TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
OUTPUT_DIR="$(cd "${PROJECT_ROOT}/.." && pwd)/nextcrm-app-research-codex-output/codex-${TIMESTAMP}"
MODEL=""

usage() {
  cat <<'EOF'
Usage:
  research/llm-rca/run-codex-tests.sh [--model MODEL] [--output-dir DIR]

Options:
  --model MODEL      Optional Codex model name. If omitted, Codex CLI uses its default model.
  --output-dir DIR   Optional output directory. If omitted, a timestamped folder is created under
                     research/llm-rca/test-output/.
  -h, --help         Show this help.

What the script does:
  1. Iterates over research/llm-rca/test-input/*/{A,B,C}
  2. Reads the prepared context on `main`
  3. Switches to the corresponding `research-N` branch
  4. Runs `codex exec --ephemeral` from the repository root in read-only mode
  5. Switches back to `main`
  3. Writes one output file per run:
     {test-case}-{variant}.txt

Important:
  - Each run starts as a fresh Codex session because of `--ephemeral`.
  - The script does not use `resume` or any persisted Codex session.
  - Codex still has access to the repository contents because runs execute from the project root.
  - Results are written outside the repository by default so branch switching does not affect them.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --model)
      MODEL="${2:-}"
      shift 2
      ;;
    --output-dir)
      OUTPUT_DIR="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! command -v codex >/dev/null 2>&1; then
  echo "codex command not found in PATH" >&2
  exit 1
fi

if [[ ! -d "${TEST_INPUT_DIR}" ]]; then
  echo "Missing test input directory: ${TEST_INPUT_DIR}" >&2
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

git_switch() {
  local branch="$1"
  git -C "${PROJECT_ROOT}" switch "${branch}" >/dev/null
}

ensure_clean_repo() {
  if ! git -C "${PROJECT_ROOT}" diff --quiet || ! git -C "${PROJECT_ROOT}" diff --cached --quiet; then
    echo "Repository has tracked changes. Commit or stash them before running the test script." >&2
    exit 1
  fi
}

build_prompt() {
  local _variant="$1"
  local context_file="$2"

  cat <<EOF
Here is your incident context; find the most likely root cause, do not make any code changes, and return only a textual report.

Context:
$(cat "${context_file}")
EOF
}

branch_for_case() {
  local case_name="$1"
  local case_number
  case_number="${case_name%%-*}"

  if [[ ! "${case_number}" =~ ^[0-9]+$ ]]; then
    echo "Could not infer research branch from case name: ${case_name}" >&2
    return 1
  fi

  echo "research-${case_number}"
}

run_one() {
  local case_dir="$1"
  local variant="$2"
  local case_name
  case_name="$(basename "${case_dir}")"
  local target_branch
  target_branch="$(branch_for_case "${case_name}")"

  local context_file=""
  if [[ -f "${case_dir}/${variant}/context.md" ]]; then
    context_file="${case_dir}/${variant}/context.md"
  elif [[ -f "${case_dir}/${variant}/context.json" ]]; then
    context_file="${case_dir}/${variant}/context.json"
  else
    echo "Skipping ${case_name}-${variant}: missing context file" >&2
    return 0
  fi

  local run_name="${case_name}-${variant}"
  local result_file="${OUTPUT_DIR}/${run_name}.txt"
  local prompt_file
  prompt_file="$(mktemp "/tmp/codex-prompt-${run_name}.XXXXXX")"
  local response_file
  response_file="$(mktemp "/tmp/codex-response-${run_name}.XXXXXX")"
  local cli_log_file
  cli_log_file="$(mktemp "/tmp/codex-cli-${run_name}.XXXXXX")"

  cleanup() {
    rm -f "${prompt_file}" "${response_file}" "${cli_log_file}"
  }
  trap cleanup RETURN

  git_switch "main"
  build_prompt "${variant}" "${context_file}" > "${prompt_file}"
  git_switch "${target_branch}"

  local started_utc
  started_utc="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  local start_epoch
  start_epoch="$(date +%s)"

  local -a cmd=(
    codex exec
    --ephemeral
    -s read-only
    -C "${PROJECT_ROOT}"
    --output-last-message "${response_file}"
  )

  if [[ -n "${MODEL}" ]]; then
    cmd+=(--model "${MODEL}")
  fi

  cmd+=(-)

  set +e
  "${cmd[@]}" < "${prompt_file}" > "${cli_log_file}" 2>&1
  local exit_code=$?
  set -e

  local end_epoch
  end_epoch="$(date +%s)"
  local elapsed_seconds
  elapsed_seconds="$((end_epoch - start_epoch))"

  git_switch "main"

  {
    echo "run_name: ${run_name}"
    echo "case_name: ${case_name}"
    echo "variant: ${variant}"
    echo "target_branch: ${target_branch}"
    echo "model: ${MODEL:-default}"
    echo "started_utc: ${started_utc}"
    echo "elapsed_seconds: ${elapsed_seconds}"
    echo "exit_code: ${exit_code}"
    echo "context_file: ${context_file}"
    echo
    echo "===== RESPONSE ====="
    if [[ -s "${response_file}" ]]; then
      cat "${response_file}"
    else
      echo "<no response captured>"
    fi
    echo
    echo "===== CLI LOG ====="
    cat "${cli_log_file}"
  } > "${result_file}"

  echo "Saved ${result_file}"
}

echo "Writing results to ${OUTPUT_DIR}"

ensure_clean_repo
trap 'git -C "${PROJECT_ROOT}" switch main >/dev/null 2>&1 || true' EXIT
git_switch "main"

shopt -s nullglob
for case_dir in "${TEST_INPUT_DIR}"/*; do
  [[ -d "${case_dir}" ]] || continue
  for variant in A B C; do
    run_one "${case_dir}" "${variant}"
  done
done

echo "Done. Results are in ${OUTPUT_DIR}"
