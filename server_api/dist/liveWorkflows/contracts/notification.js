import { z } from "zod";
import { ISODateTimeSchema, JsonSchema, ScopeRefSchema, UUIDSchema, } from "./core.js";
export const EmailNotificationKinds = ["human_case.created"];
export const EmailNotificationStatuses = ["pending", "sending", "sent", "failed", "skipped"];
export const EmailNotificationKindSchema = z.enum(EmailNotificationKinds);
export const EmailNotificationStatusSchema = z.enum(EmailNotificationStatuses);
export const EmailNotificationSchema = z
    .object({
    id: UUIDSchema,
    kind: z.string().min(1),
    status: z.string().min(1),
    idempotencyKey: z.string().min(1),
    recipientUserId: z.number().int().positive().nullable().optional(),
    recipientEmail: z.string().email(),
    recipientName: z.string().nullable().optional(),
    domainId: z.number().int().positive().nullable().optional(),
    communityId: z.number().int().positive().nullable().optional(),
    groupId: z.number().int().positive().nullable().optional(),
    scope: ScopeRefSchema,
    subject: z.string().min(1),
    renderedHtml: z.string(),
    renderedText: z.string(),
    payload: z.record(z.string(), JsonSchema),
    attemptCount: z.number().int().nonnegative(),
    lastError: z.string().nullable().optional(),
    queuedAt: ISODateTimeSchema,
    sentAt: ISODateTimeSchema.nullable().optional(),
    failedAt: ISODateTimeSchema.nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
