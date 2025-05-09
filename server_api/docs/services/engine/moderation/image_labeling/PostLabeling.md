# Service: PostLabeling

`PostLabeling` is a service class extending [`ImageLabelingBase`](./ImageLabelingBase.md). It is responsible for retrieving a post and its associated images from the database, and for reviewing and labeling those images and any related videos. This class is typically used as part of an image and video moderation or labeling workflow for posts.

## Inheritance

- **Extends:** [`ImageLabelingBase`](./ImageLabelingBase.md)

## Constructor

The constructor is inherited from `ImageLabelingBase`. It is expected that an instance is initialized with a `workPackage` object containing at least a `postId` property.

---

## Methods

### getCollection()

Retrieves a post from the database along with its associated images (post images, header images, and user images). The result is stored in the instance's `collection` property.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when the collection is successfully fetched and assigned to `this.collection`. Rejects with an error if the database query fails.

#### Description

- Fetches a single post by `id` (from `this.workPackage.postId`).
- Includes related images:
  - `PostImages`
  - `PostHeaderImages`
  - `PostUserImages`
- Each image relation uses the attributes defined in `models.Image.defaultAttributesPublic`.
- The result is stored in `this.collection`.

#### Example Usage

```javascript
await postLabelingInstance.getCollection();
console.log(postLabelingInstance.collection); // Contains the post and its images
```

---

### reviewImagesFromCollection()

Reviews and labels all images and videos associated with the post collection previously fetched by `getCollection()`.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when all images and videos have been reviewed and labeled. Rejects with an error if any review operation fails.

#### Description

- Calls `this.reviewAndLabelImages()` for each of:
  - `this.collection.PostImages`
  - `this.collection.PostHeaderImages`
  - `this.collection.PostUserImages`
- Calls `this.reviewAndLabelVideos()` for videos associated with the post:
  - Passes `models.Post`, `this.collection.id`, and `"PostVideos"` as arguments.

#### Example Usage

```javascript
await postLabelingInstance.reviewImagesFromCollection();
```

---

## Properties

| Name         | Type   | Description                                                                 |
|--------------|--------|-----------------------------------------------------------------------------|
| collection   | object | The post object with associated images, set by `getCollection()`.           |
| workPackage  | object | Inherited from `ImageLabelingBase`. Should contain at least `postId`.       |

---

## Dependencies

- [`ImageLabelingBase`](./ImageLabelingBase.md): The base class providing core image labeling functionality.
- `models.Post`: Sequelize model for posts.
- `models.Image`: Sequelize model for images, with `defaultAttributesPublic` for attribute selection.

---

## Export

```javascript
module.exports = PostLabeling;
```

---

## Example Usage

```javascript
const PostLabeling = require('./PostLabeling.cjs');
const workPackage = { postId: 123 };

const postLabeling = new PostLabeling(workPackage);

await postLabeling.getCollection();
await postLabeling.reviewImagesFromCollection();
```

---

## See Also

- [ImageLabelingBase](./ImageLabelingBase.md)
- [models/index.cjs](../../../../models/index.cjs) (for `Post` and `Image` model definitions)
