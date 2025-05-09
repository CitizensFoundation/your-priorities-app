# Service: CommunityLabeling

`CommunityLabeling` is a service class extending [`ImageLabelingBase`](./ImageLabelingBase.md). It provides specialized logic for labeling and reviewing images and videos associated with a Community entity. This class interacts with the database models to fetch community data and associated images, and then processes them for labeling and review.

## Inheritance

- **Extends:** [`ImageLabelingBase`](./ImageLabelingBase.md)

## Constructor

Inherits the constructor from `ImageLabelingBase`. The constructor expects a `workPackage` object, which should contain a `collectionId` property used to identify the target Community.

---

## Methods

### getCollection

Fetches the Community entity from the database, including its logo and header images, and stores it in the instance's `collection` property.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when the collection is successfully fetched and assigned.

#### Description

- Uses `models.Community.findOne` to retrieve a Community by `id` (from `this.workPackage.collectionId`).
- Selects only the `id` and `data` attributes of the Community.
- Includes associated images:
  - `CommunityLogoImages` (with public attributes)
  - `CommunityHeaderImages` (with public attributes)
- The result is stored in `this.collection`.

#### Example

```javascript
await communityLabelingInstance.getCollection();
console.log(communityLabelingInstance.collection); // Community with images
```

---

### reviewImagesFromCollection

Processes and reviews all images and videos associated with the loaded Community collection.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when all images and videos have been reviewed.

#### Description

- Calls `this.reviewAndLabelImages` for:
  - `this.collection.CommunityLogoImages`
  - `this.collection.CommunityHeaderImages`
- Calls `this.reviewAndLabelVideos` for:
  - The Community model
  - The Community's `id`
  - The string `"CommunityLogoVideos"`
- Assumes that `reviewAndLabelImages` and `reviewAndLabelVideos` are methods provided by the base class [`ImageLabelingBase`](./ImageLabelingBase.md).

#### Example

```javascript
await communityLabelingInstance.reviewImagesFromCollection();
```

---

## Properties

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| collection   | any      | The Community entity with associated images, set by `getCollection`. |
| workPackage  | any      | Inherited from base; should contain `collectionId`. |

---

## Dependencies

- [`ImageLabelingBase`](./ImageLabelingBase.md): The base class providing core image/video labeling logic.
- `models` (from `../../../../models/index.cjs`): Provides access to ORM models, including `Community` and `Image`.

---

## Export

- `module.exports = CommunityLabeling;`

---

## Usage Example

```javascript
const CommunityLabeling = require('./CommunityLabeling.cjs');
const workPackage = { collectionId: 123 };

const labeling = new CommunityLabeling(workPackage);

await labeling.getCollection();
await labeling.reviewImagesFromCollection();
```

---

## See Also

- [ImageLabelingBase](./ImageLabelingBase.md)
- [Community Model](../../../../models/index.cjs)
- [Image Model](../../../../models/index.cjs)

---

**Note:**  
This class is typically used as part of a workflow for reviewing and labeling community-related images and videos, often in moderation or content management systems. It is not an Express route handler or middleware, but a service class intended for use in backend business logic.