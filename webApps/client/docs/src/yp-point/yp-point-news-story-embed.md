# YpPointNewsStoryEmbed

The `YpPointNewsStoryEmbed` class is a web component that extends `YpBaseElement` to display an embeddable news story. It includes a thumbnail image, title, and description, and can optionally display HTML content. The component is styled to be responsive and adjusts its layout for smaller screens.

## Properties

| Name      | Type        | Description                           |
|-----------|-------------|---------------------------------------|
| embedData | YpEmbedData | The data object for the news story embed. |

## Methods

No public methods are documented for this class.

## Events

No custom events are emitted by this class.

## Examples

```typescript
// Example usage of the YpPointNewsStoryEmbed web component
<yp-point-news-story-embed .embedData=${{
  url: "https://example.com/news-story",
  thumbnail_url: "https://example.com/thumbnail.jpg",
  title: "News Story Title",
  description: "A brief description of the news story.",
  html: null // or "<div>Some HTML content</div>"
}}></yp-point-news-story-embed>
```

Note: The `YpEmbedData` type should be defined elsewhere in the codebase, and it should contain the properties `url`, `thumbnail_url`, `title`, `description`, and `html`.