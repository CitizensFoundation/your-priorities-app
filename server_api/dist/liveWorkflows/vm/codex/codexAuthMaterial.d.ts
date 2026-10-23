import { type CodexAuthMaterial } from "../../contracts/index.js";
export declare function materializeCodexAuthMaterial(input: unknown, codexHomePath: string): Promise<CodexAuthMaterial>;
export declare function archiveCodexAuthMaterial(codexHomePath: string): Promise<CodexAuthMaterial>;
export declare function codexAuthMaterialFingerprintSha256(material: CodexAuthMaterial): string;
