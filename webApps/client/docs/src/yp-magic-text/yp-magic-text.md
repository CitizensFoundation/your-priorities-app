# YpMagicText

`YpMagicText` is a custom web component that extends `YpBaseElement` to display text content with various features such as auto-translation, truncation, linkification, emoji support, and more. It is designed to handle and display text in a "magical" way, providing a rich text experience.

## Properties

| Name                        | Type                      | Description                                                                 |
|-----------------------------|---------------------------|-----------------------------------------------------------------------------|
| content                     | string \| undefined       | The text content to be displayed.                                           |
| truncatedContent            | string \| undefined       | The truncated version of the content if it exceeds the specified length.    |
| contentId                   | number \| undefined       | An identifier for the content, used in translation and other processes.     |
| extraId                     | number \| undefined       | An additional identifier that may be used in conjunction with contentId.    |
| textType                    | string \| undefined       | A string representing the type of text content.                             |
| contentLanguage             | string \| undefined       | The language of the content.                                                |
| processedContent            | string \| undefined       | The content after being processed (e.g., translated, truncated).            |
| finalContent                | string \| undefined       | The final version of the content to be displayed after all processing.      |
| autoTranslate               | boolean                   | Whether the content should be auto-translated.                              |
| truncate                    | number \| undefined       | The maximum length of content before it gets truncated.                     |
| moreText                    | string \| undefined       | Text for the "more" button to show the full content.                        |
| closeDialogText             | string \| undefined       | Text for the button to close the dialog displaying the full content.        |
| textOnly                    | boolean                   | If true, only text will be processed without emojis or links.               |
| isDialog                    | boolean                   | If true, the component is being used within a dialog.                       |
| disableTranslation          | boolean                   | If true, disables the translation of the content.                           |
| simpleFormat                | boolean                   | If true, applies simple formatting to the content.                          |
| skipSanitize                | boolean                   | If true, skips sanitization of the content.                                 |
| removeUrls                  | boolean                   | If true, removes URLs from the content.                                     |
| structuredQuestionsConfig   | string \| undefined       | Configuration for structured questions within the content.                  |
| linkifyCutoff               | number                    | The maximum length of displayed URLs after which they are truncated.        |
| widetext                    | boolean                   | If true, indicates that the content should be displayed in a wide text format. |

## Methods

| Name                        | Parameters                | Return Type | Description                                                                 |
|-----------------------------|---------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback           | -                         | void        | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback        | -                         | void        | Lifecycle method called when the component is removed from the DOM.         |
| render                      | -                         | TemplateResult | Returns the template for rendering the component.                        |
| _openFullScreen             | -                         | void        | Opens the full-screen dialog to display the full content.                   |
| subClassProcessing          | -                         | void        | Placeholder for additional processing in subclasses.                        |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method called after the component’s properties have changed. |
| _autoTranslateEvent         | event: CustomEvent        | void        | Handles the auto-translate event.                                          |
| _languageEvent              | event: CustomEvent        | void        | Handles the language change event.                                         |
| _startTranslationAndFinalize| -                         | Promise<void> | Starts the translation process and finalizes content display.           |
| _update                     | -                         | void        | Updates the component with new content or settings.                         |
| _setupStructuredQuestions   | -                         | void        | Sets up structured questions within the content.                            |
| _finalize                   | -                         | void        | Finalizes the content processing and prepares it for display.               |
| _linksAndEmojis             | -                         | void        | Processes links and emojis within the content.                              |

## Events (if any)

- **yp-auto-translate**: Emitted when the auto-translate feature is triggered.
- **new-translation**: Emitted when a new translation is available.

## Examples

```typescript
// Example usage of the YpMagicText component
<yp-magic-text
  content="This is a sample text."
  contentId={123}
  textType="postContent"
  contentLanguage="en"
  autoTranslate={true}
  truncate={100}
  moreText="Read more"
  closeDialogText="Close"
></yp-magic-text>
```

Note: The above example assumes you have the necessary setup to use the `YpMagicText` component in your project, including importing the component and any required dependencies.