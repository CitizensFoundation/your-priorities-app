"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_optional_1 = require("typescript-optional");
const pydantic_1 = require("pydantic");
class Post extends pydantic_1.BaseModel {
    post_id = typescript_optional_1.Optional.empty();
    name;
    description;
    language;
    group_name;
    image_url = typescript_optional_1.Optional.empty();
    long_lat = typescript_optional_1.Optional.empty();
    counter_endorsements_up;
    counter_endorsements_down;
    counter_points_for = typescript_optional_1.Optional.of(0);
    counter_points_against = typescript_optional_1.Optional.of(0);
    points_for;
    points_against;
    total_number_of_posts = typescript_optional_1.Optional.of(0);
    group_id;
    community_id;
    domain_id;
    cluster_id = typescript_optional_1.Optional.empty();
    date;
    status;
    official_status = typescript_optional_1.Optional.empty();
}
