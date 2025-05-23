# Model: Domain

Represents a domain entity in the application, encapsulating configuration, authentication providers, counters, and relationships to other models such as Community, User, Image, and Video. This model is defined using Sequelize and includes both static and instance methods for domain management, authentication provider setup, and image handling.

---

## Properties

| Name                                 | Type                | Description                                                                 |
|-------------------------------------- |---------------------|-----------------------------------------------------------------------------|
| id                                   | number              | Primary key (auto-generated by Sequelize).                                  |
| name                                 | string              | Name of the domain.                                                         |
| domain_name                          | string              | The domain's DNS name (e.g., "example.com").                                |
| access                               | number              | Access level (see constants below).                                         |
| deleted                              | boolean             | Whether the domain is deleted.                                              |
| default_locale                       | string              | Default locale for the domain (default: "en").                              |
| description                          | string (TEXT)       | Description of the domain.                                                  |
| message_to_users                     | string              | Message shown to users.                                                     |
| message_for_new_idea                 | string              | Message shown when submitting a new idea.                                   |
| ip_address                           | string              | IP address associated with the domain.                                      |
| user_agent                           | string (TEXT)       | User agent string.                                                          |
| google_analytics_code                | string              | Google Analytics code (optional).                                           |
| counter_communities                  | number              | Number of communities in the domain.                                        |
| counter_users                        | number              | Number of users in the domain.                                              |
| counter_groups                       | number              | Number of groups in the domain.                                             |
| counter_points                       | number              | Number of points in the domain.                                             |
| counter_posts                        | number              | Number of posts in the domain.                                              |
| counter_organizations                | number              | Number of organizations in the domain.                                      |
| only_admins_can_create_communities   | boolean             | If true, only admins can create communities.                                |
| theme_id                             | number              | Theme ID for the domain (nullable).                                         |
| other_social_media_info              | object (JSONB)      | Additional social media info.                                               |
| secret_api_keys                      | object (JSONB)      | Secret API keys for authentication providers (facebook, oidc, saml, etc.).  |
| public_api_keys                      | object (JSONB)      | Public API keys for the domain.                                             |
| info_texts                           | object (JSONB)      | Informational texts for the domain.                                         |
| configuration                        | object (JSONB)      | Arbitrary configuration for the domain.                                     |
| language                             | string              | Language code (optional).                                                   |
| data                                 | object (JSONB)      | Additional data.                                                            |
| created_at                           | Date                | Timestamp when the domain was created.                                      |
| updated_at                           | Date                | Timestamp when the domain was last updated.                                 |

---

## Indexes

- `["id", "deleted"]`
- `["deleted", "domain_name"]` (named: `domains_idx_deleted_domain_name`)

---

## Associations

- **hasMany**: [Community](./community.md) (`domain_id`)
- **belongsToMany**: Video (as `DomainLogoVideos`, through `DomainLogoVideo`)
- **belongsToMany**: Image (as `DomainLogoImages`, through `DomainLogoImage`)
- **belongsToMany**: Image (as `DomainHeaderImages`, through `DomainHeaderImage`)
- **belongsToMany**: User (through `DomainUser`)
- **belongsToMany**: User (as `DomainUsers`, through `DomainUser`)
- **belongsToMany**: User (as `DomainAdmins`, through `DomainAdmin`)

---

## Exported Constants

| Name                | Value | Description                                 |
|---------------------|-------|---------------------------------------------|
| ACCESS_PUBLIC       | 0     | Public access                               |
| ACCESS_CLOSED       | 1     | Closed access                               |
| ACCESS_SECRET       | 2     | Secret access                               |
| defaultAttributesPublic | Array<string> | List of public attributes for serialization |

---

## Static Methods

### Domain.getLoginProviders(req, domainIn, callback)

Returns a list of authentication providers configured for the given domain.

#### Parameters

| Name      | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| req       | Request  | Express request object (used for hostname, etc.) |
| domainIn  | Domain   | The domain instance to check for providers.      |
| callback  | function | Callback `(error, providers)`                    |

#### Returns

- `providers`: Array of provider configuration objects for use with Passport.js.

---

### Domain.getLoginHosts(domainIn, callback)

Returns a list of allowed login hosts for the given domain.

#### Parameters

| Name      | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| domainIn  | Domain   | The domain instance.                             |
| callback  | function | Callback `(error, hosts)`                        |

#### Returns

- `hosts`: Array of hostnames (strings).

---

### Domain.setYpDomain(req, res, next)

Express middleware that determines the current domain based on the request's host header, attaches the domain to `req.ypDomain`, and optionally creates a new domain if it does not exist (depending on environment configuration).

#### Parameters

| Name | Type     | Description                        |
|------|----------|------------------------------------|
| req  | Request  | Express request object             |
| res  | Response | Express response object            |
| next | function | Express next middleware function   |

---

### Domain.extractDomain(url)

Extracts the domain part from a URL.

#### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| url  | string | The input URL.      |

#### Returns

- `domain`: string

---

### Domain.extractHost(url)

Extracts the host (subdomain) part from a URL.

#### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| url  | string | The input URL.      |

#### Returns

- `host`: string or null

---

### Domain.isIpAddress(domain)

Checks if the given string is a valid IPv4 address.

#### Parameters

| Name   | Type   | Description         |
|--------|--------|---------------------|
| domain | string | The domain string.  |

#### Returns

- `boolean`: true if the string is an IP address, false otherwise.

---

## Instance Methods

### simple()

Returns a simplified object representation of the domain.

#### Returns

```json
{
  "id": 1,
  "name": "Domain Name",
  "domain_name": "example.com"
}
```

---

### ensureApiKeySetup()

Ensures that the `secret_api_keys` property is initialized with empty objects for common providers.

---

### setupLogoImage(body, done)

Associates a logo image with the domain if `uploadedLogoImageId` is present in the request body.

#### Parameters

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| body | object | Request body (should contain `uploadedLogoImageId`) |
| done | function | Callback function                |

---

### setupHeaderImage(body, done)

Associates a header image with the domain if `uploadedHeaderImageId` is present in the request body.

#### Parameters

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| body | object | Request body (should contain `uploadedHeaderImageId`) |
| done | function | Callback function                |

---

### getImageFormatUrl(formatId)

Returns the URL for a specific image format from the domain's logo images.

#### Parameters

| Name     | Type   | Description              |
|----------|--------|--------------------------|
| formatId | string | The format identifier.   |

#### Returns

- `string`: URL of the image format, or empty string if not found.

---

### setupImages(body, done)

Sets up both logo and header images for the domain in parallel.

#### Parameters

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| body | object | Request body                       |
| done | function | Callback function                |

---

## Utility Functions (Internal)

### checkValidKeys(keys)

Checks if the given keys object contains valid `client_id` and `client_secret` values.

#### Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| keys | object | Keys object         |

#### Returns

- `boolean`: true if valid, false otherwise.

---

## Related Modules

- [logger.cjs](../utils/logger.md): Logging utility.
- [to_json.cjs](../utils/to_json.md): Converts objects to JSON.
- [parse_domain.cjs](../utils/parse_domain.md): Parses domain from host header.
- [queue.cjs](../services/workers/queue.md): Job queue for background tasks.
- [Community](./community.md): Community model.

---

## Example Usage

```javascript
const { Domain } = require('./domain.cjs');

// Middleware usage
app.use(Domain.setYpDomain);

// Accessing login providers
Domain.getLoginProviders(req, domain, (err, providers) => {
  // use providers
});

// Creating a new domain instance
const domain = Domain.build({
  name: 'My Domain',
  domain_name: 'mydomain.com',
  access: Domain.ACCESS_PUBLIC,
  // ...other properties
});
```

---

## Notes

- The model uses Sequelize's `define` method and supports both static and instance methods.
- The `setYpDomain` middleware is critical for multi-tenant setups, dynamically resolving or creating domains based on the request.
- Authentication provider configuration is dynamic and depends on the presence and validity of API keys in the domain's `secret_api_keys` property.
- The model supports dynamic image association for branding (logo/header images).
- The model is tightly integrated with other models such as Community, User, Image, and Video.

---

For more details on related models, see [Community](./community.md), [User](./user.md), [Image](./image.md), and [Video](./video.md).