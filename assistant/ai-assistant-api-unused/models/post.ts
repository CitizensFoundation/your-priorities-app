import { Optional } from 'typescript-optional';
import { BaseModel } from 'pydantic';

class Post extends BaseModel {
  post_id: Optional<number> = Optional.empty();
  name: string;
  description: string;
  language: string;
  group_name: string;
  image_url: Optional<string> = Optional.empty();
  long_lat: Optional<string> = Optional.empty();
  counter_endorsements_up: number;
  counter_endorsements_down: number;
  counter_points_for: Optional<number> = Optional.of(0);
  counter_points_against: Optional<number> = Optional.of(0);
  points_for: string;
  points_against: string;
  total_number_of_posts: Optional<number> = Optional.of(0);
  group_id: number;
  community_id: number;
  domain_id: number;
  cluster_id: Optional<number> = Optional.empty();
  date: string;
  status: string;
  official_status: Optional<string> = Optional.empty();
}