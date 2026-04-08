#!/usr/bin/env node
/**
 * Simple Snyk JSON -> Markdown report generator
 * Usage: node tools/snyk-report.js --input snyk-results.json --output snyk-report.md
 */
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { input: 'snyk-results.json', output: 'snyk-report.md' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) { out.input = args[i + 1]; i++; }
    else if (args[i] === '--output' && args[i + 1]) { out.output = args[i + 1]; i++; }
  }
  return out;
}

function readJsonRobust(file) {
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8').trim();
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) {
    // Try newline-delimited JSON (Snyk may emit multiple JSON objects)
    const docs = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const parsed = docs.map(d => { try { return JSON.parse(d); } catch (err) { return null; } }).filter(Boolean);
    if (parsed.length === 0) return null;
    return parsed;
  }
}

function extractVulns(parsed) {
  const vulns = [];
  if (!parsed) return vulns;
  if (Array.isArray(parsed)) {
    parsed.forEach(proj => {
      if (proj && Array.isArray(proj.vulnerabilities)) {
        proj.vulnerabilities.forEach(v => vulns.push(Object.assign({}, v, { project: proj.path || proj.projectName || '' })));
      } else if (proj && Array.isArray(proj.issues)) {
        // fallback
      }
    });
  } else if (parsed && Array.isArray(parsed.vulnerabilities)) {
    parsed.vulnerabilities.forEach(v => vulns.push(Object.assign({}, v, { project: parsed.path || parsed.projectName || '' })));
  }
  return vulns;
}

function safe(val) { return (val === undefined || val === null) ? '' : String(val).replace(/\|/g, '\\|'); }

function makeReport(vulns, repoName) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  vulns.forEach(v => {
    const s = (v.severity || '').toLowerCase();
    if (s in counts) counts[s]++;
  });

  const date = new Date().toISOString();
  let md = `# Snyk Security Report — ${repoName} — ${date}\n\n`;
  md += `**Scanner:** Snyk CLI\n\n`;
  md += `**Summary:** ${vulns.length} total findings — ${counts.critical} critical, ${counts.high} high, ${counts.medium} medium, ${counts.low} low\n\n`;

  if (vulns.length === 0) {
    md += `No vulnerabilities found.\n`;
    return md;
  }

  md += `## Findings\n\n`;
  md += `| ID | Package | Path | Severity | Version | Fix | URL | Project |\n`;
  md += `|---|---|---|---:|---|---|---|---|\n`;
  vulns.forEach(v => {
    const id = (v.identifiers && v.identifiers.CVE && v.identifiers.CVE[0]) || v.id || v.title || '';
    const pkg = v.packageName || v.package || v.name || '';
    const pathStr = Array.isArray(v.from) ? v.from.join(' → ') : (v.path || v.packageManager || '');
    const severity = v.severity || '';
    const version = v.version || '';
    let fix = '';
    if (v.fixes && v.fixes.length) fix = v.fixes.map(f => f.upgradeTo || '').filter(Boolean).join(', ');
    if (!fix && v.upgradePath && v.upgradePath.length) fix = v.upgradePath.join(' → ');
    const url = v.url || (v.id ? `https://snyk.io/vuln/${v.id}` : '');
    const proj = v.project || '';
    md += `| ${safe(id)} | ${safe(pkg)} | ${safe(pathStr)} | ${safe(severity)} | ${safe(version)} | ${safe(fix)} | ${safe(url)} | ${safe(proj)} |\n`;
  });

  md += "\n## Tests Performed\n\n";
  md += "- `npx snyk test --all-projects --json` (captured)\n";
  md += "- `npm test` — run separately\n\n";
  md += `## Notes & Next Steps\n\n`;
  md += `- Re-run Snyk after fixes and attach before/after snapshots.\n`;

  return md;
}

function main() {
  const { input, output } = parseArgs();
  const parsed = readJsonRobust(input);
  const vulns = extractVulns(parsed);
  const repoName = path.basename(process.cwd());
  const report = makeReport(vulns, repoName);
  fs.writeFileSync(output, report, 'utf8');
  console.log(`Wrote report to ${output}`);
}

main();
