import { z } from "zod";
import {
  ISODateTimeSchema,
  JsonSchema,
  ScopeRefSchema,
  UUIDSchema,
  type ISODateTime,
  type Json,
  type ScopeRef,
  type UUID,
} from "./core.js";

export const CapabilityKinds = ["software"] as const;
export type CapabilityKind = (typeof CapabilityKinds)[number];

export const CapabilityStatuses = ["active", "disabled"] as const;
export type CapabilityStatus = (typeof CapabilityStatuses)[number];

export const CapabilityVersionStatuses = ["available", "disabled"] as const;
export type CapabilityVersionStatus = (typeof CapabilityVersionStatuses)[number];

export const CapabilityInstallModes = ["runtime_image", "container_wrapper", "manual_fallback"] as const;
export type CapabilityInstallMode = (typeof CapabilityInstallModes)[number];

export type Capability = {
  id: UUID;
  scope: ScopeRef;
  key: string;
  name: string;
  description?: string | null;
  kind: CapabilityKind | string;
  status: CapabilityStatus | string;
  tags: string[];
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type CapabilityVersion = {
  id: UUID;
  capabilityId: UUID;
  versionLabel: string;
  status: CapabilityVersionStatus | string;
  installMode: CapabilityInstallMode | string;
  runtimeProfileId?: UUID | null;
  containerImage?: string | null;
  executableName?: string | null;
  verifyCommand?: string | null;
  metadata: Record<string, Json>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type CapabilitySearchResult = {
  capability: Capability;
  version: CapabilityVersion | null;
  matchScore: number;
  matchReason: string;
};

export type CapabilityAvailabilityVersion = {
  capabilityVersionId: UUID;
  versionLabel: string;
  status: string;
  installMode: string;
  runtimeProfileId?: UUID | null;
  containerImage?: string | null;
  executableName?: string | null;
  verifyCommand?: string | null;
  metadata: Record<string, Json>;
};

export type CapabilityAvailabilityEntry = {
  capabilityId: UUID;
  scope: ScopeRef;
  key: string;
  name: string;
  description?: string | null;
  kind: string;
  status: string;
  tags: string[];
  metadata: Record<string, Json>;
  versions: CapabilityAvailabilityVersion[];
};

export type CapabilityAvailabilityReport = {
  schema: "yp-live-workflow.capability_availability.v1";
  generatedAt: ISODateTime;
  experimentId: UUID;
  groupPlanPartId: string | null;
  runtimeProfileId?: UUID | null;
  capabilityCount: number;
  availableVersionCount: number;
  capabilities: CapabilityAvailabilityEntry[];
};

export type CapabilityInstallPlan = {
  capability: Capability;
  version: CapabilityVersion;
  installMode: CapabilityInstallMode | string;
  status: "available" | "disabled";
  instructions: string[];
  warnings: string[];
};

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
  .strict() satisfies z.ZodType<Capability>;

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
  .strict() satisfies z.ZodType<CapabilityVersion>;

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
  .strict() satisfies z.ZodType<CapabilityAvailabilityVersion>;

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
  .strict() satisfies z.ZodType<CapabilityAvailabilityEntry>;

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
  .strict() satisfies z.ZodType<CapabilityAvailabilityReport>;

export const CapabilityInstallPlanSchema = z
  .object({
    capability: CapabilitySchema,
    version: CapabilityVersionSchema,
    installMode: z.string().min(1),
    status: z.enum(["available", "disabled"]),
    instructions: z.array(z.string()),
    warnings: z.array(z.string()),
  })
  .strict() satisfies z.ZodType<CapabilityInstallPlan>;
