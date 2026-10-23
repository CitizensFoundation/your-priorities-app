import { type CodexAuthMaterial, type VmSessionStartPayload } from "../../contracts/index.js";
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
export declare function resolveAuthEnvironment(auth: VmSessionStartPayload["auth"], env: NodeJS.ProcessEnv): ResolvedCodexAuth;
