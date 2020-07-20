declare module 'lit-flexbox-literals';

declare enum CollectionTabTypes {
  Collection = 0,
  Newsfeed = 1,
  Map = 2,
  UserDefined = 3,
  Other,
}

interface YpCollectionConfiguration {
  themeOverrideColorPrimary?: string;
  themeOverrideColorAccent?: string;
  themeOverrideBackgroundColor?: string;
}

interface YpGroupConfiguration extends YpCollectionConfiguration {
  allowAnonymousUsers?: boolean;
  allowAnonymousAutoLogin?: boolean;
  hideGroupHeader?: boolean;
  hideAllTabs?: boolean;
  hideHelpIcon?: boolean;
  customBackName?: string;
  customBackURL?: string;
  forceSecureSamlEmployeeLogin?: boolean;
}

interface YpCommunityConfiguration extends YpCollectionConfiguration {
  redirectToGroupId?: number;
}

interface YpDomainConfiguration extends YpCollectionConfiguration {
  somethingrather?: string;
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
  videoPlayListener: EventListenerOrEventListenerObject | null;
  videoPauseListener: EventListenerOrEventListenerObject | null;
  videoEndedListener: EventListenerOrEventListenerObject | null;
  audioPlayListener: EventListenerOrEventListenerObject | null;
  audioPauseListener: EventListenerOrEventListenerObject | null;
  audioEndedListener: EventListenerOrEventListenerObject | null;
}

interface YpCollectionData {
  id: number;
  name: string;
  description?: string;
  objectives?: string;
  theme_id?: number;
  default_locale?: string;
  User?: YpUserData;
  user_id?: number;
  configuration?: YpCollectionConfiguration;
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
  only_admins_can_create_communities: boolean;
  configuration: YpDomainConfiguration;
  Communities: Array<YpCommunityData>;
}

interface YpCommunityData extends YpCollectionData {
  hostname: string;
  description?: string;
  is_community_folder?: boolean;
  configuration: YpCommunityConfiguration;
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
  configuration: YpGroupConfiguration;
  Community?: YpCommunityData;
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
}

interface YpPostData {
  id: number;
  name: string;
  cover_media_type?: string;
  group_id: number;
  user_id?: number;
  PostHeaderImages?: Array<YpImageData>;
  Category?: YpCategoryData;
  Group?: YpGroupData;
  description?: string;
  User?: YpUserData;
}

interface YpPointRevision {
  id: number;
  content: string;
}

interface YpPointData {
  id: number;
  content: string;
  user_id?: number;
  Post?: YpPostData;
  User?: YpUserData;
  PointQualities?: Array<YpPointQuality>;
  PointRevisions?: Array<YpPointRevision>;
}

interface YpActivityData {
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
}

declare const YpHelpPageArray: Array<YpHelpPage>;
