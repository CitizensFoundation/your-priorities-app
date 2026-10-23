import assert from "node:assert/strict";
import test from "node:test";
import { resolveAuthEnvironment } from "../../codex/codexAuth.js";
const apiKey = "sk-explicit-fake-key-for-unit-tests";
test("Codex API authentication requires an explicit key and never populates the launch environment", () => {
    const auth = resolveAuthEnvironment({
        provider: "openai",
        authMode: "openai_api_key",
        metadata: { openAiApiKeyMaterial: { apiKey } },
    }, { OPENAI_API_KEY: "unrelated-key" });
    assert.equal(auth.apiKey, apiKey);
    assert.deepEqual(auth.env, {});
    assert.equal(auth.secretRef, null);
    assert.equal(auth.apiFallback, false);
});
test("Codex rejects environment secrets, mixed credentials, fallback modes and missing credentials", () => {
    const invalid = [
        null,
        {
            provider: "openai",
            authMode: "openai_api_key",
            secretRef: "OPENAI_API_KEY",
        },
        { provider: "openai", authMode: "openai_api_key", metadata: {} },
        {
            provider: "openai",
            authMode: "openai_api_key",
            metadata: { openAiApiKeyMaterial: { apiKey: "bad" } },
        },
        {
            provider: "openai",
            authMode: "codex_chatgpt_with_api_fallback",
            metadata: { openAiApiKeyMaterial: { apiKey } },
        },
        {
            provider: "openai",
            authMode: "codex_chatgpt",
            metadata: { openAiApiKeyMaterial: { apiKey } },
        },
        {
            provider: "openai",
            authMode: "openai_api_key",
            metadata: {
                openAiApiKeyMaterial: { apiKey },
                codexAuthMaterial: { format: "codex_home_files_v1", files: [] },
            },
        },
    ];
    for (const auth of invalid)
        assert.throws(() => resolveAuthEnvironment(auth, { OPENAI_API_KEY: apiKey }));
});
test("ChatGPT credentials remain supported without an API fallback", () => {
    const auth = resolveAuthEnvironment({
        provider: "openai",
        authMode: "codex_chatgpt",
        metadata: {
            codexAuthMaterial: {
                format: "codex_home_files_v1",
                files: [
                    {
                        path: "auth.json",
                        dataBase64: Buffer.from(JSON.stringify({
                            tokens: { access_token: "fake-oauth-token" },
                        })).toString("base64"),
                    },
                ],
            },
        },
    }, { OPENAI_API_KEY: apiKey });
    assert.equal(auth.authMode, "codex_chatgpt");
    assert.equal(auth.apiKey, undefined);
    assert.equal(auth.apiFallback, false);
});
