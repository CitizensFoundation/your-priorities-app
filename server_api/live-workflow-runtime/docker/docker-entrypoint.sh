#!/usr/bin/env bash
set -e

umask "${YP_LIVE_WORKFLOW_CONTAINER_UMASK:-0000}"

mkdir -p /cache/capabilities/bin /cache/npm /workspace
export npm_config_cache=/cache/npm

capability_bin_path="${YP_LIVE_WORKFLOW_CAPABILITY_BIN_PATH:-/cache/capabilities/bin}"
export PATH="${capability_bin_path}:${PATH}"

start_inner_docker="${YP_LIVE_WORKFLOW_START_INNER_DOCKER:-1}"

if [[ "${start_inner_docker}" == "0" || "${start_inner_docker}" == "false" || "${start_inner_docker}" == "off" ]]; then
  exec "$@"
fi

if ! command -v dockerd >/dev/null 2>&1; then
  echo "Inner Docker requires dockerd to be installed in the Codex image." >&2
  exit 125
fi

if [[ "$(id -u)" != "0" ]]; then
  echo "Inner Docker requires the Codex container to run as root." >&2
  exit 125
fi

if ! mkdir -p /var/run "${YP_LIVE_WORKFLOW_INNER_DOCKER_ROOT:-/var/lib/docker}"; then
  exit 125
fi

dockerd \
  --host=unix:///var/run/docker.sock \
  --data-root="${YP_LIVE_WORKFLOW_INNER_DOCKER_ROOT:-/var/lib/docker}" \
  > "${YP_LIVE_WORKFLOW_INNER_DOCKER_LOG:-/var/log/yp-live-workflow-inner-dockerd.log}" 2>&1 &
dockerd_pid="$!"

for _ in $(seq 1 "${YP_LIVE_WORKFLOW_INNER_DOCKER_READY_ATTEMPTS:-60}"); do
  if docker info >/dev/null 2>&1; then
    break
  fi

  if ! kill -0 "${dockerd_pid}" >/dev/null 2>&1; then
    cat "${YP_LIVE_WORKFLOW_INNER_DOCKER_LOG:-/var/log/yp-live-workflow-inner-dockerd.log}" >&2 || true
    exit 125
  fi

  sleep 1
done

if ! docker info >/dev/null 2>&1; then
  cat "${YP_LIVE_WORKFLOW_INNER_DOCKER_LOG:-/var/log/yp-live-workflow-inner-dockerd.log}" >&2 || true
  exit 125
fi

exec "$@"
