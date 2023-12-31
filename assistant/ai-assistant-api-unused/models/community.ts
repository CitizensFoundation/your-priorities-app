import { Optional } from 'typescript-optional';
import { BaseModel } from 'pydantic';

class Community extends BaseModel {
  community_id: Optional<number> = Optional.empty();
  name: string;
  description: string;
  language: string;
  image_url: Optional<string> = Optional.empty();
  counter_posts: Optional<number> = Optional.of(0);
  counter_points_for: Optional<number> = Optional.of(0);
  counter_points_against: Optional<number> = Optional.of(0);
  domain_id: number;
  cluster_id: Optional<number> = Optional.empty();
  created_at: string;
  updated_at: string;
  status: string;
  assistantConfiguration: string;
}