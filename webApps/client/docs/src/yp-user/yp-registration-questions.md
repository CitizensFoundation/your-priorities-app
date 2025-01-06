# YpRegistrationQuestions

The `YpRegistrationQuestions` class is a custom web component that extends `YpBaseElement`. It is designed to handle registration questions, including their display, translation, and validation.

## Properties

| Name                | Type                                           | Description                                                                 |
|---------------------|------------------------------------------------|-----------------------------------------------------------------------------|
| group               | YpGroupData \| undefined                       | The group data associated with the registration questions.                  |
| structuredAnswers   | Array<Record<string, string>> \| undefined     | The structured answers collected from the questions.                        |
| translatedQuestions | Array<YpStructuredQuestionData> \| undefined   | The translated questions if auto-translation is enabled.                    |
| autoTranslate       | boolean                                        | Indicates whether auto-translation is enabled.                              |
| selectedSegment     | string \| undefined                            | The currently selected segment for the questions.                           |
| segments            | Array<YpStructuredQuestionData> \| undefined   | The segments available for the questions.                                   |
| liveQuestionIds     | Array<number>                                  | The list of live question IDs.                                              |
| uniqueIdsToElementIndexes | Record<string, number>                   | Mapping of unique IDs to their respective element indexes.                  |
| liveUniqueIds       | Array<string>                                  | The list of live unique IDs.                                                |
| liveUniqueIdsAll    | Array<{ uniqueId: string; atIndex: number }>   | The list of all live unique IDs with their indexes.                         |

## Methods

| Name                      | Parameters                                                                 | Return Type | Description                                                                 |
|---------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback         | None                                                                       | void        | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback      | None                                                                       | void        | Lifecycle method called when the element is removed from the document.      |
| get styles                | None                                                                       | CSSResult[] | Returns the styles for the component.                                       |
| _goToNextIndex            | event: CustomEvent                                                         | void        | Scrolls to the next question index based on the event detail.               |
| _skipToId                 | event: CustomEvent, showItems: boolean                                     | void        | Skips to a specific question ID based on the event detail.                  |
| _skipToWithHideId         | event: CustomEvent, showItems: boolean                                     | void        | Skips to a specific question ID and hides other questions if needed.        |
| render                    | None                                                                       | TemplateResult | Renders the component's HTML template.                                      |
| structuredQuestions       | None                                                                       | Array<YpStructuredQuestionData> \| undefined | Returns the structured questions, translated if available.                  |
| filteredQuestions         | None                                                                       | Array<YpStructuredQuestionData> \| null | Returns the filtered questions based on the selected segment.               |
| _autoTranslateEvent       | event: CustomEvent                                                         | void        | Handles the auto-translate event to toggle translation.                     |
| _getTranslationsIfNeeded  | None                                                                       | Promise<void> | Fetches translations if auto-translation is enabled and needed.             |
| _setupQuestions           | None                                                                       | void        | Sets up the questions, updating live question IDs and unique ID mappings.   |
| _checkForSegments         | None                                                                       | void        | Checks for segments within the structured questions.                        |
| getAnswers                | None                                                                       | Array<Record<string, string>> | Collects and returns the answers from the questions.                        |
| validate                  | None                                                                       | boolean     | Validates the questions and returns whether they are all valid.             |
| updated                   | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated.                        |
| _radioChanged             | event: CustomEvent                                                         | void        | Handles changes to the radio buttons for segment selection.                 |

## Examples

```typescript
// Example usage of the yp-registration-questions component
import './path/to/yp-registration-questions.js';

const registrationQuestions = document.createElement('yp-registration-questions');
registrationQuestions.group = someGroupData;
document.body.appendChild(registrationQuestions);
```