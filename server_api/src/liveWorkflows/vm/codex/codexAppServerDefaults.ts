export const DefaultCodexAppServerArgs = [
  "app-server",
  "--disable",
  "shell_snapshot",
  "-c",
  'web_search="live"',
  "--listen",
  "stdio://",
] as const;
