from typing import Union, List, Optional

from pydantic import BaseModel

class Post(BaseModel):
    post_id: Optional[int] = None
    name: str
    description: str
    language: str
    group_name: str
    image_url: Optional[str] = None
    long_lat: Optional[str] = None
    counter_endorsements_up: int
    counter_endorsements_down: int
    counter_points_for: Optional[int] = 0
    counter_points_against: Optional[int] = 0
    points_for: str
    points_against: str
    total_number_of_posts: Optional[int] = 0
    group_id: int
    community_id: int
    domain_id: int
    cluster_id: Optional[int] = None
    date: str
    status: str
    official_status: Optional[str] = None
