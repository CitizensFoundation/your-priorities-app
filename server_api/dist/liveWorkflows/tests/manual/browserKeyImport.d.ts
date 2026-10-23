import type { RequestHandler } from "express";
export declare const browserKeyMarker = "sk-manual-import-only-never-a-real-key";
export declare const offlineBrowserKey = "sk-offline-browser-fixture-only";
export declare function importedBrowserKey(getKey: () => string | undefined, getOrigin: () => string | undefined, getGroupId?: () => number | undefined): RequestHandler;
export declare const browserKeyImportButton = "<p><button id=\"import-test-key\" type=\"button\">Use imported test key</button> Uses the key held by the local test server. Offline mode uses a fake key.</p>\n<script type=\"module\">\ndocument.querySelector('#import-test-key').addEventListener('click', () => {\n  const input = document.querySelector('yp-live-workflow')?.shadowRoot?.querySelector('input[name=\"apiKey\"]');\n  if (!input || input.disabled) return;\n  input.closest('details').open = true;\n  input.value = 'sk-manual-import-only-never-a-real-key';\n  input.form.requestSubmit();\n});\n</script>";
