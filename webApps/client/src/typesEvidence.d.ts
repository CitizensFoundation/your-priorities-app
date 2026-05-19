type YpEvidenceSubjectType = "post" | "point" | "group";

type YpEvidenceBundleStatus =
  | "queued"
  | "researching"
  | "needs_review"
  | "published"
  | "archived"
  | "failed"
  | "stale";

interface YpEvidenceConnectedDebateData {
  subjectType: YpEvidenceSubjectType;
  subjectId: number;
  title?: string;
  url?: string;
  summary?: string;
}

interface YpEvidenceSourceData {
  id: number;
  canonical_url: string;
  source_type: string;
  publisher?: string;
  title?: string;
  license?: string;
  trust_tier: string;
  language?: string;
  freshness_policy: string;
  last_checked_at?: Date | string;
  last_modified_on_server?: string;
  content_hash?: string;
  image_url?: string;
  metadata?: Record<string, unknown>;
  CurrentSnapshot?: YpEvidenceSnapshotData;
}

interface YpEvidenceSnapshotData {
  id: number;
  source_id: number;
  snapshot_hash: string;
  fetched_at: Date | string;
  fetch_method: string;
  status: string;
  error_message?: string;
  markdown?: string;
  extracted_text?: string;
  metadata?: Record<string, unknown>;
  Source?: YpEvidenceSourceData;
}

interface YpEvidenceBundleSourceData {
  id: number;
  bundle_id: number;
  source_id: number;
  snapshot_id: number;
  relevance_score: number;
  citation_label: string;
  quoted_ranges?: Array<{ text?: string; start?: number; end?: number }>;
  source_role: string;
  Source?: YpEvidenceSourceData;
  Snapshot?: YpEvidenceSnapshotData;
}

interface YpEvidenceClaimData {
  id: number;
  bundle_id: number;
  claim_text: string;
  stance: string;
  confidence: number;
  source_refs?: Array<{
    citation_label?: string;
    source_id?: number;
    snapshot_id?: number;
  }>;
}

interface YpEvidenceSourceHighlightData {
  citation_label: string;
  title?: string;
  publisher?: string;
  url?: string;
  why_it_matters?: string;
  fetched_at?: string;
}

interface YpEvidenceBundleData {
  id: number;
  uuid: string;
  subject_type: YpEvidenceSubjectType;
  subject_id: number;
  group_id?: number;
  post_id?: number;
  point_id?: number;
  question_or_claim: string;
  short_analysis?: string;
  key_findings: string[];
  uncertainties: string[];
  missing_data: string[];
  source_highlights: YpEvidenceSourceHighlightData[];
  connected_debate: YpEvidenceConnectedDebateData[];
  status: YpEvidenceBundleStatus;
  language?: string;
  published_at?: Date | string;
  expires_at?: Date | string;
  metadata?: Record<string, unknown>;
  BundleSources?: YpEvidenceBundleSourceData[];
  Claims?: YpEvidenceClaimData[];
  ResearchRuns?: YpEvidenceResearchRunData[];
}

interface YpEvidencePortalThemeData {
  title: string;
  summary: string;
  imageUrl?: string;
  bundleIds?: number[];
  sourceIds?: number[];
  connectedDebate?: YpEvidenceConnectedDebateData[];
}

interface YpEvidencePortalAnalysisData {
  id?: number;
  group_id: number;
  title?: string;
  short_analysis?: string;
  theme_summaries: YpEvidencePortalThemeData[];
  source_refs?: Array<Record<string, unknown>>;
  bundle_refs?: Array<Record<string, unknown>>;
  connected_debate: YpEvidenceConnectedDebateData[];
  status?: string;
  language?: string;
  model_metadata?: Record<string, unknown>;
}

interface YpEvidenceResearchStartResponse {
  bundle: YpEvidenceBundleData;
  run?: YpEvidenceResearchRunData;
  queued: boolean;
}

type YpEvidenceResearchRunStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

interface YpEvidenceResearchQueryData {
  id: number;
  run_id: number;
  query: string;
  evidence_type: string;
  generation: number;
  priority: number;
  status: string;
  result_count: number;
  metadata?: Record<string, unknown>;
}

interface YpEvidenceResearchCandidateData {
  id: number;
  run_id: number;
  source_id?: number;
  snapshot_id?: number;
  url: string;
  url_hash: string;
  title?: string;
  query?: string;
  evidence_type: string;
  stage: string;
  summary?: string;
  extracted_claims: string[];
  score_relevance: number;
  score_quality: number;
  score_confidence: number;
  score_freshness: number;
  score_diversity: number;
  composite_score: number;
  elo_rating: number;
  pairwise_wins: number;
  pairwise_losses: number;
  selected: boolean;
  generation: number;
  parent_candidate_ids: number[];
  mutation_kind?: string;
  metadata?: Record<string, unknown>;
  Source?: YpEvidenceSourceData;
  Snapshot?: YpEvidenceSnapshotData;
}

interface YpEvidenceResearchRunData {
  id: number;
  bundle_id: number;
  group_id?: number;
  status: YpEvidenceResearchRunStatus;
  phase: string;
  config?: Record<string, unknown>;
  metrics?: {
    queryCount?: number;
    candidateCount?: number;
    selectedCount?: number;
    comparisonCount?: number;
    generationCount?: number;
  } & Record<string, unknown>;
  started_at?: Date | string;
  finished_at?: Date | string;
  requested_by_user_id?: number;
  metadata?: Record<string, unknown>;
  Queries?: YpEvidenceResearchQueryData[];
  Candidates?: YpEvidenceResearchCandidateData[];
}
