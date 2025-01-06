# YpFormattingHelpers

A utility class providing static methods for formatting numbers, manipulating HTML element classes, and string operations such as truncation and trimming.

## Methods

| Name         | Parameters                                                                 | Return Type | Description                                                                 |
|--------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| number       | value: number \| undefined, digitSeperator: string = ","                    | string      | Formats a number with a specified digit separator. Returns "0" if undefined.|
| removeClass  | element: HTMLElement \| undefined \| null, classToRemove: string            | void        | Removes a specified class from an HTML element's class list.                |
| truncate     | input: string, length: number, killwords: string\|undefined = undefined, end: string\|undefined = undefined | string      | Truncates a string to a specified length, optionally killing words and appending an end string. |
| trim         | input: string                                                               | string      | Trims whitespace from the beginning and end of a string.                    |

## Examples

```typescript
// Example usage of the YpFormattingHelpers class

// Formatting a number with a comma as a digit separator
console.log(YpFormattingHelpers.number(1234567)); // Output: "1,234,567"

// Removing a class from an HTML element
const element = document.createElement('div');
element.className = 'foo bar baz';
YpFormattingHelpers.removeClass(element, 'bar');
console.log(element.className); // Output: "foo baz"

// Truncating a string to a specified length
console.log(YpFormattingHelpers.truncate("This is a long string that needs to be truncated", 10)); // Output: "This is a..."

// Trimming whitespace from a string
console.log(YpFormattingHelpers.trim("   Hello World!   ")); // Output: "Hello World!"
```