declare module "lit-flexbox-literals";
declare module "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";
declare module "lit-google-map";
declare module "twemoji";
declare module "luxon";
declare module "ga";
declare module "wavesurfer.js";
declare module "datamaps";
declare module "iso-639-1/src/data.js";
declare module "iso-639-1" {
  export function getName(code: string): string;
  export function getCode(name: string): string;
  export function getAllNames(): Array<string>;
  export function getAllCodes(): Array<string>;
}

type MaterialColorScheme =
  | "tonal"
  | "vibrant"
  | "expressive"
  | "content"
  | "neutral"
  | "monochrome"
  | "fidelity"
  | "dynamic";
type MaterialDynamicVariants =
  | "monochrome"
  | "neutral"
  | "tonalSpot"
  | "vibrant"
  | "expressive"
  | "fidelity"
  | "content"
  | "rainbow"
  | "fruitSalad";

interface YpLanguageData {
  englishName: string;
  nativeName: string;
  code: string;
}

interface YpLanguageMenuItem {
  language: string;
  name: string;
}

interface YpThemeConfiguration {
  oneDynamicColor?: string;
  oneColorScheme?: MaterialColorScheme;
  variant?: MaterialDynamicVariants;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  neutralColor?: string;
  neutralVariantColor?: string;
  useLowestContainerSurface?: boolean;
  iconPrompt?: string;
  fontStyles?: string;
  fontImports?: string;
  bodyBackgroundColorLight?: string;
  bodyBackgroundColorDark?: string;
  allBackgroundColorLight?: string;
  allBackgroundColorDark?: string;
}

interface YpCollectionConfiguration {
  theme?: YpThemeConfiguration;
  themeOverrideColorPrimary?: string;
  themeOverrideColorAccent?: string;
  themeOverrideBackgroundColor?: string;
  disableNameAutoTranslation?: boolean;
  useVideoCover?: boolean;
  welcomeHTML?: string;
  sortBySortOrder?: boolean;
  sortAlphabetically?: boolean;
  optionalSortOrder?: number;
  locationHidden?: boolean;
  welcomePageId?: number;
  customBackName?: string;
  customBackURL?: string;
  hideAllTabs?: boolean;
  hideItemCount?: boolean;
  highlightedLanguages?: string;
}

type YpGroupAccessTypes = "open_to_community" | "closed" | "secret" | "public";

interface YpRadioButtonData {
  text: string;
  isSpecify?: boolean;
  skipTo?: string;
  originalText?: string;
  subType?:
    | "number"
    | "text"
    | "search"
    | "tel"
    | "url"
    | "email"
    | "password"
    | "date"
    | "month"
    | "week"
    | "time"
    | "datetime-local"
    | "color";
}

interface YpCheckboxData {
  text: string;
  isSpecify?: boolean;
  originalText?: string;
  subType?:
    | "number"
    | "text"
    | "search"
    | "tel"
    | "url"
    | "email"
    | "password"
    | "date"
    | "month"
    | "week"
    | "time"
    | "datetime-local"
    | "color";
}

interface YpDropdownData {
  text: string;
  isSpecify?: boolean;
  originalText?: string;
  subType?:
    | "number"
    | "text"
    | "search"
    | "tel"
    | "url"
    | "email"
    | "password"
    | "date"
    | "month"
    | "week"
    | "time"
    | "datetime-local"
    | "color";
}

type YpStructuredQuestionType =
| "textField"
| "textArea"
| "textFieldLong"
| "textAreaLong"
| "textAreaJson"
| "textfield"
| "textarea"
| "textfieldlong"
| "textarealong"
| "textareajson"
| "checkboxes"
| "checkbox"
| "textheader"
| "segment"
| "textdescription"
| "seperator"
| "dropdown"
| "radios"
| "numberField"
| "html"
| "textHeader"
| "textDescription"
| "seperator"
| "dropdown"
| "password";

interface YpStructuredQuestionData {
  uniqueId?: string;
  text: string;
  description?: string;
  type: YpStructuredQuestionType;
  subType?: string;
  maxLength?: number;
  value?: string | number | boolean;
  questionIndex?: number;
  required?: boolean;
  hiddenToUser?: boolean;
  halfWidthDesktop?: boolean;
  extraTopMargin?: boolean;
  lessBottomMargin?: boolean;
  html?: string;
  rows?: number;
  pattern?: string;
  charCounter?: boolean;
  richTextAllowed?: boolean;
  showBeforeAnswerId?: string;
  showAfterAnswerId?: string;
  radioButtons?: Array<YpRadioButtonData>;
  checkboxes?: Array<YpCheckboxData>;
  dropdownOptions?: Array<YpDropdownData>;
  segmentName?: string;
  originalText?: string;
  subTitle?: string;
  maxRows?: number;
}

interface YpErrorData {
  error: string;
  errorStack: string;
  offlineSendLater?: boolean;
}

interface YpStructuredAnswer {
  uniqueId: string;
  value: string | boolean | number;
}

interface YpLtpConfiguration {
  crt?: {
    id?: number;
    nodes?: any; //LtpCurrentRealityTreeDataNode[];
    prompts?: Record<number, string>;
    undesirerableEffects?: string[];
  };
}

interface AoiSiteStats {
  choices_count: number;
  total_questions: number;
  votes_count: number;
}

interface YpGroupConfiguration extends YpCollectionConfiguration {
  usePostTagsForPostListItems?: boolean;
  allowAnonymousUsers?: boolean;
  allowAnonymousAutoLogin?: boolean;
  allowOneTimeLoginWithName?: boolean;
  hideGroupHeader?: boolean;
  hideAllTabs?: boolean;
  disableCollectionUpLink?: boolean;
  anonymousAskRegistrationQuestions?: boolean;
  disableMachineTranscripts?: boolean;
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
  customRatings?: Array<YpCustomRatingsData>;
  hidePostActionsInGrid?: boolean;
  hideDownVoteForPost?: boolean;
  hidePostCover?: boolean;
  hidePostDescription?: boolean;
  allowWhatsAppSharing?: boolean;
  structuredQuestionsJson?: Array<YpStructuredQuestionData>;
  registrationQuestionsJson?: Array<YpStructuredQuestionData>;
  hideVoteCount?: boolean;
  customVoteUpHoverText?: string;
  customVoteDownHoverText?: string;
  hideDebateIcon?: boolean;
  hideDebate?: boolean;
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
  hidePointFor?: boolean;
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
  alternativeTextForNewIdeaButtonHeader?: string;
  hideNewPointOnNewIdea?: boolean;
  hideMediaInput?: boolean;
  hideNameInputAndReplaceWith?: string;
  customThankYouTextNewPosts?: string;
  postDescriptionLimit?: number;
  newPointOptional?: boolean;
  moreContactInformationAddress?: boolean;
  hideQuestionIndexOnNewPost?: boolean;
  makeCategoryRequiredOnNewPost?: boolean;
  hidePostImageUploads?: boolean;
  allowPostVideoUploads?: boolean;
  allowPostAudioUploads?: boolean;
  moreContactInformation?: boolean;
  attachmentsEnabled?: boolean;
  hideRecommendationOnNewsFeed?: boolean;
  defaultLocationLongLat?: string;
  customTitleQuestionText?: string;
  hideSharing?: boolean;
  maxNumberOfGroupVotes?: number;
  allowAdminsToDebate?: boolean;
  hideGroupLevelTabs?: boolean;
  dataForVisualizationJson?: YpGroupDataVizData;
  isDataVisualizationGroup?: boolean;
  usePostTags?: boolean;
  alternativeTextForNewIdeaSaveButton?: string;
  forceShowDebateCountOnPost?: boolean;
  closeNewsfeedSubmissions?: boolean;
  usePostTagsForPostCards?: boolean;
  urlToReviewActionText?: string;
  dataForVisualization?: string;
  hideNewsfeeds?: boolean;
  usePostListFormatOnDesktop?: boolean;
  externalId?: string;
  maxDaysBackForRecommendations?: number;
  actAsLinkToCommunityId?: boolean;
  simpleFormatDescription?: string;
  customRatingsText?: string;
  defaultDataImageId?: number;
  exportSubCodesForRadiosAndCheckboxes?: boolean;
  transcriptSimpleFormat?: boolean;
  customFilterText?: string;
  hideNewestFromFilter?: boolean;
  customCategoryQuestionText?: string;
  customTabTitleNewLocation?: string;
  askUserIfNameShouldBeDisplayed?: boolean;
  inheritThemeFromCommunity?: boolean;
  noGroupCardShadow?: boolean;
  centerGroupName?: boolean;
  hideStatsAndMembership?: boolean;
  alwaysHideLogoImage?: boolean;
  showNameUnderLogoImage?: boolean;
  galleryMode?: boolean;
  hideLogoBoxShadow?: boolean;
  hideLogoBoxExceptOnMobile?: boolean;
  hideInfoBoxExceptForAdmins?: boolean;
  registrationQuestions?: string;
  allowGenerativeImages?: boolean;
  hidePointForAgainstIcons?: boolean;
  groupType?: number;
  hideGroupType?: boolean;
  ltp?: YpLtpConfiguration;
  allOurIdeas?: AoiConfigurationData;
  staticHtml?: {
    content: string;
    media: Array<YpSimpleGroupMediaData>;
  };
  useNewVersion?: boolean;
  agents?: YpPsAgentConfiguration;
  useAsTemplate?: boolean;
}

interface YpGroupPrivateAccessConfiguration {
  aiModelId?: number;
  externalApiId?: number;
  projectId?: string;
  apiKey: string;
}

interface YpPsAgentConfiguration {
  topLevelAgentId?: number;
  inputConnectorForAgentId?: number;
  outputConnectorForAgentId?: number;
}

interface YpSimpleGroupMediaData {
  id: number;
  type: "image" | "video";
  url: string;
}

interface YpFraudAuditData {
  logId: number;
  userName?: string;
  date?: string;
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  counter_flags: number;
  source: string;
  post_id: number;
  type: string;
  Point?: YpPointData;
  Post?: YpPostData;
  Group?: YpGroupData;
  User?: YpUserData;
  moderation_data?: {
    moderation: YpToxicityScore;
  };
  is_post: boolean;
  is_point: boolean;
}

interface YpReportData {
  jobId: number;
  error?: string;
  progress?: number;
  data?: {
    reportUrl?: string;
  };
}

interface YpGroupDataVizData {
  overallTargetPercent: number;
  overallActualPercent: number;
  yearTargetPercent: number;
  yearActualPercent: number;
  overallTargetAmount: number;
  overallActualAmount: number;
  currentYear: string;
  overallColor: string;
  yearColor: string;
  yearTargetAmount: number;
  yearActualAmount: number;
}

type YpCommunityAccessTypes = "public" | "closed" | "secret";

interface YpCommunityConfiguration extends YpCollectionConfiguration {
  redirectToGroupId?: number;
  facebookPixelId?: string;
  disableCollectionUpLink?: boolean;
  forceSecureSamlLogin?: boolean;
  customSamlDeniedMessage?: string;
  customSamlLoginMessage?: string;
  signupTermsPageId?: number;
  ssnLoginListDataId?: number;
  disableFacebookLoginForCommunity?: boolean;
  hideRecommendationOnNewsFeed?: boolean;
  defaultLocationLongLat?: string;
  closeNewsfeedSubmissions?: boolean;
  useCommunityIdForAnalytics?: boolean;
  communityId?: number;
  enableFraudDetection?: boolean;
  ltp?: YpLtpConfiguration;
  onlyAdminsCanCreateGroups?: boolean;
  alwaysShowOnDomainPage?: boolean;
  alwaysHideLogoImage?: boolean;
  useAsTemplate?: boolean;
}

interface YpPromoterRights {
  GroupPromoters: Array<YpCollectionData>;
  CommunityPromoters: Array<YpCollectionData>;
}

interface YpShortDomainList {
  id: number;
  name: string;
}

interface YpDomainConfiguration extends YpCollectionConfiguration {
  customUserRegistrationText?: string;
  customSamlLoginText?: string;
  samlLoginButtonUrl?: string;
  welcomeHtmlInsteadOfCommunitiesList?: string;
  hideAppBarIfWelcomeHtml?: boolean;
  ltp?: YpLtpConfiguration;
  onlyAdminsCanCreateCommunities?: boolean;
  directSamlIntegration?: boolean;
  useLoginOnDomainIfNotLoggedIn?: boolean;
  forceElectronicIds?: boolean;
  doNotCreateElectronicIdUsersAutomatically?: boolean;
  disableArrowBasedTopNavigation?: boolean;
  useFixedTopAppBar?: boolean;
  onlyAllowCreateUserOnInvite?: boolean;
  customerAiTokenMarkupPercent?: number;
  hideDomainNews?: boolean;
}

interface YpHelpPageData {
  id?: number;
  content: Record<string, string>;
  title: Record<string, string>;
  published?: boolean;
  locale?: string;
}

interface YpEndorsement {
  id: number;
  value: number;
  post_id: number;
  Post?: YpPostData;
}

interface YpOrganizationData extends YpDatabaseItem {
  name: string;
  description?: string;
  website?: string;
  OrgLogoImgs?: Array<YpImageData>;
}

interface YpMemberships {
  GroupUsers: Array<YpUserData>;
  CommunityUsers: Array<YpUserData>;
  DomainUsers: Array<YpUserData>;
}

interface YpRatingData {
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
  created_at?: string;
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
  OrganizationAdmins: Array<YpOrganizationData>;
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
  loginCallbackCustomHostName?: string;
  hasLlm?: boolean;
  access?: number;
  googleMapsApiKey?: string;
  DomainUsers?: Array<YpUserData>;
  ip_address?: string;
  user_agent?: string;

  save?: () => Promise<YpDomainData>;
  addDomainUsers?: (user: YpUserData) => Promise<void>;
  removeDomainUsers?: (user: YpUserData) => Promise<void>;
}

interface YpCommunityData extends YpCollectionData {
  hostname?: string;
  description?: string;
  is_community_folder?: boolean;
  domain_id?: number;
  is_collection_folder?: boolean;
  only_admins_can_create_groups: boolean;
  configuration: YpCommunityConfiguration;
  google_analytics_code?: string;
  access?: number;
  in_community_folder_id?: number;
  Groups?: Array<YpGroupData>;
  defaultLocationLongLat?: string;
  CommunityLogoVideos?: Array<YpVideoData>;
  CommunityHeaderImages?: Array<YpImageData>;
  CommunityLogoImages?: Array<YpImageData>;
  Domain?: YpDomainData;
  CommunityFolder?: YpCommunityData;
  hostnameTaken?: boolean;
  ip_address?: string;
  user_agent?: string;
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
  access: number;
  configuration: YpGroupConfiguration;
  is_group_folder?: boolean;
  private_access_configuration?: YpGroupPrivateAccessConfiguration[];
  Community?: YpCommunityData;
  Categories?: Array<YpCategoryData>;
  GroupLogoVideos?: Array<YpVideoData>;
  GroupHeaderImages?: Array<YpImageData>;
  GroupLogoImages?: Array<YpImageData>;
  Groups?: Array<YpGroupData>;
  CommunityLink?: YpCommunityData;
  GroupAdmins?: Array<YpUserData>;
  GroupUsers?: Array<YpUserData>;

  ip_address?: string;
  user_agent?: string;

  save: () => Promise<YpGroupData>;
}

interface YpBaseMedia {
  id: number;
  formats: string;
  user_id?: number;
}

interface YpImageData extends YpBaseMedia {
  User?: YpUserData;
  description?: string;
  photographer_name?: string;
}

interface YpVideoData extends YpBaseMedia {
  User?: YpUserData;
  public_meta?: {
    aspect: string;
    selectedVideoFrameIndex: number;
  };
  VideoImages: Array<YpImageData> | null;
}

interface YpAudioData extends YpBaseMedia {
  User?: YpUserData;
}

interface YpCategoryData {
  id: number;
  name: string;
  description?: string;
  CategoryIconImages?: Array<YpImageData>;
  CategoryHeaderImages?: Array<YpImageData>;
  count: number;
}

enum YpPostContentType {
  CONTENT_IDEA = 0,
  CONTENT_STORY = 1,
  CONTENT_NEWSFEED = 2,
  CONTENT_PERSON = 3,
  CONTENT_BLOG = 4,
  CONTENT_QUESTION = 5,
  CONTENT_SURVEY = 6,
  CONTENT_AGENT_CONVERSATION = 7
}

interface YpPostData extends YpDatabaseItem {
  cover_media_type?: string;
  content_type?: YpPostContentType;
  group_id: number;
  user_id?: number;
  language?: string;
  status?: string;
  PostHeaderImages?: Array<YpImageData>;
  Category?: YpCategoryData;
  Group: YpGroupData;
  description: string;
  User?: YpUserData;
  pointFor?: string;
  category_id?: number;
  counter_endorsements_up: number;
  counter_endorsements_down: number;
  counter_points: number;
  data?: {
    attachment?: {
      filename: string;
      url: string;
    };
  };
  public_data?: {
    structuredAnswersJson?: Array<YpStructuredAnswer>;
    structuredAnswers?: string;
    tags?: string;
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
    ratings?: Array<YpPostRatingsData>;
  };
  location: YpLocationData;
  PostVideos?: Array<YpVideoData>;
  PostAudios?: Array<YpAudioData>;
  categoryId?: number;
  newEndorsement?: YpEndorsement;
  user_agent?: string;
  ip_address?: string;

  save: () => Promise<YpPostData>;
}

interface YpPointRevision {
  id: number;
  point_id: number;
  content: string;
  User: YpUserData;
}

interface YpEmbedData {
  html: string;
  thumbnail_url: string;
  url: string;
  title: string;
  description: string;
}

interface YpPointData {
  id: number;
  content: string;
  value: number;
  name?: string;
  created_at: Date;
  user_id?: number;
  group_id?: number;
  post_id?: number;
  language?: string;
  Post?: YpPostData;
  User?: YpUserData;
  status?: string;
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
    agent_data?: {
      sender: "agent" | "user" | "system";
      review?: string;
      summary?: string;
    };
  };
  embed_data?: YpEmbedData;
  isLastPointInList?: boolean;
  user_agent?: string;
  ip_address?: string;
}

interface YpUserProfileData {
  isAnonymousUser?: boolean;
  saml_show_confirm_email_completed?: boolean;
  hasApiKey?: boolean;
}

interface YpGenerateAiImageStartResponse {
  error?: string;
  jobId?: number;
}

interface YpGenerateAiImageResponse extends YpGenerateAiImageStartResponse {
  data?: {
    imageId?: number;
    imageUrl?: string;
  };
  flagged?: boolean;
}

interface YpWorkPackageData {
  jobId: number;
  type: string;
  userId?: number;
  collectionId?: number;
  collectionType?: string;
}

interface YpGenerativeAiWorkPackageData extends YpWorkPackageData {
  prompt: string;
  imageType: YpAiGenerateImageTypes | undefined;
}

type YpAiGenerateImageTypes = "logo" | "icon";

interface YpUserData {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  email?: string;
  profile_data?: YpUserProfileData;
  isSamlEmployee?: boolean;
  loginProvider?: string;
  Endorsements?: Array<YpEndorsement>;
  PointQualities?: Array<YpPointQuality>;
  Ratings?: Array<YpRatingData>;
  notLoggedIn?: boolean;
  missingEmail?: boolean;
  customSamlDeniedMessage?: string;
  customSamlLoginMessage?: string;
  forceSecureSamlLogin?: boolean;
  OrganizationUsers?: Array<YpOrganizationData>;
  UserProfileImages?: Array<YpImageData>;
  facebook_id?: number;
  ssn?: number;
  notifications_settings?: AcNotificationSettingsData;
  default_locale?: string;
  hasRegistrationAnswers?: boolean;
  encrypted_password?: string;
  status?: string;
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

declare const YpHelpPageArray: Array<YpHelpPageData>;

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
  group?: YpGroupData;
  categoryId?: number;
  userImages?: Array<YpImageData>;
  statusChange?: string;
  disableStatusEmails?: boolean;
}

interface YpLocationData {
  latitude: number;
  longitude: number;
  map_zoom?: number;
  mapType?: string;
}

interface YpSurveyPostResponse {
  error?: string;
}

interface YpPostStatusChange {
  id: number;
  content: string;
  language: string;
}

interface AcActivityData extends YpDatabaseItem {
  type: string;
  domain_id: number;
  community_id?: number;
  created_at: string;
  group_id?: number;
  Point?: YpPointData;
  Post?: YpPostData;
  Community?: YpCommunityData;
  object?: {
    name: string;
    type: string;
  };
  Domain?: YpDomainData;
  Group?: YpGroupData;
  User: YpUserData;
  PostStatusChange?: YpPostStatusChange;
}

interface AcNotificationData extends YpDatabaseItem {
  id: number;
  type: string;
  domain_id: number;
  community_id?: number;
  created_at: Date;
  updated_at: Date;
  group_id?: number;
  Point?: YpPointData;
  Post?: YpPostData;
  viewed: boolean;
  Community?: YpCommunityData;
  Domain?: YpDomainData;
  Group?: YpGroupData;
  User: YpUserData;
  PostStatusChange?: YpPostStatusChange;
  AcActivities: Array<AcActivityData>;
}

interface AcActivitiesResponse {
  activities: Array<AcActivityData>;
  oldestProcessedActivityAt: string;
}

interface AcNotificationSettingsDataItem {
  method: number;
  frequency: number;
}

interface AcNotificationSettingsData {
  my_posts: AcNotificationSettingsDataItem;
  my_posts_endorsements: AcNotificationSettingsDataItem;
  my_points: AcNotificationSettingsDataItem;
  my_points_endorsements: AcNotificationSettingsDataItem;
  all_community: AcNotificationSettingsDataItem;
  all_group: AcNotificationSettingsDataItem;
  newsletter: AcNotificationSettingsDataItem;
}

interface AcNotificationSettingMethod {
  name: string;
  enumValue: number;
}

interface AcNotificationSettingFrequency {
  name: string;
  enumValue: number;
}

interface AcNotificationsResponse {
  notifications: Array<AcNotificationData>;
  oldestProcessedNotificationAt?: Date;
  unViewedCount: number;
}

interface AcNotificationsDateFetchOptions {
  oldestProcessedNotificationAt?: Date | undefined;
  latestProcessedNotificationAt?: Date | undefined;
}

interface AcNotificationsSetAsViewedResponse {
  unViewedCount: number;
  viewedIds: Array<number>;
}

interface YpPointQualityResponse {
  oldPointQualityValue: number;
  pointQuality: YpPointQuality;
}

interface YpSetEmailResponse {
  email: string;
  alreadyRegistered?: boolean;
}

interface YpLinkAccountResponse {
  email: string;
  alreadyRegistered?: boolean;
  accountLinked: boolean;
}

interface YpAcceptInviteResponse {
  name: string;
  redirectTo: string;
}

interface YpInviteSenderInfoResponse {
  inviteName: string;
  targetName: string;
  targetEmail: string;
  configuration: YpCollectionConfiguration;
}

interface YpThemeContainerObject {
  theme_id: number;
}

interface YpThemeData {
  disabled: boolean;
  name: string;
}

interface YpLitGoogleMapElement extends HTMLElement {
  fitToMarkers: boolean;
  mapType?: string;
  zoom?: number;
  centerLongitude: number;
  centerLatitute: number;
  updateMarkers(): void;
  requestUpdate(): void;
  fitToMarkersChanged(): void;
}

interface YpHasAutoTranslationResponse {
  hasAutoTranslation: boolean;
}

interface YpEmojiSelectorData {
  open(trigger: HTMLInputElement, inputTarget: HTMLInputElement): () => void;
}

interface YpShareDialogData {
  open(url: string, label: string, image: string, sharedContent: Function): () => void;
}

interface YpCommentCountsResponse {
  count: number;
}

interface YpTranslationTextData {
  contentId: number;
  content: string;
  textType: string;
  translatedText: string;
  extraId: number;
  targetLocale: string;
  indexKey?: string;
  originalText?: string;
}

interface YpStructuredConfigData extends YpStructuredQuestionData {
  name?: string;
  useHtml?: boolean | undefined;
  templateData?: any;
  rows?: number;
  maxRows?: number;
  translationToken?: string;
  disabled?: boolean;
  onChange?: Function;
  defaultValue?: string | number | boolean;
  type: YpStructuredQuestionType;

}

interface YpConfigTabData {
  name: string;
  icon: string;
  items: Array<YpStructuredConfigData>;
}

interface StartTranscodingResponse {
  transcodingJobId: string;
}

// ADMIN

interface YpToxicityScore {
  toxicityScore?: number;
  identityAttackScore?: number;
  threatScore?: number;
  insultScore?: number;
  severeToxicityScore?: number;
  sexuallyExplicitScore?: number;
  profanityScore?: number;
  flirtationScore?: number;
}

interface YpModerationItem extends YpDatabaseItem {
  status?: string;
  counter_flags?: number;
  source?: string;
  post_id?: number;
  type: string;
  pointTextContent?: string;
  postNameContent?: string;
  postTextContent?: string;
  postTranscriptContent?: string;
  is_post: boolean;
  is_point: boolean;
  toxicityScore?: number;
  groupName?: string;
  user_email?: string;
  moderation_data?: {
    moderation: YpToxicityScore;
  };
}

interface YpCustomRatingsData extends YpDatabaseItem {
  emoji: string;
  numberOf: number;
  averageRating: number;
  count: number;
}

interface YpPostRatingsData extends YpRatingData {
  count: number;
  averageRating: number;
}

interface YpSsnListCountResponse {
  count: number;
}

interface YpStatusUpdateData {
  config: YpBulkStatusUpdateConfigData;
  templates: Array<YpBulkStatusUpdateTemplatesData>;
}

interface YpStatusUpdatePostData extends YpPostData {
  uniqueStatusMessage?: string;
  selectedTemplateName?: string;
  moveToGroupId?: number;
  currentOfficialStatus?: string;
}

interface YpBulkStatusUpdateStatusData {
  official_status: number;
  posts: Array<YpStatusUpdatePostData>;
}

interface YpBulkStatusUpdateGroupData {
  statuses: Array<YpBulkStatusUpdateStatusData>;
  name: string;
  posts: Array<YpStatusUpdatePostData>;
}

interface YpBulkStatusUpdateConfigData {
  groups: Array<YpBulkStatusUpdateGroupData>;
}

interface YpBulkStatusUpdateTemplatesData {
  title: string;
  posts: Array<YpStatusUpdatePostData>;
  content: string;
}

interface YpLocaleStorageItemToSendLater {
  key: string;
  content: YpContentToSendLater;
}

interface YpContentToSendLater {
  params: any;
  url: string;
  method: string;
  body: any;
}

interface YpCreateApiKeyResponse {
  apiKey: string;
}

interface YpHomeLinkData {
  type: string;
  id: number;
  name: string;
}

interface YpLocaleTranslationInData {
  originalUIEnglishTexts: string[];
}

interface YpLocaleTranslationOutData {
  translatedUIEnglishTexts: string[];
}
