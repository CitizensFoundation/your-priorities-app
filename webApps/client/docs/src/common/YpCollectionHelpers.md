# YpCollectionHelpers

A utility class providing helper methods for handling collections and their properties based on their status and type.

## Properties

This class does not have properties as it only contains static methods.

## Methods

| Name              | Parameters                                          | Return Type                                  | Description                                                                 |
|-------------------|-----------------------------------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| splitByStatus     | items: Array<YpCollectionData>, containerConfig: YpCollectionConfiguration \| undefined | YpSplitCollectionsReturn | Splits the collection items into active, archived, and featured based on their status and an optional configuration. |
| logoImagePath     | collectionType: string \| undefined, collection: YpCollectionData | string \| undefined                          | Returns the path to the logo image for the given collection type and collection data. |
| logoImages        | collectionType: string \| undefined, collection: YpCollectionData | Array<YpImageData> \| undefined              | Retrieves the logo images for the given collection type and collection data. |
| nameTextType      | collectionType: string \| undefined                | string \| undefined                          | Determines the text type for the name based on the collection type.          |
| descriptionTextType | collectionType: string \| undefined              | string \| undefined                          | Determines the text type for the description based on the collection type.   |

## Examples

```typescript
// Example usage of splitting collection items by status
const items: Array<YpCollectionData> = [...]; // your collection items
const containerConfig: YpCollectionConfiguration | undefined = {...}; // your optional configuration
const splitCollections = YpCollectionHelpers.splitByStatus(items, containerConfig);

// Example usage of getting the logo image path
const collectionType: string | undefined = 'domain'; // your collection type
const collection: YpCollectionData = {...}; // your collection data
const logoPath = YpCollectionHelpers.logoImagePath(collectionType, collection);

// Example usage of getting the logo images
const logoImages = YpCollectionHelpers.logoImages(collectionType, collection);

// Example usage of getting the name text type
const nameTextType = YpCollectionHelpers.nameTextType(collectionType);

// Example usage of getting the description text type
const descriptionTextType = YpCollectionHelpers.descriptionTextType(collectionType);
```