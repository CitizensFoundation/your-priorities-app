# YpOfficialStatusHelper

A helper class for managing and translating official status options.

## Methods

| Name                           | Parameters                     | Return Type | Description                                                                 |
|--------------------------------|--------------------------------|-------------|-----------------------------------------------------------------------------|
| officialStatusOptions          | t: Function                    | Array       | Returns an array of objects representing the official status options.        |
| officialStatusOptionsName      | official_status: number, t: Function | string       | Returns the translated name for the given official status.                   |
| officialStatusOptionsNamePlural| official_status: number, t: Function | string       | Returns the translated plural name for the given official status.            |

## Examples

```typescript
// Example usage of the YpOfficialStatusHelper class

// Assuming a translation function `t` is defined that returns the translated string
const t = (key: string) => {
  const translations = {
    'status.published': 'Published',
    'pluralStatus.published': 'Published Items',
    // ... other translations
  };
  return translations[key] || key;
};

// Get official status options
const options = YpOfficialStatusHelper.officialStatusOptions(t);
console.log(options);

// Get translated name for a specific official status
const statusName = YpOfficialStatusHelper.officialStatusOptionsName(0, t);
console.log(statusName); // Output: "Published"

// Get translated plural name for a specific official status
const statusNamePlural = YpOfficialStatusHelper.officialStatusOptionsNamePlural(0, t);
console.log(statusNamePlural); // Output: "Published Items"
```