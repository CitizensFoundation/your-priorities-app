# YpMagicText

`YpMagicText` is a custom web component that extends `YpBaseElement` to display text content with various features such as auto-translation, truncation, emoji support, and linkification. It can be used in dialogues and supports structured questions.

## Properties

| Name                        | Type      | Description                                                                 |
|-----------------------------|-----------|-----------------------------------------------------------------------------|
| content                     | `string` \| `undefined` | The text content to be displayed.                                           |
| truncatedContent            | `string` \| `undefined` | The truncated version of the content if it exceeds the specified length.    |
| contentId                   | `number` \| `undefined` | An identifier for the content, used in translation requests.                |
| extraId                     | `number` \| `undefined` | An additional identifier used in translation requests.                      |
| additionalId                | `number` \| `undefined` | Another additional identifier used in translation requests.                 |
| textType                    | `string` \| `undefined` | The type of text content, used in translation requests.                     |
| contentLanguage             | `string` \| `undefined` | The language of the content.                                                |
| processedContent            | `string` \| `undefined` | The content after processing, such as translation or formatting.            |
| finalContent                | `string` \| `undefined` | The final version of the content to be displayed.                           |
| autoTranslate               | `boolean` | Whether the content should be auto-translated. Defaults to `false`.         |
| truncate                    | `number` \| `undefined` | The maximum length of content before truncation.                            |
| moreText                    | `string` \| `undefined` | Text for the "more" button when content is truncated.                       |
| closeDialogText             | `string` \| `undefined` | Text for closing the dialogue that displays the content.                    |
| textOnly                    | `boolean` | Whether to display only text without any formatting. Defaults to `false`.   |
| isDialog                    | `boolean` | Whether the component is used within a dialogue. Defaults to `false`.       |
| disableTranslation          | `boolean` | Whether to disable the translation feature. Defaults to `false`.            |
| simpleFormat                | `boolean` | Whether to use simple formatting for the content. Defaults to `false`.      |
| skipSanitize                | `boolean` | Whether to skip sanitization of the content. Defaults to `false`.           |
| removeUrls                  | `boolean` | Whether to remove URLs from the content. Defaults to `false`.               |
| isFetchingTranslation       | `boolean` | Whether the component is currently fetching a translation. Defaults to `false`. |
| structuredQuestionsConfig   | `string` \| `undefined` | Configuration for structured questions in the content.                      |
| linkifyCutoff               | `number`  | The maximum length of displayed URLs after linkification. Defaults to `25`. |
| widetext                    | `boolean` | Whether to use wide text formatting. Reflects to attribute. Defaults to `false`. |

## Methods

| Name                | Parameters | Return Type | Description                                                                 |
|---------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback   | -          | `void`      | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback| -          | `void`      | Lifecycle method called when the component is removed from the DOM.         |
| render              | -          | `TemplateResult` | Renders the HTML template for the component.                                |
| _openFullScreen     | -          | `void`      | Opens the full-screen dialogue to display the content.                      |
| subClassProcessing  | -          | `void`      | Placeholder for additional processing in subclasses.                        |
| _autoTranslateEvent | event: `CustomEvent` | `void` | Handles the auto-translate event.                                          |
| _languageEvent      | event: `CustomEvent` | `void` | Handles the language change event.                                         |
| _startTranslationAndFinalize | - | `Promise<void>` | Starts the translation process and finalizes the content.                   |
| _update             | -          | `void`      | Updates the component state based on property changes.                      |
| _setupStructuredQuestions | -  | `void`      | Sets up the display of structured questions if configured.                  |
| _finalize           | -          | `void`      | Finalizes the content processing and updates the display.                   |
| _linksAndEmojis     | -          | `void`      | Processes links and emojis in the content.                                  |

## Events (if any)

- **yp-auto-translate**: Emitted when the auto-translate feature is toggled.
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

Please note that the above example is a hypothetical usage within an HTML template and assumes the existence of a `yp-magic-text` element definition.