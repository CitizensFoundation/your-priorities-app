import { z } from "zod";
import { type ISODateTime } from "./core.js";
export declare const GroupLifecycleStatuses: readonly ["active", "on_hold", "closed"];
export type GroupLifecycleStatus = (typeof GroupLifecycleStatuses)[number];
export declare const GroupLifecycleConfigurationKey: "ypLiveWorkflowLifecycle";
export interface GroupLifecycleDetails {
    lifecycleStatus: GroupLifecycleStatus;
    lifecycleReason: string | null;
    lifecycleRevisitAt: ISODateTime | null;
    lifecycleChangedAt: ISODateTime | null;
    lifecycleChangedByUserId: number | null;
}
export interface UpdateGroupLifecycleInput {
    status: GroupLifecycleStatus;
    reason?: string | null;
    revisitAt?: ISODateTime | null;
}
export declare const GroupLifecycleStatusSchema: z.ZodEnum<{
    active: "active";
    closed: "closed";
    on_hold: "on_hold";
}>;
export declare const GroupLifecycleDetailsSchema: z.ZodObject<{
    lifecycleStatus: z.ZodEnum<{
        active: "active";
        closed: "closed";
        on_hold: "on_hold";
    }>;
    lifecycleReason: z.ZodNullable<z.ZodString>;
    lifecycleRevisitAt: z.ZodNullable<z.ZodString>;
    lifecycleChangedAt: z.ZodNullable<z.ZodString>;
    lifecycleChangedByUserId: z.ZodNullable<z.ZodNumber>;
}, z.core.$strict>;
export declare const UpdateGroupLifecycleInputSchema: z.ZodObject<{
    status: z.ZodEnum<{
        active: "active";
        closed: "closed";
        on_hold: "on_hold";
    }>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    revisitAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare function normalizeGroupLifecycleStatus(value: unknown): GroupLifecycleStatus;
