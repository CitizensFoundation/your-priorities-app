# YpMagicText

The `YpMagicText` class is a custom web component that extends `YpBaseElement`. It is designed to handle and display text content with various features such as translation, truncation, and linkification.

## Properties

| Name                      | Type      | Description                                                                 |
|---------------------------|-----------|-----------------------------------------------------------------------------|
| content                   | string \| undefined | The main text content to be displayed.                                      |
| truncatedContent          | string \| undefined | The truncated version of the content.                                       |
| postfixText               | string    | Text to append to the content. Default is an empty string.                  |
| contentId                 | number \| undefined | Identifier for the content.                                                 |
| extraId                   | number \| undefined | Additional identifier for the content.                                      |
| additionalId              | number \| undefined | Another additional identifier for the content.                              |
| unsafeHtml                | boolean   | If true, allows HTML content to be rendered unsafely. Default is false.     |
| textType                  | string \| undefined | Type of the text content, used for translation purposes.                    |
| contentLanguage           | string \| undefined | Language of the content.                                                    |
| processedContent          | string \| undefined | The processed version of the content after translation and other operations.|
| finalContent              | string \| undefined | The final content to be displayed.                                          |
| autoTranslate             | boolean   | If true, automatically translates the content. Default is false.            |
| truncate                  | number \| undefined | Maximum length for truncating the content.                                  |
| moreText                  | string \| undefined | Text to display for expanding truncated content.                            |
| closeDialogText           | string \| undefined | Text for closing dialog actions.                                            |
| textOnly                  | boolean   | If true, only text content is displayed without HTML. Default is false.     |
| isDialog                  | boolean   | If true, the component is used within a dialog. Default is false.           |
| disableTranslation        | boolean   | If true, disables translation of the content. Default is false.             |
| simpleFormat              | boolean   | If true, applies simple formatting to the content. Default is false.        |
| skipSanitize              | boolean   | If true, skips sanitization of the content. Default is false.               |
| removeUrls                | boolean   | If true, removes URLs from the content. Default is false.                   |
| isFetchingTranslation     | boolean   | Indicates if the component is currently fetching a translation.             |
| structuredQuestionsConfig | string \| undefined | Configuration for structured questions within the content.                  |
| linkifyCutoff             | number    | Maximum length for linkified URLs. Default is 25.                           |
| widetext                  | boolean   | Reflects if the text is considered wide. Default is false.                  |

## Methods

| Name                        | Parameters                                                                 | Return Type | Description                                                                 |
|-----------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback           | None                                                                       | void        | Called when the element is added to the document. Sets up event listeners.  |
| disconnectedCallback        | None                                                                       | void        | Called when the element is removed from the document. Cleans up listeners.  |
| render                      | None                                                                       | TemplateResult | Renders the HTML template for the component.                                |
| showMoreText                | None                                                                       | boolean     | Determines if the "more text" button should be shown.                       |
| _openFullScreen             | None                                                                       | void        | Opens the content in a full-screen dialog.                                  |
| subClassProcessing          | None                                                                       | void        | Placeholder for additional processing in subclasses.                        |
| translatedContent           | None                                                                       | string      | Returns the translated content or the original content if not translated.   |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Called when properties change. Updates the content accordingly.             |
| _autoTranslateEvent         | event: CustomEvent                                                         | void        | Handles auto-translate events.                                              |
| _languageEvent              | event: CustomEvent                                                         | void        | Handles language change events.                                             |
| indexKey                    | None                                                                       | string      | Generates a unique key for caching translations.                            |
| _startTranslationAndFinalize| None                                                                       | Promise<void> | Starts the translation process and finalizes the content.                   |
| _update                     | None                                                                       | void        | Updates the processed content based on current properties.                  |
| _setupStructuredQuestions   | None                                                                       | void        | Sets up structured questions within the content.                            |
| _finalize                   | None                                                                       | void        | Finalizes the content processing, applying all transformations.             |
| _linksAndEmojis             | None                                                                       | void        | Processes links and emojis in the content.                                  |
| truncateText                | input: string, length: number, killwords?: string, end?: number            | string      | Truncates the input text to a specified length.                             |
| trim                        | input: string                                                              | string      | Trims whitespace from the input string.                                     |

## Examples

```typescript
// Example usage of the YpMagicText component
import './yp-magic-text.js';

const magicTextElement = document.createElement('yp-magic-text');
magicTextElement.content = "This is a sample content that might be translated or truncated.";
magicTextElement.autoTranslate = true;
document.body.appendChild(magicTextElement);
```