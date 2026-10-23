export interface ReadinessCheck {
    name: string;
    ok: boolean;
    detail: string;
}
export type DockerRead = (args: string[]) => Promise<string>;
export declare function inspectRuntimeContract(info: unknown, codex: unknown, processing: unknown, versions: Record<string, unknown>): ReadinessCheck[];
export declare function readiness(mode: "api" | "vm", env?: NodeJS.ProcessEnv, docker?: DockerRead): Promise<ReadinessCheck[]>;
