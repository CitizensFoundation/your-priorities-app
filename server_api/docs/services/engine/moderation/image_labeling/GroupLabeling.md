# Service Class: GroupLabeling

`GroupLabeling` is a service class extending [`ImageLabelingBase`](./ImageLabelingBase.md). It provides specialized logic for handling image and video labeling tasks associated with a "Group" collection, including its logo images, header images, and category icon images. It interacts with Sequelize models for `Group`, `Image`, and `Category`.

---

## Inheritance

- **Extends:** [`ImageLabelingBase`](./ImageLabelingBase.md)

---

## Constructor

The constructor is inherited from `ImageLabelingBase`. It expects a `workPackage` object (typically provided by the parent class or the calling context).

---

## Methods

### getCollection()

Asynchronously fetches the group collection and its related images and categories from the database, and assigns it to `this.collection`.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when the collection is fetched and assigned.

#### Description

- Fetches a `Group` by `id` (from `this.workPackage.collectionId`).
- Includes:
  - `GroupLogoImages`: Images associated as group logos.
  - `GroupHeaderImages`: Images associated as group headers.
  - `Categories`: Each with their `CategoryIconImages`.
- Only selected attributes are fetched for performance and privacy.
- The result is assigned to `this.collection`.

#### Example Usage

```javascript
await groupLabelingInstance.getCollection();
console.log(groupLabelingInstance.collection); // Populated with group, images, and categories
```

---

### reviewImagesFromCollection()

Asynchronously reviews and labels all images and videos associated with the group collection.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when all images and videos have been reviewed and labeled.

#### Description

- Calls `reviewAndLabelImages` (inherited from `ImageLabelingBase`) for:
  - `GroupLogoImages`
  - `GroupHeaderImages`
  - Each category's `CategoryIconImages`
- Calls `reviewAndLabelVideos` (inherited) for group logo videos.
- Assumes `this.collection` is already populated (typically by `getCollection()`).

#### Example Usage

```javascript
await groupLabelingInstance.reviewImagesFromCollection();
```

---

## Properties (Inherited and Used)

| Name             | Type     | Description                                      |
|------------------|----------|--------------------------------------------------|
| workPackage      | object   | Work package context, must include `collectionId`|
| collection       | object   | Populated group collection with images/categories|

---

## Dependencies

- [`ImageLabelingBase`](./ImageLabelingBase.md): Base class providing core image/video labeling logic.
- `models` (from `../../../../models/index.cjs`): Sequelize models for `Group`, `Image`, `Category`, etc.

---

## Export

```javascript
module.exports = GroupLabeling;
```

---

## Example Usage

```javascript
const GroupLabeling = require('./GroupLabeling.cjs');
const groupLabeling = new GroupLabeling({ collectionId: 123 });

await groupLabeling.getCollection();
await groupLabeling.reviewImagesFromCollection();
```

---

## See Also

- [ImageLabelingBase](./ImageLabelingBase.md)
- [Sequelize Models](../../../../models/index.cjs)
- [Group Model](../../../../models/Group.md)
- [Image Model](../../../../models/Image.md)
- [Category Model](../../../../models/Category.md)

---

## Notes

- This class is designed for internal service use, typically as part of a larger image/video moderation or labeling workflow.
- All database operations are asynchronous and use Sequelize ORM.
- Error handling is performed via promise rejection; ensure to use `try/catch` or `.catch()` in calling code.