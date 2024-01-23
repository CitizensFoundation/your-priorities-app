# truncateNameList

Truncates a comma-separated list of names to the first two names and appends the count of additional names if there are more than two.

## Properties

This function does not have properties as it is not a class.

## Methods

| Name             | Parameters        | Return Type | Description                                                                 |
|------------------|-------------------|-------------|-----------------------------------------------------------------------------|
| truncateNameList | nameString: string | string      | Truncates a comma-separated list of names to the first two, with a count of additional names if more than two. Returns an empty string if input is empty. |

## Examples

```typescript
// Example usage of truncateNameList
const longNameString = "John,Doe,Jane,Smith,Robert,Brown";
const truncatedNames = truncateNameList(longNameString);
console.log(truncatedNames); // Output: "John, Doe +3"

const shortNameString = "John,Doe";
const output = truncateNameList(shortNameString);
console.log(output); // Output: "John, Doe"

const emptyString = "";
const emptyOutput = truncateNameList(emptyString);
console.log(emptyOutput); // Output: ""
```