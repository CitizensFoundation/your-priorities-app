import { z } from "zod";
import { ISODateTimeSchema, type ISODateTime } from "./core.js";

export const GroupLifecycleStatuses = ["active", "on_hold", "closed"] as const;
export type GroupLifecycleStatus = (typeof GroupLifecycleStatuses)[number];

export const GroupLifecycleConfigurationKey = "ypLiveWorkflowLifecycle" as const;

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

export const GroupLifecycleStatusSchema = z.enum(GroupLifecycleStatuses);

export const GroupLifecycleDetailsSchema = z
  .object({
    lifecycleStatus: GroupLifecycleStatusSchema,
    lifecycleReason: z.string().nullable(),
    lifecycleRevisitAt: ISODateTimeSchema.nullable(),
    lifecycleChangedAt: ISODateTimeSchema.nullable(),
    lifecycleChangedByUserId: z.number().int().positive().nullable(),
  })
  .strict() satisfies z.ZodType<GroupLifecycleDetails>;

export const UpdateGroupLifecycleInputSchema = z
  .object({
    status: GroupLifecycleStatusSchema,
    reason: z.string().max(2_000).nullable().optional(),
    revisitAt: ISODateTimeSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<UpdateGroupLifecycleInput>;

export function normalizeGroupLifecycleStatus(value: unknown): GroupLifecycleStatus {
  return typeof value === "string" && GroupLifecycleStatuses.includes(value as GroupLifecycleStatus)
    ? value as GroupLifecycleStatus
    : "active";
}
