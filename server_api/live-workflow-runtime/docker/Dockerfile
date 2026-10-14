# syntax=docker/dockerfile:1
# Copied Codex source/patch contract, with build tools confined to the builder.
# amd64 is intentional: the pinned V8 archive and bundled bwrap are amd64.
ARG NODE_IMAGE=node:24.14.0-bookworm-slim
FROM ${NODE_IMAGE} AS codex-builder
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN test "$(uname -m)" = x86_64 \
  && apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git jq python3 build-essential clang cmake lld \
    musl-tools pkg-config libssl-dev unzip \
  && rm -rf /var/lib/apt/lists/*
ARG RUSTUP_INIT_URL=https://static.rust-lang.org/rustup/archive/1.29.0/x86_64-unknown-linux-gnu/rustup-init
ARG RUSTUP_INIT_SHA256=4acc9acc76d5079515b46346a485974457b5a79893cfb01112423c89aeb5aa10
RUN curl -fsSL "${RUSTUP_INIT_URL}" -o /tmp/rustup-init \
  && echo "${RUSTUP_INIT_SHA256}  /tmp/rustup-init" | sha256sum -c - \
  && chmod +x /tmp/rustup-init \
  && RUSTUP_HOME=/opt/rustup CARGO_HOME=/usr/local/cargo /tmp/rustup-init -y --no-modify-path --profile minimal --default-toolchain none \
  && rm /tmp/rustup-init
# Limit builder memory and debug artifacts; preserve all four patch test suites.
# Debian musl-gcc injects PT_INTERP even for Rust static PIE; suppress it only
# for the musl Rust target, and verify the installed executable below.
ARG CARGO_BUILD_JOBS=4
ENV CARGO_BUILD_JOBS=${CARGO_BUILD_JOBS} CARGO_PROFILE_DEV_DEBUG=0 CARGO_PROFILE_TEST_DEBUG=0
ARG CODEX_VERSION=0.146.0

ARG CODEX_SOURCE_COMMIT=e363b08c9175ac1cbe5893615dd2cb9ddf95043b
ARG CODEX_SOURCE_URL=https://github.com/openai/codex/archive/e363b08c9175ac1cbe5893615dd2cb9ddf95043b.tar.gz
ARG CODEX_SOURCE_SHA256=0b789281dc96d60f05c28ddaabc3108a7c3e2f99a9be6cae68bb1c03d5db01c6
ARG CODEX_PATCH_REVISION=poll4-flex1-yp1
ARG CODEX_PATCH_SHA256=d2f54083d6cf211ddcd836d80cd58bfd509028c5212c8a32b21e28b6ba74cd10
ARG CODEX_BUNDLED_BWRAP_SHA256=77360cb751ccedc5971391444ac86a8a33c15b04d6b4a6fe45f5d25496e62c4c
ARG CODEX_RUST_VERSION=1.95.0
ARG CODEX_RESOLVED_CARGO_LOCK_SHA256=3e0b9e5c99696ec6a3595e641dfbce227cb1105e3509055ec43f62ec305afdef
ARG CODEX_RUSTY_V8_VERSION=149.2.0
ARG CODEX_RUSTY_V8_ARCHIVE_URL=https://github.com/openai/codex/releases/download/rusty-v8-v149.2.0/librusty_v8_release_x86_64-unknown-linux-musl.a.gz
ARG CODEX_RUSTY_V8_ARCHIVE_SHA256=232a860a60790dc59af99e360e1f3b2ba882c8a1aaaeb055a2a482eddbce8c70
ARG CODEX_RUSTY_V8_BINDING_URL=https://github.com/openai/codex/releases/download/rusty-v8-v149.2.0/src_binding_release_x86_64-unknown-linux-musl.rs
ARG CODEX_RUSTY_V8_BINDING_SHA256=5db3ec0783531d12862a3f38dd5a679273550e67962260b81f07e612a68a0c24
ARG BACKGROUND_TERMINAL_MAX_TIMEOUT_MS=1800000
ARG OPENAI_STREAM_IDLE_TIMEOUT_MS=900000

RUN npm install -g "@openai/codex@${CODEX_VERSION}" \
  && codex_package_dir="$(npm root -g)/@openai/codex" \
  && platform_json="$(node -e 'process.stdout.write(require.resolve("@openai/codex-linux-x64/package.json", {paths:[process.argv[1]]}))' "${codex_package_dir}")" \
  && rm "$(dirname "${platform_json}")/vendor/x86_64-unknown-linux-musl/bin/codex" \
  && npm cache clean --force
COPY patches/background-terminal-progressive-poll.patch /tmp/background-terminal-progressive-poll.patch

# Test the four patched crates together so Cargo unifies their vendored TLS
# features for musl, instead of looking for a host OpenSSL installation.
RUN --mount=type=cache,id=yp-live-workflow-codex-cargo-registry,target=/usr/local/cargo/registry \
    --mount=type=cache,id=yp-live-workflow-codex-cargo-git,target=/usr/local/cargo/git \
    --mount=type=cache,id=yp-live-workflow-codex-cargo-target,target=/tmp/codex-target \
  set -eux; \
  export RUSTUP_HOME=/opt/rustup; \
  export CARGO_HOME=/usr/local/cargo; \
  export CARGO_TARGET_DIR=/tmp/codex-target; \
  export CARGO_TARGET_X86_64_UNKNOWN_LINUX_MUSL_LINKER=musl-gcc; \
  export CARGO_TARGET_X86_64_UNKNOWN_LINUX_MUSL_RUSTFLAGS="-C link-arg=-Wl,--no-dynamic-linker"; \
  export CC_x86_64_unknown_linux_musl=musl-gcc; \
  export AWS_LC_SYS_NO_JITTER_ENTROPY=1; \
  export AWS_LC_SYS_NO_JITTER_ENTROPY_x86_64_unknown_linux_musl=1; \
  export PATH="/usr/local/cargo/bin:${PATH}"; \
  codex_package_dir="$(npm root -g)/@openai/codex"; \
  test -f "${codex_package_dir}/package.json"; \
  codex_platform_package_json="$(node -e 'const packageDir = process.argv[1]; process.stdout.write(require.resolve("@openai/codex-linux-x64/package.json", { paths: [packageDir] }));' "${codex_package_dir}")"; \
  codex_platform_dir="$(dirname "${codex_platform_package_json}")/vendor/x86_64-unknown-linux-musl"; \
  codex_bwrap_path="${codex_platform_dir}/codex-resources/bwrap"; \
  codex_native_path="${codex_platform_dir}/bin/codex"; \
  test -x "${codex_bwrap_path}"; \
  test ! -e "${codex_native_path}"; \
  installed_bwrap_sha256="$(sha256sum "${codex_bwrap_path}" | cut -d ' ' -f 1)"; \
  test "${installed_bwrap_sha256}" = "${CODEX_BUNDLED_BWRAP_SHA256}"; \
  export CODEX_BWRAP_SHA256="${installed_bwrap_sha256}"; \
  echo "${CODEX_PATCH_SHA256}  /tmp/background-terminal-progressive-poll.patch" | sha256sum -c -; \
  curl -fsSL "${CODEX_SOURCE_URL}" -o /tmp/codex-source.tar.gz; \
  echo "${CODEX_SOURCE_SHA256}  /tmp/codex-source.tar.gz" | sha256sum -c -; \
  mkdir -p /tmp/codex-source; \
  tar -xzf /tmp/codex-source.tar.gz -C /tmp/codex-source --strip-components=1; \
  cd /tmp/codex-source; \
  git apply --check /tmp/background-terminal-progressive-poll.patch; \
  git apply /tmp/background-terminal-progressive-poll.patch; \
  resolved_codex_rust_version="$(python3 -c 'import tomllib; print(tomllib.load(open("codex-rs/rust-toolchain.toml", "rb"))["toolchain"]["channel"])')"; \
  test "${resolved_codex_rust_version}" = "${CODEX_RUST_VERSION}"; \
  rustup toolchain install "${CODEX_RUST_VERSION}" --profile minimal; \
  rustup target add --toolchain "${CODEX_RUST_VERSION}" x86_64-unknown-linux-musl; \
  resolved_rusty_v8_version="$(python3 .github/scripts/rusty_v8_bazel.py resolved-v8-crate-version)"; \
  test "${resolved_rusty_v8_version}" = "${CODEX_RUSTY_V8_VERSION}"; \
  rusty_v8_dir=/tmp/codex-rusty-v8; \
  rusty_v8_archive="${rusty_v8_dir}/librusty_v8_release_x86_64-unknown-linux-musl.a.gz"; \
  rusty_v8_binding="${rusty_v8_dir}/src_binding_release_x86_64-unknown-linux-musl.rs"; \
  mkdir -p "${rusty_v8_dir}"; \
  curl -fsSL "${CODEX_RUSTY_V8_ARCHIVE_URL}" -o "${rusty_v8_archive}"; \
  curl -fsSL "${CODEX_RUSTY_V8_BINDING_URL}" -o "${rusty_v8_binding}"; \
  echo "${CODEX_RUSTY_V8_ARCHIVE_SHA256}  ${rusty_v8_archive}" | sha256sum -c -; \
  echo "${CODEX_RUSTY_V8_BINDING_SHA256}  ${rusty_v8_binding}" | sha256sum -c -; \
  export RUSTY_V8_ARCHIVE="${rusty_v8_archive}"; \
  export RUSTY_V8_SRC_BINDING_PATH="${rusty_v8_binding}"; \
  cd codex-rs; \
  cargo "+${CODEX_RUST_VERSION}" fetch --target x86_64-unknown-linux-musl; \
  resolved_cargo_lock_sha256="$(sha256sum Cargo.lock | cut -d ' ' -f 1)"; \
  test "${resolved_cargo_lock_sha256}" = "${CODEX_RESOLVED_CARGO_LOCK_SHA256}"; \
  cargo "+${CODEX_RUST_VERSION}" test --lib --locked --target x86_64-unknown-linux-musl \
    -p codex-core -p codex-model-provider-info -p codex-models-manager -p codex-model-provider yp_live_workflow_; \
  cargo "+${CODEX_RUST_VERSION}" build --locked --release --target x86_64-unknown-linux-musl -p codex-cli --bin codex; \
  patched_codex_path="${CARGO_TARGET_DIR}/x86_64-unknown-linux-musl/release/codex"; \
  if readelf -l "${patched_codex_path}" | grep -q INTERP; then echo "Codex must be static PIE without a dynamic interpreter" >&2; exit 1; fi; \
  strip --strip-debug --strip-unneeded "${patched_codex_path}"; \
  install -m 0755 "${patched_codex_path}" "${codex_native_path}"; \
  mkdir -p /opt/yp-live-workflow; \
  jq -n \
    --arg codexVersion "${CODEX_VERSION}" \
    --arg sourceCommit "${CODEX_SOURCE_COMMIT}" \
    --arg sourceSha256 "${CODEX_SOURCE_SHA256}" \
    --arg patchRevision "${CODEX_PATCH_REVISION}" \
    --arg patchSha256 "${CODEX_PATCH_SHA256}" \
    --arg rustToolchain "${CODEX_RUST_VERSION}" \
    --arg resolvedCargoLockSha256 "${resolved_cargo_lock_sha256}" \
    --arg bundledBwrapSha256 "${installed_bwrap_sha256}" \
    --arg rustyV8Version "${CODEX_RUSTY_V8_VERSION}" \
    --arg rustyV8ArchiveSha256 "${CODEX_RUSTY_V8_ARCHIVE_SHA256}" \
    --arg rustyV8BindingSha256 "${CODEX_RUSTY_V8_BINDING_SHA256}" \
    --argjson backgroundTerminalMaxTimeoutMs "${BACKGROUND_TERMINAL_MAX_TIMEOUT_MS}" \
    --argjson openAiStreamIdleTimeoutMs "${OPENAI_STREAM_IDLE_TIMEOUT_MS}" \
    '{codexVersion: $codexVersion, sourceCommit: $sourceCommit, sourceSha256: $sourceSha256, patchRevision: $patchRevision, patchSha256: $patchSha256, rustToolchain: $rustToolchain, resolvedCargoLockSha256: $resolvedCargoLockSha256, bundledBwrapSha256: $bundledBwrapSha256, rustyV8Version: $rustyV8Version, rustyV8ArchiveSha256: $rustyV8ArchiveSha256, rustyV8BindingSha256: $rustyV8BindingSha256, backgroundTerminalMaxTimeoutMs: $backgroundTerminalMaxTimeoutMs, openAiStreamIdleTimeoutMs: $openAiStreamIdleTimeoutMs, flexServiceTierModels: ["gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-luna"]}' \
    > /opt/yp-live-workflow/codex-patches.json; \
  grep -a -q "yp_live_workflow progressive background terminal poll started" "${codex_native_path}"; \
  grep -a -q "${installed_bwrap_sha256}" "${codex_native_path}"; \
  codex --version | grep -F "codex-cli ${CODEX_VERSION}"; \
  rm -rf /tmp/codex-source /tmp/codex-source.tar.gz /tmp/codex-rusty-v8 /tmp/background-terminal-progressive-poll.patch

FROM ${NODE_IMAGE} AS runtime
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash ca-certificates curl git git-lfs jq ripgrep python3 python3-venv \
    build-essential openssh-client less procps unzip xz-utils \
    docker.io iptables sudo \
  && rm -rf /var/lib/apt/lists/*
COPY --from=codex-builder /usr/local/lib/node_modules/@openai /usr/local/lib/node_modules/@openai
COPY --from=codex-builder /opt/yp-live-workflow/codex-patches.json /opt/yp-live-workflow/codex-patches.json
RUN ln -s /usr/local/lib/node_modules/@openai/codex/bin/codex.js /usr/local/bin/codex \
  && npm install -g typescript@5.9.3 tsx@4.23.15 \
  && npm cache clean --force
# Resolve package imports and ambient Node types from any /workspace package.
# These are fixed development dependencies; no install is needed during a run.
COPY package.json package-lock.json /opt/yp-workflow-dev/
RUN npm ci --prefix /opt/yp-workflow-dev --ignore-scripts --no-audit --no-fund \
  && ln -s /opt/yp-workflow-dev/node_modules /node_modules \
  && npm cache clean --force
ARG CODEX_VERSION=0.146.0

ARG CODEX_SOURCE_COMMIT=e363b08c9175ac1cbe5893615dd2cb9ddf95043b
ARG CODEX_SOURCE_URL=https://github.com/openai/codex/archive/e363b08c9175ac1cbe5893615dd2cb9ddf95043b.tar.gz
ARG CODEX_SOURCE_SHA256=0b789281dc96d60f05c28ddaabc3108a7c3e2f99a9be6cae68bb1c03d5db01c6
ARG CODEX_PATCH_REVISION=poll4-flex1-yp1
ARG CODEX_PATCH_SHA256=d2f54083d6cf211ddcd836d80cd58bfd509028c5212c8a32b21e28b6ba74cd10
ARG CODEX_BUNDLED_BWRAP_SHA256=77360cb751ccedc5971391444ac86a8a33c15b04d6b4a6fe45f5d25496e62c4c
ARG CODEX_RUST_VERSION=1.95.0
ARG CODEX_RESOLVED_CARGO_LOCK_SHA256=3e0b9e5c99696ec6a3595e641dfbce227cb1105e3509055ec43f62ec305afdef
ARG CODEX_RUSTY_V8_VERSION=149.2.0
ARG CODEX_RUSTY_V8_ARCHIVE_URL=https://github.com/openai/codex/releases/download/rusty-v8-v149.2.0/librusty_v8_release_x86_64-unknown-linux-musl.a.gz
ARG CODEX_RUSTY_V8_ARCHIVE_SHA256=232a860a60790dc59af99e360e1f3b2ba882c8a1aaaeb055a2a482eddbce8c70
ARG CODEX_RUSTY_V8_BINDING_URL=https://github.com/openai/codex/releases/download/rusty-v8-v149.2.0/src_binding_release_x86_64-unknown-linux-musl.rs
ARG CODEX_RUSTY_V8_BINDING_SHA256=5db3ec0783531d12862a3f38dd5a679273550e67962260b81f07e612a68a0c24
ARG BACKGROUND_TERMINAL_MAX_TIMEOUT_MS=1800000
ARG OPENAI_STREAM_IDLE_TIMEOUT_MS=900000

ARG IMAGE_VERSION=20261014.1

LABEL org.opencontainers.image.version="${IMAGE_VERSION}"
LABEL ai.yp-live-workflow.codex.version="${CODEX_VERSION}"
LABEL ai.yp-live-workflow.codex.source-commit="${CODEX_SOURCE_COMMIT}"
LABEL ai.yp-live-workflow.codex.patch-revision="${CODEX_PATCH_REVISION}"
LABEL ai.yp-live-workflow.codex.bwrap-sha256="${CODEX_BUNDLED_BWRAP_SHA256}"
LABEL ai.yp-live-workflow.codex.rust-toolchain="${CODEX_RUST_VERSION}"
LABEL ai.yp-live-workflow.codex.resolved-cargo-lock-sha256="${CODEX_RESOLVED_CARGO_LOCK_SHA256}"
LABEL ai.yp-live-workflow.codex.rusty-v8-version="${CODEX_RUSTY_V8_VERSION}"

COPY versions.json /opt/yp-live-workflow/runtime-versions.json
COPY docker-entrypoint.sh /usr/local/bin/yp-live-workflow-codex-entrypoint
RUN chmod +x /usr/local/bin/yp-live-workflow-codex-entrypoint \
  && groupadd --system --gid 10001 codex \
  && useradd --system --uid 10001 --gid codex --create-home --home-dir /home/codex --shell /bin/bash codex \
  && echo "codex ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/codex \
  && chmod 0440 /etc/sudoers.d/codex \
  && mkdir -p /workspace /codex-home /artifacts /cache \
  && chown -R codex:codex /home/codex /workspace /codex-home /artifacts /cache
ENV CODEX_HOME=/codex-home LANG=C.UTF-8 LC_ALL=C.UTF-8
WORKDIR /workspace
USER root
ENTRYPOINT ["/usr/local/bin/yp-live-workflow-codex-entrypoint"]
CMD ["codex", "app-server", "--listen", "stdio://"]
