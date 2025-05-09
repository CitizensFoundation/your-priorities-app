# Model: Page

Represents a content page within the application, supporting multi-locale content and title, soft deletion, publishing, and association with domains, communities, groups, and users. Implements business logic for page management, including creation, updating, publishing, unpublishing, deletion, and locale-specific content updates.

## Properties

| Name              | Type      | Description                                                                 |
|-------------------|-----------|-----------------------------------------------------------------------------|
| title             | `object`  | JSONB object containing localized titles. Required.                         |
| content           | `object`  | JSONB object containing localized content. Required.                        |
| weight            | `number`  | Integer used for ordering pages. Default: 0.                                |
| published         | `boolean` | Indicates if the page is published. Default: `false`. Required.             |
| deleted           | `boolean` | Indicates if the page is soft-deleted. Default: `false`. Required.          |
| legacy_page_id    | `number`  | (Optional) Reference to a legacy page ID.                                   |
| legacy_new_domain_id | `number`| (Optional) Reference to a legacy new domain ID.                             |
| created_at        | `Date`    | Timestamp of creation.                                                      |
| updated_at        | `Date`    | Timestamp of last update.                                                   |
| domain_id         | `number`  | Foreign key to the associated Domain.                                       |
| community_id      | `number`  | Foreign key to the associated Community.                                    |
| group_id          | `number`  | Foreign key to the associated Group.                                        |
| user_id           | `number`  | Foreign key to the associated User.                                         |

## Configuration

- **Table Name:** `pages`
- **Timestamps:** Enabled (`created_at`, `updated_at`)
- **Underscored:** Field names use snake_case.
- **Default Scope:** Only non-deleted pages are returned by default.
- **Indexes:** Multiple indexes for efficient querying by `community_id`, `group_id`, `domain_id`, and combinations with `published` and `deleted`.

## Associations

| Association Type | Target Model | Foreign Key   | Description                        |
|------------------|--------------|--------------|------------------------------------|
| belongsTo        | Domain       | domain_id    | The domain this page belongs to.   |
| belongsTo        | Community    | community_id | The community this page belongs to.|
| belongsTo        | Group        | group_id     | The group this page belongs to.    |
| belongsTo        | User         | user_id      | The user who created/owns the page.|

---

# Service Module: Page (Static Methods)

Provides business logic for managing pages, including CRUD operations, publishing, localization, and retrieval for admin and public views.

## Methods

| Name                | Parameters                                      | Return Type | Description                                                                                 |
|---------------------|------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| getPagesForAdmin    | req, options, callback                         | void        | Retrieves all pages matching `options` for admin, ordered by creation date.                 |
| newPage             | req, options, callback                         | void        | Creates a new page with the given options.                                                  |
| updatePageWeight    | req, options, callback                         | void        | Updates the `weight` of a page identified by `options`.                                     |
| updatePageLocale    | req, options, callback                         | void        | Updates the localized `title` and `content` for a page in a specific locale.                |
| publishPage         | req, options, callback                         | void        | Sets the `published` flag to `true` for the specified page.                                 |
| unPublishPage       | req, options, callback                         | void        | Sets the `published` flag to `false` for the specified page.                                |
| deletePage          | req, options, callback                         | void        | Soft-deletes a page by setting the `deleted` flag to `true`.                                |
| getPages            | req, options, callback                         | void        | Retrieves published pages for a group, community, and/or domain, ordered by weight and date.|

---

## Method Details

### Page.getPagesForAdmin

Retrieves all pages matching the provided options for administrative purposes.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| req      | Request  | Express request object                      |
| options  | object   | Sequelize `where` options for filtering     |
| callback | function | Callback function `(error, pages)`          |

#### Example Usage

```javascript
Page.getPagesForAdmin(req, { community_id: 1 }, (err, pages) => { ... });
```

---

### Page.newPage

Creates a new page with the specified options.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| req      | Request  | Express request object                      |
| options  | object   | Page creation options                       |
| callback | function | Callback function `(error)`                 |

#### Example Usage

```javascript
Page.newPage(req, { title: {...}, content: {...}, ... }, (err) => { ... });
```

---

### Page.updatePageWeight

Updates the `weight` property of a page.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| req      | Request  | Express request object (expects `body.weight`)|
| options  | object   | Sequelize `where` options to find the page  |
| callback | function | Callback function `(error)`                 |

#### Example Usage

```javascript
Page.updatePageWeight(req, { id: 5 }, (err) => { ... });
```

---

### Page.updatePageLocale

Updates the localized `title` and `content` for a page in a specific locale.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| req      | Request  | Express request object (expects `body.locale`, `body.title`, `body.content`) |
| options  | object   | Sequelize `where` options to find the page  |
| callback | function | Callback function `(error)`                 |

#### Example Usage

```javascript
Page.updatePageLocale(req, { id: 5 }, (err) => { ... });
```

---

### Page.publishPage

Sets the `published` flag to `true` for the specified page.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| req      | Request  | Express request object                      |
| options  | object   | Sequelize `where` options to find the page  |
| callback | function | Callback function `(error)`                 |

---

### Page.unPublishPage

Sets the `published` flag to `false` for the specified page.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| req      | Request  | Express request object                      |
| options  | object   | Sequelize `where` options to find the page  |
| callback | function | Callback function `(error)`                 |

---

### Page.deletePage

Soft-deletes a page by setting the `deleted` flag to `true`.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| req      | Request  | Express request object                      |
| options  | object   | Sequelize `where` options to find the page  |
| callback | function | Callback function `(error)`                 |

---

### Page.getPages

Retrieves published pages for a group, community, and/or domain, ordered by `weight` and `created_at`.

#### Parameters

| Name     | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| req      | Request  | Express request object                      |
| options  | object   | Object with optional `group_id`, `community_id`, `domain_id` |
| callback | function | Callback function `(error, pages)`          |

#### Example Usage

```javascript
Page.getPages(req, { group_id: 1, community_id: 2 }, (err, pages) => { ... });
```

---

# Exported Constants

None.

---

# Dependencies

- [async](https://caolan.github.io/async/)
- [lodash](https://lodash.com/)
- [sequelize](https://sequelize.org/)

---

# Related Models

- [Domain](./Domain.md)
- [Community](./Community.md)
- [Group](./Group.md)
- [User](./User.md)

---

# Table: pages

- Stores all page records with support for soft deletion, publishing, and multi-locale content.
- Indexed for efficient querying by domain, community, group, and publication status.

---

# Example Usage

```javascript
// Creating a new page
Page.newPage(req, {
  title: { en: "Welcome", fr: "Bienvenue" },
  content: { en: "Hello world", fr: "Bonjour le monde" },
  domain_id: 1,
  community_id: 2,
  group_id: 3,
  user_id: 4
}, (err) => {
  if (err) { /* handle error */ }
});

// Publishing a page
Page.publishPage(req, { id: 5 }, (err) => { ... });

// Updating page locale
Page.updatePageLocale(req, { id: 5 }, (err) => { ... });
```

---

For more information on Sequelize model definitions and associations, see the [Sequelize documentation](https://sequelize.org/master/manual/model-basics.html).