declare module 'lit-flexbox-literals';

interface YpCollectionConfiguration {
  themeOverrideColorPrimary?: string;
  themeOverrideColorAccent?: string;
  themeOverrideBackgroundColor?: string;
  disableNameAutoTranslation?: boolean;
  useVideoCover?: boolean;
  welcomeHTML?: string;
  sortBySortOrder?: boolean;
  optionalSortOrder?: number;
  locationHidden?: boolean;
  welcomePageId?: number;
  customBackName?: string;
  customBackURL?: string;
  hideAllTabs?: boolean;
}

interface YpStructuredQuestion {
  uniqueId: number;
  text: string;
}

interface YpStructuredAnswer {
  uniqueId: number;
  value: string;
}

interface YpGroupConfiguration extends YpCollectionConfiguration {
  allowAnonymousUsers?: boolean;
  allowAnonymousAutoLogin?: boolean;
  hideGroupHeader?: boolean;
  hideAllTabs?: boolean;
  hideHelpIcon?: boolean;
  forceSecureSamlEmployeeLogin?: boolean;
  hideNewPost?: boolean;
  canAddNewPosts?: boolean;
  disableFacebookLoginForGroup?: boolean;
  externalGoalTriggerUrl?: string;
  forceSecureSamlLogin?: boolean;
  makeMapViewDefault?: boolean;
  useCommunityTopBanner?: boolean;
  alternativeTextForNewIdeaButtonClosed?: string;
  alternativeTextForNewIdeaButton?: string;
  hidePostFilterAndSearch?: boolean;
  allPostsBlockedByDefault?: boolean;
  disablePostPageLink?: boolean;
  resourceLibraryLinkMode?: boolean;
  forcePostSortMethodAs?: string;
  canVote?: boolean;
  customRatings?: string;
  hidePostActionsInGrid?: boolean;
  hideDownVoteForPost?: boolean;
  hidePostCover?: boolean;
  hidePostDescription?: boolean;
  allowWhatsAppSharing?: boolean;
  structuredQuestionsJson?: Array<YpStructuredQuestion>;
  hideVoteCount?: boolean;
  customVoteUpHoverText?: string;
  customVoteDownHoverText?: string;
  hideDebateIcon?: boolean;
  originalHideVoteCount?: boolean;
  hideVoteCountUntilVoteCompleted?: boolean;
  endorsementButtons?: string;
  useContainImageMode?: boolean;
  uploadedDefaultPostImageId?: number;
  defaultLocale?: string;
  hideNewPostOnPostPage?: boolean;
  structuredQuestions?: string;
  descriptionTruncateAmount?: number;
  showWhoPostedPosts?: boolean;
  descriptionSimpleFormat?: boolean;
  disableDebate?: boolean;
  hideEmoji?: boolean;
  hidePointAgainst?: boolean;
  allowPointVideoUploads?: boolean;
  showVideoUploadDisclaimer?: boolean;
  alternativePointAgainstHeader?: string;
  alternativePointForLabel?: string;
  alternativePointAgainstLabel?: string;
  alternativePointForHeader?: string;
  videoPointUploadLimitSec?: number;
  allowPointAudioUploads?: boolean;
  audioPointUploadLimitSec?: number;
  pointCharLimit?: number;
  videoPostUploadLimitSec?: number;
  audioPostUploadLimitSec?: number;
  allowAdminAnswersToPoints?: boolean;
  hidePointAuthor?: boolean;
  customAdminCommentsTitle?: string;
  collapsableTranscripts?: boolean;
  customUserNamePrompt?: string;
  customTermsIntroText?: string;
}


interface YpCommunityConfiguration extends YpCollectionConfiguration {
  redirectToGroupId?: number;
  facebookPixelId?: string;
  disableDomainUpLink: boolean;
  forceSecureSamlLogin: boolean;
  customSamlDeniedMessage?: string;
  customSamlLoginMessage?: string;
  signupTermsPageId?: number;
  highlightedLanguages?: Array<string>;
  disableFacebookLoginForCommunity?: boolean;
}

interface YpDomainConfiguration extends YpCollectionConfiguration {
  somethingrather?: string;
  customUserRegistrationText?: string;
  customSamlLoginText?: string;
  samlLoginButtonUrl?: string;
}

interface YpHelpPage {
  id: number;
  content: Record<string, string>;
  title: Record<string, string>;
}

interface YpEndorsement {
  id: number;
  value: number;
  post_id: number;
}

interface YpOrganization {
  name: string;
  OrganizationLogoImages: Array<YpImageData>;
}

interface YpMemberships {
  GroupUsers: Array<YpUserData>;
  CommunityUsers: Array<YpUserData>;
  DomainUsers: Array<YpUserData>;
}

interface YpRating {
  id: number;
  value: number;
  post_id: number;
  type_index: number;
}

interface YpPointQuality {
  id: number;
  value: number;
  point_id: number;
}

interface YpElementWithPlayback extends HTMLElement {
  playStartedAt?: Date;
  $$(id: string): HTMLElement | void;
  videoPlayListener: EventListenerOrEventListenerObject | undefined;
  videoPauseListener: EventListenerOrEventListenerObject | undefined;
  videoEndedListener: EventListenerOrEventListenerObject | undefined;
  audioPlayListener: EventListenerOrEventListenerObject | undefined;
  audioPauseListener: EventListenerOrEventListenerObject | undefined;
  audioEndedListener: EventListenerOrEventListenerObject | undefined;
}

interface YpElementWithIronList extends HTMLElement {
  resetListSize: EventListenerOrEventListenerObject | undefined;
  $$(id: string): HTMLElement | void;
  wide: boolean;
  skipIronListWidth: boolean;
}

interface YpDatabaseItem {
  id: number;
  name: string;
  description?: string;
}

interface YpCollectionData extends YpDatabaseItem {
  objectives?: string;
  theme_id?: number;
  language?: string;
  default_locale?: string;
  User?: YpUserData;
  user_id?: number;
  status?: string;
  counter_groups?: number;
  counter_communities?: number;
  counter_posts: number;
  counter_users: number;
  counter_points: number;
  configuration: YpCollectionConfiguration;
}

interface YpAdminRights {
  GroupAdmins: Array<YpCollectionData>;
  CommunityAdmins: Array<YpCollectionData>;
  DomainAdmins: Array<YpCollectionData>;
}

interface YpDomainData extends YpCollectionData {
  domain_name: string;
  google_analytics_code?: string;
  public_api_keys?: {
    google?: {
      analytics_tracking_id: string;
    };
  };
  description?: string;
  DomainHeaderImages?: Array<YpImageData>;
  DomainLogoImages?: Array<YpImageData>;
  only_admins_can_create_communities: boolean;
  DomainLogoVideos?: Array<YpVideoData>;
  configuration: YpDomainConfiguration;
  Communities: Array<YpCommunityData>;
  facebookLoginProvided?: boolean;
  samlLoginProvided?: boolean;
}

interface YpCommunityData extends YpCollectionData {
  hostname: string;
  description?: string;
  is_community_folder?: boolean;
  domain_id: number;
  is_collection_folder?: boolean;
  only_admins_can_create_groups: boolean;
  configuration: YpCommunityConfiguration;
  google_analytics_code?: string;
  Groups?: Array<YpGroupData>;
  CommunityLogoVideos?: Array<YpVideoData>;
  CommunityHeaderImages?: Array<YpImageData>;
  CommunityLogoImages?: Array<YpImageData>;
  Domain: YpDomainData;
  CommunityFolder?: YpCommunityData;
}

interface YpDomainGetResponse {
  domain: YpDomainData;
  community: YpCommunityData;
}

interface YpHasVideoResponse {
  hasVideoUploadSupport: boolean;
  hasTranscriptSupport: boolean;
}

interface YpHasAudioResponse {
  hasAudioUploadSupport: boolean;
  hasTranscriptSupport: boolean;
}

interface YpGroupData extends YpCollectionData {
  id: number;
  name: string;
  community_id: number;
  configuration: YpGroupConfiguration;
  Community?: YpCommunityData;
  Categories?: Array<YpCategoryData>;
  GroupLogoVideos?: Array<YpVideoData>;
  GroupHeaderImages?: Array<YpImageData>;
  GroupLogoImages?: Array<YpImageData>;
}

interface YpBaseMedia {
  id: number;
  formats: string;
  user_id?: number;
}

interface YpImageData extends YpBaseMedia {
  User?: YpUserData;
}

interface YpVideoData extends YpBaseMedia {
  User?: YpUserData;
  public_meta?: {
    aspect: string;
    selectedVideoFrameIndex: number;
  };
  VideoImages: Array<YpImageData> | null;
}

interface YpAudioData  extends YpBaseMedia {
  User?: YpUserData;
}

interface YpCategoryData {
  id: number;
  name: string;
  CategoryIconImages?: Array<YpImageData>;
  count: number;
}

interface YpPostData extends YpDatabaseItem {
  cover_media_type?: string;
  group_id: number;
  user_id?: number;
  language?: string;
  PostHeaderImages?: Array<YpImageData>;
  Category?: YpCategoryData;
  Group: YpGroupData;
  description: string;
  User?: YpUserData;
  counter_endorsements_up: number;
  counter_endorsements_down: number;
  counter_points: number;
  public_data?: {
    structuredAnswersJson?: Array<YpStructuredAnswer>;
    law_issue: {
      sessionId: string;
      issueId: string;
      issueStatus: string;
    };
    transcript: {
      inProgress: boolean;
      text: string;
      noMachineTranslation: boolean;
      userEdited: boolean;
      language: string;
    };
  };
  location: {
    longitude: string;
    latitude: string;
    map_zoom: string;
    mapType: string;
  };
  PostVideos?: Array<YpVideoData>;
  PostAudios?: Array<YpAudioData>;
}

interface YpPointRevision {
  id: number;
  content: string;
}

interface YpPointData {
  id: number;
  content: string;
  value: number;
  name?: string;
  created_at: Date;
  user_id?: number;
  language?: string;
  Post?: YpPostData;
  User?: YpUserData;
  counter_quality_up: number;
  counter_quality_down: number;
  latestContent?: string;
  checkTranscriptFor?: string;
  PointQualities?: Array<YpPointQuality>;
  PointRevisions?: Array<YpPointRevision>;
  PointVideos?: Array<YpVideoData>;
  PointAudios?: Array<YpAudioData>;
  public_data: {
    admin_comment?: {
      text: string;
      language?: string;
    };
  };
}

interface YpActivityData extends YpDatabaseItem {
  id: number;
  name: string;
  description?: string;
}

interface YpUserProfileData {
  isAnonymousUser?: boolean;
  saml_show_confirm_email_completed?: boolean;
}

interface YpUserData {
  id: number;
  name: string;
  email?: string;
  profile_data?: YpUserProfileData;
  isSamlEmployee?: boolean;
  loginProvider?: string;
  Endorsements?: Array<YpEndorsement>;
  PointQualities?: Array<YpPointQuality>;
  Ratings?: Array<YpRating>;
  notLoggedIn?: boolean;
  missingEmail?: boolean;
  customSamlDeniedMessage?: string;
  customSamlLoginMessage?: string;
  forceSecureSamlLogin?: boolean;
  OrganizationUsers?: Array<YpOrganization>;
  UserProfileImages?: Array<YpImageData>;
  facebook_id?: number;
}

declare interface IronListInterface extends HTMLElement {
  scrollToItem(item: YpDatabaseItem): () => void;
  updateViewportBoundaries(): () => void;
  notifyResize(): () => void;

  fire(eventName: string): () => void;
}

declare interface IronScrollThresholdInterface extends HTMLElement {
  clearTriggers(): () => void;
}

declare const YpHelpPageArray: Array<YpHelpPage>;

declare interface YpSplitCollectionsReturn {
  active: Array<YpCollectionData>;
  archived: Array<YpCollectionData>;
  featured: Array<YpCollectionData>;
}

interface YpPostsInfoInterface {
  posts: Array<YpPostData>;
  totalPostsCount: number;
}

interface YpEndorseResponse {
  endorsement: YpEndorsement;
  oldEndorsementValue: number;
}

interface YpCategoriesCount {
  category_id: number;
  count: number;
}

interface YpCategoriesCountInfo {
  categoriesCount: Array<YpCategoriesCount>;
  allPostCount: number;
}

interface YpGroupResults {
  group: YpGroupData;
  hasNonOpenPosts: boolean;
}

interface YpGetNonOpenPostsResponse {
  hasNonOpenPosts: boolean;
}

interface YpCheckTranscriptResponse {
  text?: string;
  inProgress?: boolean;
  error?: string;
}

interface YpGetPointsResponse {
  count: number;
  points: Array<YpPointData>;
}

interface YpUploadFileData extends File {
  complete: boolean;
  error: boolean;
  progress: number;
  xhr?: XMLHttpRequest;
}

interface YpFormatsAndImagesResponse {
  previewVideoUrl?: string;
  videoImages?: Array<string>;
}

interface YpGetPointTranscriptResponse {
  inProgress: boolean;
  error: boolean;
  point: YpPointData;
}

interface LooseObject {
  [key: string]: any;
}

interface YpHTMLInputElement extends HTMLInputElement {
  validate(): boolean;
  root: HTMLElement;
  options: Array<any>;
}

interface YpEditFormParams {
  domainId?: number;
  communityId?: number;
  groupId?: number;
  postId?: number;
  pointId?: number;
  imageId?: number;
  videoId?: number;
  organizationId?: number;
  userId?: number;
  categoryId?: number;
  userImages?: Array<YpImageData>;
  statusChange?: string;
}