export type ReportBundleArtifactPlacement = "step" | "supporting";

type ArtifactRoleDescriptorDefinition = {
  role: string;
  label: string;
  displayRank: number | null;
  featuredByDefault: boolean;
  previewHint: string | null;
  reportBundlePlacement: ReportBundleArtifactPlacement | null;
  outputFile: string | null;
};

export const ArtifactRoleDescriptors = [
  {
    role: "paper_draft",
    label: "Preprint draft",
    displayRank: 0,
    featuredByDefault: true,
    previewHint: "Markdown preprint draft from the Chief report bundle.",
    reportBundlePlacement: "step",
    outputFile: "PRE_PRINT_PAPER_DRAFT.md",
  },
  {
    role: "paper_distill",
    label: "Technical distill",
    displayRank: 1,
    featuredByDefault: true,
    previewHint: "HTML technical distill from the report bundle.",
    reportBundlePlacement: "step",
    outputFile: "PRE_PRINT_DISTILL.PUB.html",
  },
  {
    role: "paper_lay_summary",
    label: "Lay summary",
    displayRank: 2,
    featuredByDefault: true,
    previewHint: "HTML lay summary from the report bundle.",
    reportBundlePlacement: "step",
    outputFile: "PRE_PRINT_DISTILL.PUB.LAYMANS.html",
  },
  {
    role: "paper_cluster_index",
    label: "Experimental clusters",
    displayRank: 3,
    featuredByDefault: true,
    previewHint: "Markdown cluster map from the report bundle.",
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "paper_status_overview",
    label: "Status overview",
    displayRank: 4,
    featuredByDefault: true,
    previewHint: "Markdown high-level synthesis from the report bundle.",
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "paper_cluster_full_report",
    label: "Cluster report",
    displayRank: 5,
    featuredByDefault: true,
    previewHint: "Markdown cluster evidence report from the report bundle.",
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "paper_cluster_novelty_report",
    label: "Novelty report",
    displayRank: 6,
    featuredByDefault: true,
    previewHint: "Markdown novelty verification report from the report bundle.",
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "group_codex_review_markdown",
    label: "Group Researcher review",
    displayRank: 7,
    featuredByDefault: true,
    previewHint: "Readable group-level Researcher review with findings, evidence, disposition, and preprint guidance.",
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "group_codex_review_json",
    label: "Group Researcher review JSON",
    displayRank: 8,
    featuredByDefault: true,
    previewHint: "Structured group-level Researcher review record with findings, evidence, and selected figures.",
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "group_ai_council_proceedings_markdown",
    label: "AI Council proceedings",
    displayRank: 9,
    featuredByDefault: false,
    previewHint: "Readable prompts, drafts, rankings, synthesis and ratification from the AI Council.",
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "group_ai_council_proceedings_json",
    label: "AI Council audit JSON",
    displayRank: 10,
    featuredByDefault: false,
    previewHint: "Self-contained structured AI Council audit record with the shared review package.",
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "figure_asset",
    label: "Figure",
    displayRank: 11,
    featuredByDefault: false,
    previewHint: null,
    reportBundlePlacement: "supporting",
    outputFile: null,
  },
  {
    role: "full_plan",
    label: "Group plan overview",
    displayRank: null,
    featuredByDefault: false,
    previewHint: null,
    reportBundlePlacement: null,
    outputFile: null,
  },
  {
    role: "experiment_research_plan",
    label: "Research plan",
    displayRank: null,
    featuredByDefault: false,
    previewHint: null,
    reportBundlePlacement: null,
    outputFile: null,
  },
  {
    role: "validation_manifest",
    label: "Validation manifest",
    displayRank: null,
    featuredByDefault: false,
    previewHint: null,
    reportBundlePlacement: null,
    outputFile: null,
  },
  {
    role: "data_table",
    label: "Data table",
    displayRank: null,
    featuredByDefault: false,
    previewHint: null,
    reportBundlePlacement: null,
    outputFile: null,
  },
  {
    role: "input_attachment",
    label: "Input attachment",
    displayRank: null,
    featuredByDefault: false,
    previewHint: null,
    reportBundlePlacement: null,
    outputFile: null,
  },
] as const satisfies readonly ArtifactRoleDescriptorDefinition[];

export type ArtifactRoleDescriptor = (typeof ArtifactRoleDescriptors)[number];
export type KnownArtifactRole = ArtifactRoleDescriptor["role"];
export type ReportBundleStepArtifactRoleDescriptor = Extract<
  ArtifactRoleDescriptor,
  { reportBundlePlacement: "step" }
>;
export type ReportBundleSupportingArtifactRoleDescriptor = Extract<
  ArtifactRoleDescriptor,
  { reportBundlePlacement: "supporting" }
>;
export type ReportBundleStepArtifactRole = ReportBundleStepArtifactRoleDescriptor["role"];
export type ReportBundleSupportingArtifactRole = ReportBundleSupportingArtifactRoleDescriptor["role"];

const ArtifactRoleDescriptorByRole = new Map<string, ArtifactRoleDescriptor>(
  ArtifactRoleDescriptors.map((descriptor) => [descriptor.role, descriptor])
);

export const ReportBundleStepArtifactRoleDescriptors: readonly ReportBundleStepArtifactRoleDescriptor[] =
  ArtifactRoleDescriptors.filter(
    (descriptor): descriptor is ReportBundleStepArtifactRoleDescriptor =>
      descriptor.reportBundlePlacement === "step"
  );

export function getArtifactRoleDescriptor(value: unknown): ArtifactRoleDescriptor | null {
  if (typeof value !== "string") return null;
  return ArtifactRoleDescriptorByRole.get(value.trim()) ?? null;
}

export function reportBundleStepArtifactRole(value: unknown): ReportBundleStepArtifactRole | null {
  const descriptor = getArtifactRoleDescriptor(value);
  return descriptor?.reportBundlePlacement === "step" ? descriptor.role : null;
}

export function reportBundleSupportingArtifactRole(value: unknown): ReportBundleSupportingArtifactRole | null {
  const descriptor = getArtifactRoleDescriptor(value);
  return descriptor?.reportBundlePlacement === "supporting" ? descriptor.role : null;
}
