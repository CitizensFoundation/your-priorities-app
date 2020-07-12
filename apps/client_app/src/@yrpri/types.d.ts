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

interface YpDomain {
  id: number;
  name: string;
  domain_name: string;
  description?: string;
  configuration: YpDomainConfiguration;
}


interface YpCommunity {
  id: number;
  name: string;
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

interface YpGroup {
  id: number;
  name: string;
  objectives?: string;
  Community?: YpCommunity;
  configuration: YpGroupConfiguration;
}

interface YpImage {
  id: number;
  formats: string;
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
  PostHeaderImages?: Array<YpImage>;
  Category?: YpCategory;
  Group?: YpGroup;
  description?: string;
}

interface YpActivity {
  id: number;
  name: string;
  description?: string;
}

interface YpUserProfileData {
  isAnonymousUser?: boolean;
}

interface YpUser {
  id: number;
  name: string;
  email?: string;
  profile_data?: YpUserProfileData;
}

declare const YpHelpPageArray: Array<YpHelpPage>
