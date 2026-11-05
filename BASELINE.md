# Verification Baseline

This ledger records commands as observed before and after Phase 1 verification wiring. It is evidence, not a claim that every existing check passes.

## Provenance

- Upstream origin: recorded in NOTICE, which carries the attribution the licence requires.
- Upstream commit: `ebffb665269647286a7340aacde9ea3c98e62580`
- Pre-wiring working commit: `27be826401ed5f2ef688dbac673f65050a252c45`
- Pre-wiring status: `.planning/config.json` was already modified by the GSD orchestrator; application source was clean.

## Tool versions

| Command | Exit | Observed result |
|---------|------|-----------------|
| `node --version` | 0 | `v22.23.1` |
| `pnpm --version` | 0 | `9.15.0` |

## Pre-wiring results

| Command | Exit | Observed result | Classification |
|---------|------|-----------------|----------------|
| `pnpm install --frozen-lockfile` | 0 | Installed the committed dependency graph. The SHA-256 of `pnpm-lock.yaml` remained `dc5b62fb6784a71eeec4b4de5f058688cfafc7e630cdc8d6843b129786258480`. | Pass |
| `pnpm run build` | 1 | Gateway build stopped at `rm -rf dist` because `rm` is unavailable on the Windows baseline; Turbo then stopped the remaining builds. | Check wiring failure |
| `pnpm run check-types` | 0 | Turbo reported `0 successful, 0 total`; no workspace type check ran. | False-green check wiring |
| `pnpm run lint` | 1 | Console ESLint reported existing source findings, including `no-explicit-any`, React hook, and fast-refresh violations. | Product/source failures deferred |
| `pnpm --filter @atrium/gateway test` | 0 | Vitest passed 13 files and 88 tests. | Pass |

## Post-wiring results

Runtime metadata now selects Node `22.x` and keeps `pnpm@9.15.0`. Two verification-only wiring defects were repaired without changing application behavior: gateway build cleanup now uses Node's cross-platform `fs.rmSync`, and gateway `rootDir` is applied only by `tsconfig.build.json` so the no-emit test-inclusive check can run.

| Command | Exit | Observed result | Classification |
|---------|------|-----------------|----------------|
| `pnpm run verify:types` | 1 | The gateway check reaches the existing `custom-fields.test.ts` fixture and reports TS2769 because its `Map` mixes string and number values. The agent, worker, console, and launcher type commands were also run individually and each exited 0. | Product/test-source failure deferred; failure propagates |
| `pnpm run verify:lint` | 1 | Console lint reports 85 existing findings (83 errors, 2 warnings). Launcher lint was run individually and exited 0 with 7 warnings. | Product/source failures deferred; failure propagates |
| `pnpm run verify:test` | 0 | Gateway Vitest passed 13 files and 88 tests. | Pass |
| `pnpm run verify:build` | 0 | Gateway, agent, worker, console, and launcher builds completed. Console emitted a non-blocking bundle-size warning. | Pass |
| `pnpm run verify` | 1 | The aggregate stopped at the failing gateway type check and returned non-zero. | Expected honest failure propagation |

The post-wiring frozen lockfile hash remains `dc5b62fb6784a71eeec4b4de5f058688cfafc7e630cdc8d6843b129786258480`.

## Repository reference

| Role | Value |
|------|-------|
| `origin` | `https://github.com/marwanelh/atrium.git` — private |
| Destination visibility | `isPrivate=true`, `visibility=PRIVATE` (GitHub canonicalises the owner as `Marwanelh`) |
| Branch | `refs/heads/main` |

The development history was later consolidated into a single import commit, so `main` no longer carries
the individual commits that produced the wiring described above. The verification evidence in this file
is unaffected: it records what the commands returned when they were run.

Verify the current state with:

```bash
git log --oneline            # a single import commit
git status --short           # clean
gh repo view marwanelh/atrium --json isPrivate   # true
```

## Scope

Phase 1 may repair command wiring and configuration. Existing source findings remain visible and are not fixed in this baseline task. No credentials, environment values, raw logs, or machine-specific absolute paths are recorded here.
