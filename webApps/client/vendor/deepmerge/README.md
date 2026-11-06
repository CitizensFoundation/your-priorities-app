# Local deepmerge security fork

This private package adapts [deepmerge 4.3.1](https://github.com/TehShrike/deepmerge/tree/v4.3.1)
and its bundled [is-mergeable-object 1.1.0](https://github.com/TehShrike/is-mergeable-object/tree/v1.1.0)
predicate to TypeScript. Both upstream projects are MIT licensed. The upstream
deepmerge license is retained in `LICENSE`.

The local change fixes [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4):
the string key `__proto__` is discarded before reading its value in both the
target-copy and source-merge paths. This prevents ordinary destination objects
from inheriting an attacker-controlled prototype, including when the target has
a null prototype or an own enumerable `__proto__` property. Safe own
`constructor` and `prototype` fields remain ordinary data.

The CommonJS callable export, ESM default import, `.all`, enumerable symbols,
array concatenation, cloning and custom merge options retain the upstream API.
Custom callbacks are trusted code; `clone: false` retains upstream reference
semantics and does not recursively sanitize objects returned by reference.
This package provides the Node entry point used here, not upstream's UMD bundle.

## Build and test

From `webApps/client`:

```sh
npm run build:deepmerge
npm run test:deepmerge
npm run test:security
```

Edit `index.cts`. Commit the generated `lib/index.cjs` and `lib/index.d.cts`
alongside it. They are required for fresh `npm ci --ignore-scripts` installs:
Node does not strip TypeScript in installed `node_modules` packages. Tests check
that these artifacts match the TypeScript source and that actual dependents
resolve the fork. No install hook or extra runtime dependency is required.

The root `package.json` declares a development dependency on `deepmerge` as
`file:./vendor/deepmerge` and overrides transitive copies with `$deepmerge`.
The direct dependency anchors the relative path. Production dependencies that
need deepmerge still resolve the fork with `npm ci --omit=dev`; tests cover both
full and production-only installs with lifecycle scripts disabled.
The separate `@yrpri/deepmerge` name and local version identify our maintained
fork; an empty audit report is not proof of its safety. Keep the exploit and
compatibility tests when updating or replacing this code.

## SDK distribution scope

The SDK includes this directory for reuse. Keeping the direct file dependency
in `devDependencies` avoids adding a local runtime dependency to the published
SDK. npm only honors overrides in the installing project's root manifest.
Installing `@yrpri/webapp` as a dependency does **not** automatically
apply this override to its hoisted dependencies. Such consumers must copy this
directory into their own repository, declare a development file dependency on that
copy, and add the matching `$deepmerge` root override, or use a separately
published and reviewed fork. The presence of this directory in the SDK tarball
does not protect downstream consumers by itself.

When upstream publishes a verified fix, replace the local override with the
patched release, rerun the regression and consumer-resolution tests, and remove
the vendored copy only after those checks pass.
