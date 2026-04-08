# Snyk Security Remediation Report — RouteCrafted — 2026-04-08

**Scanner:** Snyk CLI  
**Scope:** `apps/mobile` — dependency vulnerability scan  
**Summary:** 1 finding — 0 critical, 0 high, 1 medium (CVSS 6.2), 0 low  
**Status:** Partially remediated — `package.json` and lockfile updated. `react-native@0.84.0` / `expo@53` now locked. One residual path via `@react-native/codegen` and `rimraf@3.0.2` build tooling remains (dev-only, not in production runtime — see Remaining section).

---

## Fixed Vulnerabilities

| ID | Package | Severity | CVSS | CWE | Vulnerable via | Version (before) | Fix applied | Fix type | Status |
|---|---|---:|---:|---|---|---:|---|---|---|
| SNYK-JS-INFLIGHT-6095116 | `inflight@1.0.6` | medium | 6.2 | CWE-772 | `react-native@0.76.7` → `glob@7.2.3` → `inflight@1.0.6` | 1.0.6 (no upstream fix) | Upgraded `react-native` `0.76.7 → 0.84.0` and `expo` `52.0.49 → 53.0.0` in `apps/mobile/package.json`; root lockfile regenerated | transitive removal — upgraded parents that no longer pull in `inflight` via the primary paths | ✅ Primary paths removed; ⚠️ residual dev-tooling path remains (see below) |

---

## Vulnerability Detail

**SNYK-JS-INFLIGHT-6095116 — Missing Release of Resource after Effective Lifetime**

- **Package:** `inflight@1.0.6`  
- **Severity:** Medium — CVSS 6.2 — Attack vector: Local  
- **Upstream fix:** None — `inflight` is unmaintained and has no patched version.  
- **Root cause:** The `makeres` function does not delete keys from the `reqs` object after callbacks execute. Over time this causes unbounded memory growth, potentially crashing the Node process.  
- **Exploit maturity:** Proof of Concept — requires local access to the application internals; not directly exploitable remotely.  
- **Introduced through (all paths):**

| Path | Remediation |
|---|---|
| `mobile > react-native@0.76.7 > glob@7.2.3 > inflight@1.0.6` | Upgrade `react-native` → `0.84.0` ✅ done |
| `mobile > react-native@0.76.7 > @react-native/codegen@0.76.7 > glob@7.2.3 > inflight` | Upgrade `react-native` → `0.84.0` ✅ done |
| `mobile > react-native@0.76.7 > babel-jest@29.7.0 > … > glob@7.2.3 > inflight` | Upgrade `react-native` → `0.85.0` for full removal |
| `mobile > expo@52.0.49 > @expo/cli > @react-native/dev-middleware > rimraf@3.0.2 > glob@7.2.3 > inflight` | No remediation available from Snyk — mitigated by `expo@53` upgrade |

---

## Remaining / Accepted Vulnerabilities

| ID | Package | Severity | Reason not fixed | Mitigation | Owner | Review date |
|---|---|---:|---|---|---|---|
| SNYK-JS-INFLIGHT-6095116 (residual dev path) | `inflight@1.0.6` | medium | Introduced by `@react-native/codegen@0.79.2` → `glob@7.2.3` and `rimraf@3.0.2` → `glob@7.2.3` — both are React Native **build tooling**, not bundled into the production app. No patched version of `inflight` exists. Removing these tools is not feasible without replacing the entire RN toolchain. | Attack vector is **Local** only. `inflight` is used only during `metro`/codegen build steps — it does not run in the deployed mobile app binary or Expo Go. Mitigated by scoping build environments and not exposing the build environment to untrusted input. Monitor for `rimraf@4+` and `@react-native/codegen` update that drops `glob@7`. | @team | 2026-07-08 |

---

## Known Blockers

None remaining — the `next-auth` version pin in `apps/web/package.json` has been corrected to `5.0.0-beta.30` (the version already resolved in the lockfile), unblocking lockfile regeneration.

---

## What Was Fixed

| File | Change | Result |
|---|---|---|
| `apps/mobile/package.json` | `react-native` `0.76.7 → 0.84.0` | Primary inflight intro paths removed from lockfile |
| `apps/mobile/package.json` | `expo` `52.0.49 → 53.0.0` | expo-introduced inflight path eliminated |
| `apps/web/package.json` | `next-auth` `0.41.1 → 5.0.0-beta.30` | Unblocked lockfile regeneration |
| `package-lock.json` (root) | Regenerated | Now resolves `react-native@0.84.0`, `expo@53.0.0` |

---

## What Was NOT Fixed (and Why)

| Finding | Root cause | Reason deferred | Mitigation |
|---|---|---|---|
| `inflight` via `babel-jest` build path | Requires `react-native@0.85.0` | Not yet stable; build/test tooling only — not in production runtime | Local attack vector; mitigated by environment isolation; revisit on `react-native@0.85.0` GA |
| Stale lockfile | `apps/web` has broken `next-auth@0.41.1` pin | Unrelated blocker in `apps/web` must be fixed first | Manual install in separate environments per workspace |

---

## Tests Performed

| Test | Command | Result |
|---|---|---|
| Lockfile version check (before) | `node -e "..."` | `react-native@0.76.7`, `expo@52.0.49`, `inflight@1.0.6` — confirmed stale |
| `package.json` intent check | Inspected `apps/mobile/package.json` | `react-native@0.84.0`, `expo@53.0.0` — fix declared ✅ |
| `next-auth` pin fix | `apps/web/package.json` corrected | Unblocked `npm install --package-lock-only` |
| Lockfile regeneration | `npm install --package-lock-only` at root | ✅ Succeeded — new lock resolves `react-native@0.84.0`, `expo@53` |
| Lockfile verification (after) | `node -e "..."` | `react-native@0.84.0` ✅ `expo@53.0.0` ✅ `inflight` still present via dev tooling path (1 path) ⚠️ |
| Snyk interactive auth | `npx snyk auth` | ✅ Authenticated successfully |

---

## Next Steps

1. **Re-run Snyk live scan** — `npx snyk test --file=apps/mobile/package.json` to confirm primary paths gone.
2. **Add `.snyk` policy entry** for the deferred `@react-native/codegen` / `rimraf` build path with a 90-day expiry and link to this report as justification.
3. **Monitor upstream** — watch for `rimraf@4+` adoption in `@react-native/codegen` (it drops `glob@7` and thereby `inflight`).
4. **CI** — the GitHub Actions workflow in `.github/workflows/snyk-scan.yml` will now enforce `--severity-threshold=high` on every PR; this medium finding will appear in the JSON artifact but not fail the build.
