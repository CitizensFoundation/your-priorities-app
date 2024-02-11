# YpImage

`YpImage` is a custom element for displaying an image with additional features such as preloading, sizing options, and placeholders not found on the standard `<img>` tag.

## Properties

| Name          | Type                  | Description                                                                                   |
|---------------|-----------------------|-----------------------------------------------------------------------------------------------|
| src           | string \| undefined   | The URL of an image.                                                                           |
| alt           | string \| undefined   | A short text alternative for the image.                                                        |
| crossorigin   | string \| undefined   | CORS enabled images support.                                                                   |
| preventLoad   | boolean               | When true, prevents the image from loading and shows any placeholder.                          |
| sizing        | string \| undefined   | Sets a sizing option for the image (`contain`, `cover`, or `null`).                            |
| position      | string                | Determines how the image is aligned within the element bounds when a sizing option is used.    |
| preload       | boolean               | When true, shows the placeholder image until the new image has loaded.                         |
| placeholder   | string \| undefined   | The image used as a background/placeholder until the src image has loaded.                     |
| fade          | boolean               | When true and `preload` is true, the placeholder image will fade into place.                   |
| loaded        | boolean               | Read-only value that is true when the image is loaded.                                         |
| loading       | boolean               | Read-only value that tracks the loading state of the image when `preload` is used.             |
| error         | boolean               | Read-only value that indicates that the last set `src` failed to load.                         |
| width         | string \| undefined   | Can be used to set the width of the image.                                                     |
| height        | string \| undefined   | Can be used to set the height of the image.                                                    |

## Methods

| Name                     | Parameters            | Return Type            | Description                                                                 |
|--------------------------|-----------------------|------------------------|-----------------------------------------------------------------------------|
| $$(id: string)           | id: string            | HTMLElement \| null    | Queries the shadow DOM for the element with the specified ID.               |
| connectedCallback()      | None                  | void                   | Lifecycle callback that is called when the element is added to the document. |
| getThemeColorsFromImage  | img: HTMLImageElement | Promise<string \| undefined> | Static method to get theme colors from an image.                            |
| _imgOnLoad()             | None                  | void                   | Internal method called when the image loads successfully.                    |
| _imgOnError()            | None                  | void                   | Internal method called when the image fails to load.                        |
| _resolveSrc(testSrc: string) | testSrc: string   | string \| undefined    | Resolves the full URL of the image based on the provided `testSrc`.         |
| resolveUrl(url: string, baseURI: string) | url: string, baseURI: string | string \| undefined | Resolves a URL against a base URI.                                          |
| updated(changedProperties: Map<string \| number \| symbol, unknown>) | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle callback that is called after the element’s properties have changed. |

## Events

- **loaded**: Emitted when the image has loaded successfully.

## Examples

```typescript
// Example usage of the YpImage element
<yp-image
  style="width:400px; height:400px;"
  sizing="cover"
  preload
  fade
  src="http://lorempixel.com/600/400"
></yp-image>
```

```typescript
// Example setting a placeholder image until the main image loads
<yp-image
  style="width:400px; height:400px;"
  placeholder="data:image/gif;base64,..."
  sizing="cover"
  preload
  src="http://lorempixel.com/600/400"
></yp-image>
```

```typescript
// Example with CORS enabled
<yp-image
  style="width:400px; height:400px;"
  crossorigin="anonymous"
  sizing="cover"
  src="http://lorempixel.com/600/400"
></yp-image>
```