# Model: Campaign

Represents a campaign entity in the application, typically used for managing campaign-related data such as configuration, ownership, and associations with posts, groups, communities, domains, and users. This model is defined using Sequelize ORM and maps to the `campaigns` table in the database.

## Properties

| Name           | Type             | Description                                                                 |
|----------------|------------------|-----------------------------------------------------------------------------|
| configuration  | `object` (JSONB) | Arbitrary JSON configuration for the campaign.                              |
| user_id        | `number`         | Foreign key referencing the user who owns the campaign. Required.           |
| post_id        | `number`         | Foreign key referencing the associated post. Optional.                      |
| group_id       | `number`         | Foreign key referencing the associated group. Optional.                     |
| community_id   | `number`         | Foreign key referencing the associated community. Optional.                 |
| domain_id      | `number`         | Foreign key referencing the associated domain. Optional.                    |
| deleted        | `boolean`        | Indicates if the campaign is soft-deleted. Default: `false`. Required.      |
| active         | `boolean`        | Indicates if the campaign is currently active. Default: `true`. Required.   |
| created_at     | `Date`           | Timestamp when the campaign was created.                                    |
| updated_at     | `Date`           | Timestamp when the campaign was last updated.                               |

## Table Configuration

- **Table Name:** `campaigns`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Underscored:** Field names use snake_case.
- **Default Scope:** Only returns campaigns where `deleted` is `false`.

## Indexes

Several indexes are defined to optimize queries, especially for filtering by configuration, ownership, and status:

- GIN index on `configuration` (using `jsonb_path_ops`)
- Composite indexes on combinations of `id`, `group_id`, `community_id`, `domain_id`, `post_id`, `user_id`, `deleted`, and `active`

## Associations

The `Campaign` model defines the following associations:

| Association         | Type         | Foreign Key   | Description                                 |
|---------------------|--------------|---------------|---------------------------------------------|
| belongsTo User      | belongsTo    | `user_id`     | The user who owns the campaign.             |
| belongsTo Post      | belongsTo    | `post_id`     | The post associated with the campaign.      |
| belongsTo Group     | belongsTo    | `group_id`    | The group associated with the campaign.     |
| belongsTo Community | belongsTo    | `community_id`| The community associated with the campaign. |
| belongsTo Domain    | belongsTo    | `domain_id`   | The domain associated with the campaign.    |

## Example

```javascript
const Campaign = sequelize.models.Campaign;

// Creating a new campaign
const newCampaign = await Campaign.create({
  configuration: { type: "email", target: "all" },
  user_id: 1,
  active: true,
});

// Querying active campaigns for a user
const campaigns = await Campaign.findAll({
  where: { user_id: 1, active: true }
});
```

## Related Files

- [../services/workers/queue.cjs](../services/workers/queue.cjs) (imported but not directly used in this model)
- User, Post, Group, Community, Domain models (associations)

---

**Note:**  
This model is typically used in conjunction with Sequelize's model querying and association features. The `queue` service is imported but not directly referenced in this file, suggesting it may be used elsewhere in the application for campaign-related background processing.