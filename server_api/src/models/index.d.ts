import type {
  Sequelize as SequelizeBaseType,
  Model,
  ModelStatic,
} from "sequelize";

// Yp...Data types (e.g., YpAudioData, YpDomainData) are assumed to be globally available
// due to their declaration in files like 'webApps/client/src/types.d.ts',
// which should be included in the tsconfig's "types" or "include" arrays.

declare module "models/index.cjs" { // Module path relative to baseUrl ("server_api/src/")

  // --- Reusable Generic Type for Model Instances (local to this module declaration) ---
  type ModelInstance<TAttributes> = Model<TAttributes, Partial<TAttributes>> & TAttributes;

  // --- Specific Model Instance Types (local to this module declaration) ---
  // These rely on the globally available Yp...Data interfaces.
  type AudioInstance = ModelInstance<YpAudioData>;
  type BulkStatusUpdateInstance = ModelInstance<YpBulkStatusUpdateData>;
  type CategoryInstance = ModelInstance<YpCategoryData>;
  type CommunityInstance = ModelInstance<YpCommunityData>;
  type DomainInstance = ModelInstance<YpDomainData>;
  type EndorsementInstance = ModelInstance<YpEndorsement>;
  type GroupInstance = ModelInstance<YpGroupData>;
  type ImageInstance = ModelInstance<YpImageData>;
  type PageInstance = ModelInstance<YpHelpPageData>; // Assuming YpHelpPageData for page.cjs
  type PointInstance = ModelInstance<YpPointData>;
  type PointQualityInstance = ModelInstance<YpPointQuality>;
  type PointRevisionInstance = ModelInstance<YpPointRevision>;
  type PostInstance = ModelInstance<YpPostData>;
  type PostStatusChangeInstance = ModelInstance<YpPostStatusChange>;
  type OrganizationInstance = ModelInstance<YpOrganizationData>;
  type RatingInstance = ModelInstance<YpRatingData>;
  type UserInstance = ModelInstance<YpUserData>;
  type VideoInstance = ModelInstance<YpVideoData>;
  type AcActivityInstance = ModelInstance<AcActivityData>;
  type AcBackgroundJobInstance = ModelInstance<AcBackgroundJobData>;
  type AcClientActivityInstance = ModelInstance<AcClientActivityData>;
  type AcDelayedNotificationInstance = ModelInstance<AcDelayedNotificationData>;
  type AcFollowingInstance = ModelInstance<AcFollowingData>;
  type AcMuteInstance = ModelInstance<AcMuteData>;
  type AcNotificationInstance = ModelInstance<AcNotificationData>;
  type AcTranslationCacheInstance = ModelInstance<AcTranslationCacheData>;
  // Add other specific instance types if new models are included

  // --- Interface for the Exported DB Object (local to this module declaration) ---
  interface DeclaredYpModels {
    sequelize: SequelizeBaseType;
    Sequelize: typeof SequelizeBaseType;

    Audio: ModelStatic<AudioInstance>;
    BulkStatusUpdate: ModelStatic<BulkStatusUpdateInstance>;
    Category: ModelStatic<CategoryInstance>;
    Community: ModelStatic<CommunityInstance>;
    Domain: ModelStatic<DomainInstance>;
    Endorsement: ModelStatic<EndorsementInstance>;
    Group: ModelStatic<GroupInstance>;
    Image: ModelStatic<ImageInstance>;
    Page: ModelStatic<PageInstance>;
    Point: ModelStatic<PointInstance>;
    PointQuality: ModelStatic<PointQualityInstance>;
    PointRevision: ModelStatic<PointRevisionInstance>;
    Post: ModelStatic<PostInstance>;
    PostStatusChange: ModelStatic<PostStatusChangeInstance>;
    Organization: ModelStatic<OrganizationInstance>;
    Rating: ModelStatic<RatingInstance>;
    User: ModelStatic<UserInstance>;
    Video: ModelStatic<VideoInstance>;
    AcActivity: ModelStatic<AcActivityInstance>;
    AcBackgroundJob: ModelStatic<AcBackgroundJobInstance>;
    AcCampaign: ModelStatic<AcCampaignInstance>;
    AcClientActivity: ModelStatic<AcClientActivityInstance>;
    AcDelayedNotification: ModelStatic<AcDelayedNotificationInstance>;
    AcFollowing: ModelStatic<AcFollowingInstance>;
    AcMute: ModelStatic<AcMuteInstance>;
    AcNotification: ModelStatic<AcNotificationInstance>;
    AcTranslationCache: ModelStatic<AcTranslationCacheInstance>;

    // Add other ModelStatic types as new models are included
  }

  const models: DeclaredYpModels;
  export default models; // This makes `DeclaredYpModels` the type of the default import.
}