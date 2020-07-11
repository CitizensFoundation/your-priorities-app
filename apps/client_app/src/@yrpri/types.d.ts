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

interface YpCommuynityConfiguration extends YpCollectionConfiguration {
  somethingrather?: string;
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
  description?: string;
  configuration: YpDomainConfiguration;
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
