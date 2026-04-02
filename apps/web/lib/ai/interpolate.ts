/**
 * Replace {{variableName}} placeholders in a template string.
 * Only word characters (\w+) are matched — no eval, no injection risk.
 * Unrecognised placeholders are left as-is.
 */
export function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `{{${key}}}`;
  });
}
