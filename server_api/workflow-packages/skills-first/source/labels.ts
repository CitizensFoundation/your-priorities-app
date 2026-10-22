/** Normalize enum/display labels only. Evidence quotes and descriptions stay verbatim. */
export function readingLevelLabel(value: string): string {
  return value.replace(/[\u2018\u2019]/g, "'");
}
export function licenseLabel(value: string): string {
  return /^driver(?:s|['\u2019]s)?\s+licen[cs]e$/i.test(value.trim())
    ? "Driver's license"
    : value;
}
