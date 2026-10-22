import {
  CodexAuthMaterialSchema,
  type CodexAuthMaterial,
  type VmSessionStartPayload,
} from "../../contracts/index.js";
import { apiKeyMaterialSchema } from "../../apiKeyAuth.js";

export type ResolvedCodexAuth = {
  env: NodeJS.ProcessEnv;
  provider: string;
  authMode: string;
  secretRef: string | null;
  apiFallback: boolean;
  apiKey?: string;
  codexAuthMaterial?: CodexAuthMaterial;
  codexAuthMaterialFingerprintSha256?: string | null;
};

export function resolveAuthEnvironment(
  auth: VmSessionStartPayload["auth"],
  env: NodeJS.ProcessEnv,
): ResolvedCodexAuth {
  if (!auth) {
    throw new Error("Codex session auth is not configured");
  }

  if ((auth.provider && auth.provider !== "openai") || auth.secretRef) {
    throw new Error(
      "Codex requires explicit OpenAI credentials; environment fallback is disabled",
    );
  }
  if (auth.authMode === "openai_api_key" && !auth.metadata?.codexAuthMaterial) {
    const material = apiKeyMaterialSchema.safeParse(
      auth.metadata?.openAiApiKeyMaterial,
    );
    if (!material.success)
      throw new Error("Invalid OpenAI API key credentials");
    return {
      env: {},
      provider: "openai",
      authMode: "openai_api_key",
      secretRef: null,
      apiFallback: false,
      apiKey: material.data.apiKey,
    };
  }
  if (
    auth.authMode !== "codex_chatgpt" ||
    auth.metadata?.openAiApiKeyMaterial
  ) {
    throw new Error(
      "Codex authentication mode is not supported; automatic API fallback is disabled",
    );
  }
  const material = CodexAuthMaterialSchema.parse(
    auth.metadata?.codexAuthMaterial,
  );
  const authFile = material.files.find((file) => file.path === "auth.json");
  if (!authFile || material.files.some((file) => file.path !== "auth.json"))
    throw new Error("ChatGPT auth.json is required");
  const record = JSON.parse(
    Buffer.from(authFile.dataBase64, "base64").toString("utf8"),
  ) as Record<string, unknown>;
  if (
    record.OPENAI_API_KEY ||
    record.apiKey ||
    record.api_key ||
    ["apikey", "openaiapikey"].includes(
      String(record.auth_mode ?? record.type ?? "")
        .replace(/[-_\s]/g, "")
        .toLowerCase(),
    ) ||
    (!record.tokens && !record.access_token && !record.refresh_token)
  ) {
    throw new Error("Live Workflows accepts ChatGPT credentials only");
  }
  return {
    env: {},
    provider: "openai",
    authMode: "codex_chatgpt",
    secretRef: null,
    apiFallback: false,
    codexAuthMaterial: material,
    codexAuthMaterialFingerprintSha256: stringMetadataValue(
      auth.metadata?.codexAuthMaterialFingerprintSha256,
    ),
  };
}

function stringMetadataValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
