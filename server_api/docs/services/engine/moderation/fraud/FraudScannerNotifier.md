# Service Module: FraudScannerNotifier

Implements a fraud scanning and notification system for communities, scanning for suspicious activity in endorsements, ratings, and point qualities. Notifies community admins via email if potential fraud is detected, and updates the community's last scan results.

## Dependencies

- [`lodash`](https://lodash.com/): Utility functions.
- [`deep-equal`](https://www.npmjs.com/package/deep-equal`): Deep object comparison.
- [`i18n`](../../../utils/i18n.cjs): Internationalization utility.
- [`models`](../../../../models/index.cjs): Database models (Community, Domain, User, AcBackgroundJob, etc.).
- [`FraudGetEndorsements`](./FraudGetEndorsements): Fraud scanner for endorsements.
- [`FraudGetPointQualities`](./FraudGetPointQualities): Fraud scanner for point qualities.
- [`FraudGetRatings`](./FraudGetRatings): Fraud scanner for ratings.
- [`queue`](../../../workers/queue.cjs): Job queue for sending emails.
- [`i18next-fs-backend`](https://github.com/i18next/i18next-fs-backend): Backend for i18n.
- [`path`](https://nodejs.org/api/path.html): Path utilities.

---

## Class: FraudScannerNotifier

Handles fraud scanning and notification for all communities with fraud detection enabled.

### Properties

| Name                    | Type      | Description                                                                 |
|-------------------------|-----------|-----------------------------------------------------------------------------|
| currentCommunity        | `any`     | The community currently being processed.                                    |
| uniqueCollectionItemsIds| `object`  | Tracks unique item IDs per collection type (endorsements, ratings, etc.).   |
| collectionsToScan       | `string[]`| List of collection types to scan.                                           |
| scannerModels           | `Array`   | List of fraud scanner classes for each collection type.                     |

---

### Constructor

```typescript
constructor()
```
Initializes the notifier, setting up collections to scan and their corresponding scanner models.

---

### Methods

#### getCommunityURL

```typescript
getCommunityURL(): string
```
Builds and returns the URL for the current community, using custom logic for certain domains.

**Returns:**  
- `string`: The constructed community URL.

---

#### setupCounts

```typescript
setupCounts(items: any[], collectionType: string): void
```
Populates `uniqueCollectionItemsIds` for a collection type with item IDs that have a confidence score above 75%.

| Name          | Type     | Description                                 |
|---------------|----------|---------------------------------------------|
| items         | `any[]`  | List of items from a fraud scan job.        |
| collectionType| `string` | The type of collection being processed.     |

---

#### capitalizeFirstLetter

```typescript
capitalizeFirstLetter(string: string): string
```
Capitalizes the first letter of a string.

| Name   | Type     | Description         |
|--------|----------|---------------------|
| string | `string` | The input string.   |

**Returns:**  
- `string`: The capitalized string.

---

#### formatNumber

```typescript
formatNumber(value: number | string): string
```
Formats a number with commas as thousands separators.

| Name  | Type              | Description         |
|-------|-------------------|---------------------|
| value | `number \| string`| The value to format.|

**Returns:**  
- `string`: The formatted number as a string.

---

#### getNumberSign

```typescript
getNumberSign(number: number): string
```
Returns "+" for non-negative numbers, "" for negative.

| Name   | Type     | Description         |
|--------|----------|---------------------|
| number | `number` | The input number.   |

**Returns:**  
- `string`: "+" or "".

---

#### sendNotificationEmails

```typescript
sendNotificationEmails(fraudAuditResults: any[]): Promise<void>
```
Sends notification emails to up to 5 community admins if fraud is detected.

| Name              | Type     | Description                        |
|-------------------|----------|------------------------------------|
| fraudAuditResults | `any[]`  | Results of the fraud audit.        |

---

#### getContainerOldCount

```typescript
getContainerOldCount(collectionType: string): any
```
Finds the previous scan result for a given collection type.

| Name          | Type     | Description                         |
|---------------|----------|-------------------------------------|
| collectionType| `string` | The collection type to look up.     |

**Returns:**  
- `any`: The previous scan result object, or `undefined`.

---

#### getWithDifference

```typescript
getWithDifference(results: any[]): any[]
```
Adds a `changeFromLastCount` property to each result, indicating the difference from the last scan.

| Name    | Type     | Description                |
|---------|----------|----------------------------|
| results | `any[]`  | Current scan results.      |

**Returns:**  
- `any[]`: Results with difference from last scan.

---

#### notify

```typescript
notify(): Promise<void>
```
If new fraud is detected, sends notification emails and updates the community's last scan results.

---

#### scan

```typescript
scan(): Promise<void>
```
Runs fraud scans for all configured collection types and methods, updating `uniqueCollectionItemsIds` with detected items.

---

#### scanAndNotify

```typescript
scanAndNotify(): Promise<void>
```
Finds all communities with fraud detection enabled, runs scans, and notifies admins as needed.

---

## Usage Example

```javascript
const scanner = new FraudScannerNotifier();
await scanner.scanAndNotify();
```

---

# Configuration: i18n Initialization

Initializes the i18n module with multiple languages and file system backend.

## Configuration Object

| Name        | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| preload     | `string[]` | List of language codes to preload.             |
| fallbackLng | `string` | Fallback language code.                          |
| backend     | `object` | Backend configuration for loading translation files. |

**Backend Properties:**

| Name     | Type     | Description                                  |
|----------|----------|----------------------------------------------|
| loadPath | `string` | Path to translation files.                   |
| addPath  | `string` | Path to store missing translation keys.      |
| jsonIndent | `number` | Indentation for stored JSON files.         |

---

# Script Entrypoint

After i18n is initialized, the script creates a `FraudScannerNotifier` instance, runs `scanAndNotify`, and exits the process.

---

# Exported Constants

None.

---

# Related Modules

- [FraudGetEndorsements](./FraudGetEndorsements.md)
- [FraudGetPointQualities](./FraudGetPointQualities.md)
- [FraudGetRatings](./FraudGetRatings.md)
- [models](../../../../models/index.cjs)
- [queue](../../../workers/queue.cjs)
- [i18n](../../../utils/i18n.cjs)

---

# See Also

- [i18next-fs-backend documentation](https://github.com/i18next/i18next-fs-backend)
- [deep-equal documentation](https://www.npmjs.com/package/deep-equal)
- [Lodash documentation](https://lodash.com/)