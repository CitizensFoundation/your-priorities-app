# Class: PointLabeling

Extends: [`ImageLabelingBase`](./ImageLabelingBase.md)

`PointLabeling` is a specialized class for handling image labeling tasks associated with a specific "Point" entity. It inherits from `ImageLabelingBase` and provides methods to fetch a point collection and to review and label images (videos) associated with that point.

---

## Methods

### getCollection()

Asynchronously fetches a single `Point` record from the database using the `pointId` from the current `workPackage`. The fetched record is stored in the instance's `collection` property.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when the collection is fetched and assigned; rejects if an error occurs.

#### Description

- Uses `models.Point.findOne` to retrieve a point by its `id`.
- Only the `id` and `data` attributes are selected.
- The result is assigned to `this.collection`.

---

### reviewImagesFromCollection()

Asynchronously reviews and labels videos associated with the current point collection.

#### Parameters

_None_

#### Returns

- `Promise<void>` — Resolves when the review and labeling process is complete; rejects if an error occurs.

#### Description

- Calls the inherited `reviewAndLabelVideos` method with:
  - The `models.Point` model,
  - The current collection's `id`,
  - The string `"PointVideos"` as the video type.
- Intended to process and label videos related to the point.

---

## Properties (Inherited and Instance)

| Name           | Type     | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| collection     | any      | The current point collection fetched from the database.                      |
| workPackage    | any      | The work package context, expected to have a `pointId` property.             |

---

## Dependencies

- [`ImageLabelingBase`](./ImageLabelingBase.md): The base class providing core labeling functionality.
- `models.Point`: The Sequelize model for the "Point" entity, imported from `../../../../models/index.cjs`.

---

## Example Usage

```javascript
const PointLabeling = require('./PointLabeling.cjs');
const pointLabeling = new PointLabeling(workPackage);

await pointLabeling.getCollection();
await pointLabeling.reviewImagesFromCollection();
```

---

## See Also

- [ImageLabelingBase](./ImageLabelingBase.md)
- [models.Point](../../../../models/index.cjs)

---

## Export

This module exports the `PointLabeling` class.

```javascript
module.exports = PointLabeling;
```
