declare module 'lit-flexbox-literals';

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
  content: Record<string,string>;
  title: Record<string,string>;
}

interface YpEndorsement {
  id: number;
  value: number;
  post_id: number;
}

interface YpMemberships {
  GroupUsers: Array<YpUser>;
  CommunityUsers: Array<YpUser>;
  DomainUsers: Array<YpUser>;
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

interface YpCollection {
  id: number;
  name: string;
  User?: YpUser;
  user_id?: number;
  configuration?: YpCollectionConfiguration;
}

interface YpAdminRights {
  GroupAdmins: Array<YpCollection>;
  CommunityAdmins: Array<YpCollection>;
  DomainAdmins: Array<YpCollection>;
}

interface YpDomain extends YpCollection {
  domain_name: string;
  google_analytics_code?: string;
  public_api_keys?: {
    google?: {
      analytics_tracking_id: string;
    };
  };
  description?: string;
  configuration: YpDomainConfiguration;
}

interface YpCommunity extends YpCollection {
  hostname: string;
  description?: string;
  is_community_folder?: boolean;
  configuration: YpCommunityConfiguration;
}

interface YpDomainGetResponse {
  domain: YpDomain;
  community: YpCommunity;
}

interface YpHasVideoResponse {
  hasVideoUploadSupport: boolean;
  hasTranscriptSupport: boolean;
}

interface YpHasAudioResponse {
  hasAudioUploadSupport: boolean;
  hasTranscriptSupport: boolean;
}

interface YpGroup extends YpCollection {
  id: number;
  name: string;
  configuration: YpGroupConfiguration;
  Community?: YpCommunity;
}

interface YpImage {
  id: number;
  formats: string;
  user_id?: number;
  User?: YpUser;
}

interface YpCategory {
  id: number;
  name: string;
  CategoryIconImages?: Array<YpImage>;
}

interface YpPost {
  id: number;
  name: string;
  cover_media_type?: string;
  group_id: number;
  user_id?: number;
  PostHeaderImages?: Array<YpImage>;
  Category?: YpCategory;
  Group?: YpGroup;
  description?: string;
  User?: YpUser;
}

interface YpPointRevision {
  id: number;
  content: string;
}

interface YpPoint {
  id: number;
  content: string;
  user_id?: number;
  Post?: YpPost;
  User?: YpUser;
  PointQualities?: Array<YpPointQuality>;
  PointRevisions?: Array<YpPointRevision>;
}

interface YpActivity {
  id: number;
  name: string;
  description?: string;
}

interface YpUserProfileData {
  isAnonymousUser?: boolean;
  saml_show_confirm_email_completed?: boolean;
}

interface YpUser {
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

declare const YpHelpPageArray: Array<YpHelpPage>
