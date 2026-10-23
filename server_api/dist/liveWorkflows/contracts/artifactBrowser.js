import { z } from "zod";
export const ArtifactBrowserTypes = [
    "reports",
    "tables",
    "images",
    "code",
    "logs",
    "archives",
    "data",
    "other",
];
export const ArtifactBrowserTypeSchema = z.enum(ArtifactBrowserTypes);
export const ArtifactBrowserItemSchema = z.object({
    id: z.string().min(1),
    section: z.enum(["research", "seed"]),
    kind: z.string().min(1),
    browserType: ArtifactBrowserTypeSchema,
    filename: z.string().min(1),
    relativePath: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    artifactRole: z.string().min(1).optional(),
    contentType: z.string().min(1).optional(),
    sizeBytes: z.number().nonnegative().optional(),
    createdAt: z.string().min(1).optional(),
    featured: z.boolean(),
    scopeType: z.string().min(1).optional(),
    scopeId: z.string().min(1).optional(),
    runId: z.string().min(1).optional(),
    runStartedAt: z.string().min(1).optional(),
    isCurrentRun: z.boolean().optional(),
    referencedRunIds: z.array(z.string().min(1)).optional(),
    superseded: z.boolean().optional(),
    supersededAt: z.string().min(1).optional(),
    supersededByArtifactId: z.string().min(1).optional(),
}).strict();
const nonnegativeCount = z.number().int().nonnegative();
export const ArtifactBrowserSummarySchema = z.object({
    totalCount: nonnegativeCount,
    filteredCount: nonnegativeCount,
    seedCount: nonnegativeCount,
    filteredSeedCount: nonnegativeCount,
    researchCount: nonnegativeCount,
    filteredResearchCount: nonnegativeCount,
    typeCounts: z.partialRecord(ArtifactBrowserTypeSchema, nonnegativeCount),
    roleCounts: z.record(z.string(), nonnegativeCount),
}).strict();
export const ArtifactBrowserPageSchema = z.object({
    seedItems: z.array(ArtifactBrowserItemSchema).optional(),
    featuredItems: z.array(ArtifactBrowserItemSchema).optional(),
    items: z.array(ArtifactBrowserItemSchema),
    nextCursor: z.string().nullable(),
    summary: ArtifactBrowserSummarySchema.optional(),
}).strict();
export function artifactBrowserTypeForKind(kindInput) {
    const kind = kindInput.trim().toLowerCase().replace(/[\s-]+/gu, "_");
    if (kind === "report" ||
        kind === "full_plan" ||
        kind === "experiment_research_plan" ||
        kind === "document" ||
        kind === "html" ||
        kind === "markdown" ||
        kind === "pdf" ||
        kind.includes("paper") ||
        kind.includes("report") ||
        kind.includes("review") ||
        kind.endsWith("_pdf") ||
        kind.endsWith("_markdown") ||
        kind.includes("summary") ||
        kind.includes("distill") ||
        kind.includes("proceedings")) {
        return "reports";
    }
    if (kind === "table" || kind.endsWith("_table") || kind.startsWith("table_"))
        return "tables";
    if (kind === "image" ||
        kind === "figure_asset" ||
        kind === "infographic" ||
        kind.endsWith("_image") ||
        kind.endsWith("_figure") ||
        kind.startsWith("image_") ||
        kind.startsWith("infographic_"))
        return "images";
    if (kind === "source_code" || kind === "notebook" || kind === "code" || kind.endsWith("_code")) {
        return "code";
    }
    if (kind === "log" || kind.endsWith("_log"))
        return "logs";
    if (kind === "archive" || kind.endsWith("_archive"))
        return "archives";
    if (kind === "data" ||
        kind === "dataset" ||
        kind === "json" ||
        kind === "binary" ||
        kind === "result" ||
        kind.endsWith("_data") ||
        kind.endsWith("_dataset") ||
        kind.endsWith("_json") ||
        kind.endsWith("_manifest") ||
        kind.endsWith("_output") ||
        kind.startsWith("dataset_"))
        return "data";
    return "other";
}
