# numberFormatter

Formats a number into a string with appropriate suffixes (k, M, B) for thousands, millions, and billions, or returns the number as is if it's less than a thousand or greater than or equal to a trillion.

## Methods

| Name            | Parameters     | Return Type | Description                                                                 |
|-----------------|----------------|-------------|-----------------------------------------------------------------------------|
| numberFormatter | num: number    | string\|number | Formats a number into a string with 'k', 'M', 'B' suffixes or returns the number as is. |

# pad

Pads a number with zeros to a specified size.

## Methods

| Name | Parameters            | Return Type | Description                                      |
|------|-----------------------|-------------|--------------------------------------------------|
| pad  | num: number, size: number | string      | Returns a string with the number padded with zeros to the specified size. |

# durationFormatter

Formats a duration in seconds into a string representing hours, minutes, and seconds.

## Methods

| Name             | Parameters        | Return Type | Description                                                                 |
|------------------|-------------------|-------------|-----------------------------------------------------------------------------|
| durationFormatter | duration: number | string      | Formats a duration in seconds into a string with hours, minutes, and seconds. |

## Examples

```typescript
// Example usage of numberFormatter
const formattedNumber = numberFormatter(123456); // Output: "123k"

// Example usage of pad
const paddedNumber = pad(5, 3); // Output: "005"

// Example usage of durationFormatter
const formattedDuration = durationFormatter(3665); // Output: "1h 1m 5s"
```