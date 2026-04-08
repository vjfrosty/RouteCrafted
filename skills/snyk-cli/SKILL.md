---
name: snyk-cli-nextjs
description: "Snyk CLI skill for scanning Next.js apps and monorepos, including guidance for projects that must be built before testing. Use to add local/CI scans, remediation steps, and GitHub Actions snippets."
applyTo:
  - "**/package.json"
  - "apps/web/**"
  - "apps/mobile/**"
---

# Snyk CLI — Next.js Security Testing Skill

Purpose
- Provide a focused, repeatable workflow to run the Snyk CLI against Next.js apps and monorepos.
- Explain when a project must be built before running `snyk test`, why that matters, and how to automate builds in CI.

When to use
- Scan dependency vulnerabilities (`snyk test`) and create project snapshots (`snyk monitor`).
- Run static code analysis (`snyk code test`) for Snyk Code if available on your account.
- Use in local dev, PR checks, and CI pipelines for `apps/web` and other Next.js packages.

Prerequisites
- A Snyk account and a CLI token (`SNYK_TOKEN`) for CI or run `snyk auth` locally.
- Node.js and the project-specific package manager (npm / yarn / pnpm) installed.
- For container scans: Docker installed and available.
- Prefer checked-in lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) for reliable dependency resolution.

Quick Start (local)
1. Install Snyk CLI (local or global):

```
npx snyk --version
# or
npm install -g snyk
```

2. Authenticate (interactive) or set token for CI:

```
snyk auth            # interactive
# or in CI
export SNYK_TOKEN=...
```

3. If your project requires a build to produce lockfiles or vendorized deps, run install+build first:

```
npm ci
npm run build        # or `next build` where applicable
```

4. Run Snyk tests:

```
# dependency scan for all detected projects
npx snyk test --all-projects

# static analysis (if enabled for your account)
npx snyk code test

# monitor snapshot to Snyk
npx snyk monitor --all-projects
```

Deep analysis — how Snyk CLI detects dependencies and why a build may be required

- Manifests vs lockfiles: a manifest (`package.json`) lists declared dependencies but usually does not pin exact resolved versions. Lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) record exact resolved dependency versions. Snyk uses lockfiles when available to produce accurate vulnerability findings.

- Build-time resolution: some projects or package managers only create or vendor resolved dependencies during an install/build step. Examples include workspaces or setups that generate artifacts or vendor directories during install, or language ecosystems where dependency resolution happens at compile time. For these repositories Snyk cannot infer full dependency graphs from the manifest alone.

- Result: If your repo lacks lockfiles or uses a build that materializes dependencies, run the install/build step in an isolated environment prior to `snyk test` so the CLI can see the resolved dependency graph.

Next.js-specific notes
- Most Next.js apps are standard Node.js projects: if you commit your lockfile, Snyk dependency scanning is accurate without requiring a full `next build`.
- Cases that require build-first:
  - Monorepos where package resolutions and lockfile generation happen during workspace install/build.
  - Repos that vendor dependencies or generate code during `postinstall` or `build` scripts.
  - Projects using unusual package managers or local linking that require an install step to create the final dependency graph.
- Recommendation: Always commit lockfiles for reproducible scans. If lockfiles are intentionally excluded (some OSS workflows), run `npm ci` / `pnpm install` and then `npx snyk test --file=path/to/generated-lockfile` or `npx snyk test --all-projects` after install.

Workflows

- Local developer scan
  1. `npm ci` (or `pnpm install` / `yarn install`)
 2. `npm run build --if-present` (if build materializes deps)
 3. `npx snyk test --all-projects`

- CI (GitHub Actions) — fail PRs on high severity

```yaml
jobs:
  snyk:
    runs-on: ubuntu-latest
    env:
      # react-native@0.84+ pulls metro@0.83.x which breaks `expo export` in CI
      # (ERR_PACKAGE_PATH_NOT_EXPORTED on metro/src/lib/TerminalReporter).
      # Snyk scanning only needs `npm ci`; no build required for npm dependency scanning.
      # Setting SKIP_MOBILE_BUILD=true tells apps/mobile/package.json build script
      # to exit 0 without running expo export.
      SKIP_MOBILE_BUILD: 'true'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      # No build step — Snyk npm scanning reads from the lockfile, not build output.

      - name: Snyk test (JSON capture)
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: npx snyk test --all-projects --json > snyk-results.json || true
      - name: Generate Markdown report
        run: node ./scripts/snyk-report.js --input snyk-results.json --output sec_reports/snyk-report.md
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: snyk-report
          path: sec_reports/snyk-report.md
      - name: Enforce threshold
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: npx snyk test --all-projects --severity-threshold=high
      - name: Snyk monitor
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        run: npx snyk monitor --all-projects
```

- Monorepo guidance
  - Use `npx snyk test --all-projects` at the monorepo root to detect multiple `package.json` files.
  - If some packages are private or intentionally excluded, use `--exclude=path` or add `.snyk` policy ignores.

- Container scanning
  1. Build image: `docker build -t myapp:latest .`
  2. `npx snyk container test myapp:latest` or `npx snyk container test --file=Dockerfile .`

Decision points and quick heuristics
- If a `lockfile` exists at repo root: run `snyk test --all-projects` — no build required for dependency scanning.
- If no lockfile or you use workspace managers that generate lockfiles at install: run `npm ci` (or applicable install) then `snyk test`.
- If the repository includes code generation or vendoring during `build`: run the `build` step first.
- To include code analysis, run `snyk code test` (availability depends on your Snyk plan).

Remediation and triage
- Use `npx snyk wizard` interactively to step through available fixes.
- Use `npx snyk fix` to attempt automatic dependency upgrades where safe.
- For PR automation and end-to-end fixes, enable Snyk's GitHub integration (it can open fix PRs automatically).

Ignoring and policy
- Use `.snyk` policy files or `snyk ignore` to mark accepted findings with expiry and reason.

Outputs and artifacts
- CLI output formats: plain text (default), `--json` for machine parsing, and `--sarif` or `--sarif-file-output` for SARIF (code scanning tools).
- `snyk monitor` creates a project snapshot in Snyk that can be used for historical tracking.

Folder layout

```
RouteCrafted/
├── scripts/
│   └── snyk-report.js        # JSON → Markdown report generator
├── sec_reports/
│   ├── README.md
│   └── snyk-report.md        # auto-generated; commit to track history
├── snyk-results.json         # gitignored raw JSON from snyk test
└── .github/workflows/
    └── snyk-scan.yml         # CI pipeline
```

Example package.json scripts (in each workspace)

```json
"scripts": {
  "snyk:scan": "snyk test --all-projects",
  "snyk:monitor": "snyk monitor --all-projects",
  "snyk:report": "node ../../scripts/snyk-report.js --input snyk-results.json --output ../../sec_reports/snyk-report.md",
  "snyk:code": "snyk code test"
}
```

Prompts and how the skill can be used
- "Run a Snyk scan for the web app and return a short summary of high/critical issues."
- "Add a GitHub Actions workflow to run Snyk tests after building the project and fail on high severity vulnerabilities."
- "Explain why this repository needs a build step before running `snyk test` and propose minimal CI changes."

Assumptions and limitations
- This skill assumes network access to Snyk services and an available `SNYK_TOKEN` for non-interactive runs.
- Snyk findings depend on accurate dependency graphs; missing lockfiles reduce precision.
- Some Snyk features (Snyk Code, fix PRs) require a paid plan or integration configuration.

Next steps (suggested)
- Add `SNYK_TOKEN` to CI secrets and enable the included workflow snippet.
- Add the `snyk:scan` script to `package.json` and run locally to validate.
- Want me to scaffold the GitHub Action and add `snyk:scan` to `apps/web/package.json` now? (I can create the files and a PR.)

References
- Snyk docs: Open-source projects that must be built before testing — see the Snyk documentation for more cases and examples.

Vulnerability Response Workflow

- 1) Detect & Capture
  - Run Snyk with JSON output to capture findings:

  ```bash
  # Run from repo root — output goes to sec_reports/
  npx snyk test --all-projects --json > snyk-results.json
  npx snyk code test --json > snyk-code-results.json   # optional
  ```

  - Save outputs as artifacts attached to the incident or CI run.

- 2) Triage
  - Classify findings by **severity**, **exploit maturity**, **reachable in runtime**, and **business impact**.
  - For each finding capture: package, vulnerable version, path, CVE/ID, severity, fixed version (if suggested), and Snyk remediation advice.
  - Prioritize remediation by severity + exploitability + business impact (e.g., fix Critical/High + exploitable).

- 3) Contain / Mitigate (if immediate exposure)
  - Apply temporary mitigations (feature flags, access controls, revert to safe commit, block vulnerable endpoint).
  - For container images, remove image from registry or replace with patched image.

- 4) Fix
  - Preferred automated fix: `npx snyk fix` or use the `snyk wizard` to apply safe upgrades.
  - Manual fix: bump dependency in `package.json` to the minimal secure version, run `npm ci` (or `pnpm install`), and address any test failures.
  - If the fix requires code changes, create a branch and open a PR; include the Snyk finding and remediation steps in the PR description.

- 5) Verify
  - Re-run Snyk: `npx snyk test --all-projects` and confirm the specific vulnerability is gone.
  - Run full test-suite and `npm run build` to verify runtime behavior.
  - Optionally run `npx snyk monitor` to record the new baseline.

- 6) Report (Markdown)
  - Run the report generator to produce `sec_reports/snyk-report.md`:

  ```bash
  node scripts/snyk-report.js --input snyk-results.json --output sec_reports/snyk-report.md
  ```

  - The report documents what was fixed, what remains open, and why:

  ```md
  # Snyk Security Report — <repo> — <date>

  **Scanner:** Snyk CLI <version>
  **CI run / Branch:** <link to CI / branch>
  **Summary:** X total findings → Y fixed, Z remaining (by severity)

  ## Fixed Vulnerabilities
  | ID | Package | Path | Severity | Version (before) | Version (after) | Fix Type | PR / Commit |
  |---|---:|---|---:|---:|---:|---|---|
  | CVE-202X-XXXX | lodash | apps/web/node_modules/lodash | high | 4.17.19 | 4.17.21 | upgrade | https://github.com/.../pull/123 |

  ## Remaining / Accepted Vulnerabilities
  | ID | Package | Path | Severity | Version | Reason not fixed | Mitigation / Acceptance | Owner |
  |---|---:|---|---:|---:|---:|---:|---|
  | CVE-202X-YYYY | optional-lib | packages/shared | medium | 1.2.3 | breaking change to upgrade; scheduled | runtime mitigation: limited access | @alice |

  ## Tests Performed
  - `npx snyk test --all-projects` (before & after): [attachments/links]
  - Unit tests: `npm test` — PASS/FAIL
  - Integration / E2E: [commands] — PASS/FAIL

  ## Notes & Next Steps
  - Backport fixes to `main`, `release/*` branches.
  - Monitor reintroduced risks; schedule re-scan in X days.
  ```

- 7) Close Loop
  - Merge PRs, close associated issues, update `.snyk` ignore policy only with justification.
  - Add the report to the security incident tracker and notify stakeholders.

Automation tips
- Capture Snyk JSON output in CI artifacts to enable automated report generation.
- All Markdown reports land in `sec_reports/` — commit them to version-control your security history.
- Add `snyk-results.json` to `.gitignore` (raw JSON may contain internal path info); commit only the `.md` reports in `sec_reports/`.
- Use Snyk's GitHub integration to create fix PRs automatically when possible.

Report generator location
- Script: `scripts/snyk-report.js` (monorepo root — shared across all workspaces)
- Output: `sec_reports/snyk-report.md` (default)
- Run locally: `node scripts/snyk-report.js --input snyk-results.json --output sec_reports/snyk-report.md`