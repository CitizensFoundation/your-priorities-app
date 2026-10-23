import { z } from "zod";
export declare class SecretBox {
    private readonly key;
    constructor(encodedKey: string);
    seal(value: unknown, context: string): string;
    open<T>(value: string, context: string): T;
}
export declare function sameSecret(left: string, right: string): boolean;
export declare const hostSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    token: z.ZodString;
    rootPath: z.ZodString;
    image: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type WorkflowHost = z.infer<typeof hostSchema>;
export declare class HostDirectory {
    readonly hosts: WorkflowHost[];
    constructor(json?: string);
    get(id: string): {
        id: string;
        name: string;
        token: string;
        rootPath: string;
        image: string;
    };
    authenticate(header?: string): WorkflowHost | undefined;
}
