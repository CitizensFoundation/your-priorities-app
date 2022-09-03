interface YpPromotionConfigurationData {
  startDate?: string;
  endDate?: string;
  mediums: YpPromotionMediumData[];
  audience: string;
  utm_campaign: string;
  utm_source: string;
  utm_content: string;
  utm_term?: string;
  content: string;
  language: string;
}

interface YpPromotionMediumData {
  utm_medium: string;
  finaUrl?: string;
}

interface YpPromotionData {
  id: number;
  created_at: string;
  updated_at: string;
  post_id?: number;
  group_id?: number;
  community_id?: number;
  domain_id?: number;
  user_id: number;
  email_list_id?: number;
  configuration: YpPromotionConfigurationData;
}