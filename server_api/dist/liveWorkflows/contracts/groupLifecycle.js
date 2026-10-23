import { z } from "zod";
import { ISODateTimeSchema } from "./core.js";
export const GroupLifecycleStatuses = ["active", "on_hold", "closed"];
export const GroupLifecycleConfigurationKey = "ypLiveWorkflowLifecycle";
export const GroupLifecycleStatusSchema = z.enum(GroupLifecycleStatuses);
export const GroupLifecycleDetailsSchema = z
    .object({
    lifecycleStatus: GroupLifecycleStatusSchema,
    lifecycleReason: z.string().nullable(),
    lifecycleRevisitAt: ISODateTimeSchema.nullable(),
    lifecycleChangedAt: ISODateTimeSchema.nullable(),
    lifecycleChangedByUserId: z.number().int().positive().nullable(),
})
    .strict();
export const UpdateGroupLifecycleInputSchema = z
    .object({
    status: GroupLifecycleStatusSchema,
    reason: z.string().max(2000).nullable().optional(),
    revisitAt: ISODateTimeSchema.nullable().optional(),
})
    .strict();
export function normalizeGroupLifecycleStatus(value) {
    return typeof value === "string" && GroupLifecycleStatuses.includes(value)
        ? value
        : "active";
}
