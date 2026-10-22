export function isSafeRelativePath(value: string): boolean {
  if (value.length === 0 || value.startsWith("/") || value.startsWith("\\") || /^[a-zA-Z]:[\\/]/u.test(value)) {
    return false;
  }

  return !value.split(/[\\/]+/u).some((segment) => segment.length === 0 || segment === "." || segment === "..");
}

export function normalizeSafeRelativePath(value: unknown): string | null {
  if (typeof value !== "string" || !isSafeRelativePath(value)) return null;
  return value.replace(/\\/gu, "/").replace(/\/+/gu, "/");
}
