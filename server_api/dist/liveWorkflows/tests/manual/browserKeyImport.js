// This marker is deliberately public. Only the isolated, loopback manual executable
// recognizes it. It goes through the normal UI form and production login controller.
export const browserKeyMarker = "sk-manual-import-only-never-a-real-key";
export const offlineBrowserKey = "sk-offline-browser-fixture-only";
export function importedBrowserKey(getKey, getOrigin, getGroupId = () => 1) {
    return (req, res, next) => {
        const groupId = getGroupId();
        if (req.method === "POST" &&
            Number.isSafeInteger(groupId) &&
            groupId > 0 &&
            req.path === `/api/live-workflows/groups/${groupId}/account/api-key` &&
            req.body?.apiKey === browserKeyMarker) {
            if (!getOrigin() || req.headers.origin !== getOrigin()) {
                res.sendStatus(403);
                return;
            }
            const apiKey = getKey();
            if (!apiKey) {
                res
                    .status(409)
                    .json({ error: "Import the manual test key before starting" });
                return;
            }
            req.body = { apiKey };
        }
        next();
    };
}
export const browserKeyImportButton = `<p><button id="import-test-key" type="button">Use imported test key</button> Uses the key held by the local test server. Offline mode uses a fake key.</p>
<script type="module">
document.querySelector('#import-test-key').addEventListener('click', () => {
  const input = document.querySelector('yp-live-workflow')?.shadowRoot?.querySelector('input[name="apiKey"]');
  if (!input || input.disabled) return;
  input.closest('details').open = true;
  input.value = '${browserKeyMarker}';
  input.form.requestSubmit();
});
</script>`;
