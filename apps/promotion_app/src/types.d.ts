interface YpCampaignConfigurationData {
  startDate?: string;
  endDate?: string;
}

interface YpCampaignAdConfigurationData {
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  utm_term?: string;
  utm_content: string;
  content?: string;
  finaUrl?: string;
}

interface YpCampaignAdGroupConfigurationData {
  startDate?: string;
  endDate?: string;
}

interface YpCampaignAd {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  configuration?: YpCampaignAdConfigurationData;
  user_id: number;
  language: string;
}

interface YpCampaignAdGroupData {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  configuration?: YpCampaignAdGroupConfigurationData;
  user_id: number;
  ads?: YpCampaignAd[];
}

interface YpCampaignData {
  id: number;
  created_at: string;
  updated_at: string;
  post_id?: number;
  group_id?: number;
  community_id?: number;
  domain_id?: number;
  user_id: number;
  email_list_id?: number;
  configuration: YpCampaignConfigurationData;
  adGroups: YpCampaignAdGroupData[];
}