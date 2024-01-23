# sourceColorFromImage

Get the source color from an image.

## Properties

This function does not have properties as it is not a class.

## Methods

| Name                  | Parameters                | Return Type | Description                                                                 |
|-----------------------|---------------------------|-------------|-----------------------------------------------------------------------------|
| sourceColorFromImage  | image: HTMLImageElement   | Promise<string \| undefined> | Asynchronously analyzes an image and returns the color most suitable for creating a UI theme. |

## Examples

```typescript
// Example usage of sourceColorFromImage
const imageElement = document.querySelector('img') as HTMLImageElement;
sourceColorFromImage(imageElement).then(color => {
  console.log(color); // Outputs the source color in hex format, e.g., #aabbcc
}).catch(error => {
  console.error(error);
});
```

Please note that the function `sourceColorFromImage` is an asynchronous function and returns a promise that resolves to a string representing the color in hexadecimal format or undefined if an error occurs.