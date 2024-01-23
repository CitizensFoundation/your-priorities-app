# YpFormattingHelpers

A utility class providing static methods for formatting numbers, manipulating classes on HTML elements, truncating strings, and trimming whitespace from strings.

## Properties

This class does not have any properties.

## Methods

| Name          | Parameters                                      | Return Type | Description                                                                 |
|---------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| number        | value: number \| undefined                      | string      | Formats a number with a fixed number of decimal places and thousand separators. |
| removeClass   | element: HTMLElement \| undefined \| null, classToRemove: string | void        | Removes a specified class from an element's class list if the element exists. |
| truncate      | input: string, length: number, killwords: string \| undefined = undefined, end: string \| undefined = undefined | string      | Truncates a string to a specified length, optionally adding an ending string. |
| trim          | input: string                                   | string      | Trims whitespace from both ends of a string.                                 |

## Examples

```typescript
// Example usage of formatting a number
const formattedNumber = YpFormattingHelpers.number(1234567);
console.log(formattedNumber); // Outputs: "1.234.567"

// Example usage of removing a class from an element
const element = document.getElementById('myElement');
YpFormattingHelpers.removeClass(element, 'myClass');

// Example usage of truncating a string
const truncatedString = YpFormattingHelpers.truncate('This is a long string that needs to be shortened.', 10);
console.log(truncatedString); // Outputs: "This is a..."

// Example usage of trimming a string
const trimmedString = YpFormattingHelpers.trim('   extra whitespace   ');
console.log(trimmedString); // Outputs: "extra whitespace"
```