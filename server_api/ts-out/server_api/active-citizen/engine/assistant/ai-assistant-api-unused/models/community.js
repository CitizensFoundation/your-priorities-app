"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_optional_1 = require("typescript-optional");
const pydantic_1 = require("pydantic");
class Community extends pydantic_1.BaseModel {
    community_id = typescript_optional_1.Optional.empty();
    name;
    description;
    language;
    image_url = typescript_optional_1.Optional.empty();
    counter_posts = typescript_optional_1.Optional.of(0);
    counter_points_for = typescript_optional_1.Optional.of(0);
    counter_points_against = typescript_optional_1.Optional.of(0);
    domain_id;
    cluster_id = typescript_optional_1.Optional.empty();
    created_at;
    updated_at;
    status;
    assistantConfiguration;
}
