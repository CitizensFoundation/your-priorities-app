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

interface YpGroup {
  id: number;
  name: string;
  objectives?: string;
  configuration: YpGroupConfiguration;
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
