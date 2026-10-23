import { z } from "zod";
import { ISODateTimeSchema, JsonSchema, ScopeRefSchema, UUIDSchema, } from "./core.js";
export const CapabilityKinds = ["software"];
export const CapabilityStatuses = ["active", "disabled"];
export const CapabilityVersionStatuses = ["available", "disabled"];
export const CapabilityInstallModes = ["runtime_image", "container_wrapper", "manual_fallback"];
export const CapabilitySchema = z
    .object({
    id: UUIDSchema,
    scope: ScopeRefSchema,
    key: z.string().min(1),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    kind: z.string().min(1),
    status: z.string().min(1),
    tags: z.array(z.string()),
    metadata: z.record(z.string(), JsonSchema),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const CapabilityVersionSchema = z
    .object({
    id: UUIDSchema,
    capabilityId: UUIDSchema,
    versionLabel: z.string().min(1),
    status: z.string().min(1),
    installMode: z.string().min(1),
    runtimeProfileId: UUIDSchema.nullable().optional(),
    containerImage: z.string().nullable().optional(),
    executableName: z.string().nullable().optional(),
    verifyCommand: z.string().nullable().optional(),
    metadata: z.record(z.string(), JsonSchema),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
})
    .strict();
export const CapabilityAvailabilityVersionSchema = z
    .object({
    capabilityVersionId: UUIDSchema,
    versionLabel: z.string().min(1),
    status: z.string().min(1),
    installMode: z.string().min(1),
    runtimeProfileId: UUIDSchema.nullable().optional(),
    containerImage: z.string().nullable().optional(),
    executableName: z.string().nullable().optional(),
    verifyCommand: z.string().nullable().optional(),
    metadata: z.record(z.string(), JsonSchema),
})
    .strict();
export const CapabilityAvailabilityEntrySchema = z
    .object({
    capabilityId: UUIDSchema,
    scope: ScopeRefSchema,
    key: z.string().min(1),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    kind: z.string().min(1),
    status: z.string().min(1),
    tags: z.array(z.string()),
    metadata: z.record(z.string(), JsonSchema),
    versions: z.array(CapabilityAvailabilityVersionSchema),
})
    .strict();
export const CapabilityAvailabilityReportSchema = z
    .object({
    schema: z.literal("yp-live-workflow.capability_availability.v1"),
    generatedAt: ISODateTimeSchema,
    experimentId: UUIDSchema,
    groupPlanPartId: z.string().nullable(),
    runtimeProfileId: UUIDSchema.nullable().optional(),
    capabilityCount: z.number().int().nonnegative(),
    availableVersionCount: z.number().int().nonnegative(),
    capabilities: z.array(CapabilityAvailabilityEntrySchema),
})
    .strict();
export const CapabilityInstallPlanSchema = z
    .object({
    capability: CapabilitySchema,
    version: CapabilityVersionSchema,
    installMode: z.string().min(1),
    status: z.enum(["available", "disabled"]),
    instructions: z.array(z.string()),
    warnings: z.array(z.string()),
})
    .strict();
