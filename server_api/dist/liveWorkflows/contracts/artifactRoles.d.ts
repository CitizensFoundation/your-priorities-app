export type ReportBundleArtifactPlacement = "step" | "supporting";
export declare const ArtifactRoleDescriptors: readonly [{
    readonly role: "paper_draft";
    readonly label: "Preprint draft";
    readonly displayRank: 0;
    readonly featuredByDefault: true;
    readonly previewHint: "Markdown preprint draft from the Chief report bundle.";
    readonly reportBundlePlacement: "step";
    readonly outputFile: "PRE_PRINT_PAPER_DRAFT.md";
}, {
    readonly role: "paper_distill";
    readonly label: "Technical distill";
    readonly displayRank: 1;
    readonly featuredByDefault: true;
    readonly previewHint: "HTML technical distill from the report bundle.";
    readonly reportBundlePlacement: "step";
    readonly outputFile: "PRE_PRINT_DISTILL.PUB.html";
}, {
    readonly role: "paper_lay_summary";
    readonly label: "Lay summary";
    readonly displayRank: 2;
    readonly featuredByDefault: true;
    readonly previewHint: "HTML lay summary from the report bundle.";
    readonly reportBundlePlacement: "step";
    readonly outputFile: "PRE_PRINT_DISTILL.PUB.LAYMANS.html";
}, {
    readonly role: "paper_cluster_index";
    readonly label: "Experimental clusters";
    readonly displayRank: 3;
    readonly featuredByDefault: true;
    readonly previewHint: "Markdown cluster map from the report bundle.";
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "paper_status_overview";
    readonly label: "Status overview";
    readonly displayRank: 4;
    readonly featuredByDefault: true;
    readonly previewHint: "Markdown high-level synthesis from the report bundle.";
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "paper_cluster_full_report";
    readonly label: "Cluster report";
    readonly displayRank: 5;
    readonly featuredByDefault: true;
    readonly previewHint: "Markdown cluster evidence report from the report bundle.";
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "paper_cluster_novelty_report";
    readonly label: "Novelty report";
    readonly displayRank: 6;
    readonly featuredByDefault: true;
    readonly previewHint: "Markdown novelty verification report from the report bundle.";
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "group_codex_review_markdown";
    readonly label: "Group Researcher review";
    readonly displayRank: 7;
    readonly featuredByDefault: true;
    readonly previewHint: "Readable group-level Researcher review with findings, evidence, disposition, and preprint guidance.";
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "group_codex_review_json";
    readonly label: "Group Researcher review JSON";
    readonly displayRank: 8;
    readonly featuredByDefault: true;
    readonly previewHint: "Structured group-level Researcher review record with findings, evidence, and selected figures.";
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "group_ai_council_proceedings_markdown";
    readonly label: "AI Council proceedings";
    readonly displayRank: 9;
    readonly featuredByDefault: false;
    readonly previewHint: "Readable prompts, drafts, rankings, synthesis and ratification from the AI Council.";
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "group_ai_council_proceedings_json";
    readonly label: "AI Council audit JSON";
    readonly displayRank: 10;
    readonly featuredByDefault: false;
    readonly previewHint: "Self-contained structured AI Council audit record with the shared review package.";
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "figure_asset";
    readonly label: "Figure";
    readonly displayRank: 11;
    readonly featuredByDefault: false;
    readonly previewHint: null;
    readonly reportBundlePlacement: "supporting";
    readonly outputFile: null;
}, {
    readonly role: "full_plan";
    readonly label: "Group plan overview";
    readonly displayRank: null;
    readonly featuredByDefault: false;
    readonly previewHint: null;
    readonly reportBundlePlacement: null;
    readonly outputFile: null;
}, {
    readonly role: "experiment_research_plan";
    readonly label: "Research plan";
    readonly displayRank: null;
    readonly featuredByDefault: false;
    readonly previewHint: null;
    readonly reportBundlePlacement: null;
    readonly outputFile: null;
}, {
    readonly role: "validation_manifest";
    readonly label: "Validation manifest";
    readonly displayRank: null;
    readonly featuredByDefault: false;
    readonly previewHint: null;
    readonly reportBundlePlacement: null;
    readonly outputFile: null;
}, {
    readonly role: "data_table";
    readonly label: "Data table";
    readonly displayRank: null;
    readonly featuredByDefault: false;
    readonly previewHint: null;
    readonly reportBundlePlacement: null;
    readonly outputFile: null;
}, {
    readonly role: "input_attachment";
    readonly label: "Input attachment";
    readonly displayRank: null;
    readonly featuredByDefault: false;
    readonly previewHint: null;
    readonly reportBundlePlacement: null;
    readonly outputFile: null;
}];
export type ArtifactRoleDescriptor = (typeof ArtifactRoleDescriptors)[number];
export type KnownArtifactRole = ArtifactRoleDescriptor["role"];
export type ReportBundleStepArtifactRoleDescriptor = Extract<ArtifactRoleDescriptor, {
    reportBundlePlacement: "step";
}>;
export type ReportBundleSupportingArtifactRoleDescriptor = Extract<ArtifactRoleDescriptor, {
    reportBundlePlacement: "supporting";
}>;
export type ReportBundleStepArtifactRole = ReportBundleStepArtifactRoleDescriptor["role"];
export type ReportBundleSupportingArtifactRole = ReportBundleSupportingArtifactRoleDescriptor["role"];
export declare const ReportBundleStepArtifactRoleDescriptors: readonly ReportBundleStepArtifactRoleDescriptor[];
export declare function getArtifactRoleDescriptor(value: unknown): ArtifactRoleDescriptor | null;
export declare function reportBundleStepArtifactRole(value: unknown): ReportBundleStepArtifactRole | null;
export declare function reportBundleSupportingArtifactRole(value: unknown): ReportBundleSupportingArtifactRole | null;
