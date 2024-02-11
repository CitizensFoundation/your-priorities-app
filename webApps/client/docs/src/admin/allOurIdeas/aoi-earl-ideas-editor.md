# AoiEarlIdeasEditor

A custom element for editing ideas within a group, with AI-generated content and image generation capabilities.

## Properties

| Name                    | Type                          | Description                                                                 |
|-------------------------|-------------------------------|-----------------------------------------------------------------------------|
| groupId                 | number                        | The unique identifier for the group.                                        |
| communityId             | number \| undefined           | The unique identifier for the community.                                    |
| configuration           | AoiConfigurationData          | Configuration data for the editor.                                          |
| isCreatingIdeas         | boolean                       | Indicates if the editor is in the process of creating ideas.                |
| choices                 | AoiChoiceData[] \| undefined  | An array of choices available for editing.                                  |
| isGeneratingWithAi      | boolean                       | Indicates if AI generation of content is in progress.                       |
| isSubmittingIdeas       | boolean                       | Indicates if the ideas are being submitted.                                 |
| isTogglingIdeaActive    | number \| undefined           | The identifier of the idea being toggled active or inactive.                |
| isFetchingChoices       | boolean                       | Indicates if the editor is fetching choices.                                |
| group                   | YpGroupData                   | Data about the group associated with the editor.                            |
| aiStyleInputElement     | MdOutlinedTextField \| undefined | Reference to the AI style input element.                                   |
| currentIdeasFilter      | "latest" \| "highestScore" \| "activeDeactive" | The current filter applied to the ideas list.                              |

## Methods

| Name                   | Parameters                    | Return Type | Description                                                                 |
|------------------------|-------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback      | -                             | void        | Lifecycle method that runs when the element is added to the DOM.            |
| socketClosed           | -                             | void        | Handles the event when the WebSocket connection is closed.                  |
| socketError            | -                             | void        | Handles the event when there is an error with the WebSocket connection.     |
| getChoices             | -                             | Promise<void> | Fetches the choices from the server API.                                   |
| createGroupObserver    | -                             | void        | Creates an observer for the group property.                                 |
| handleGroupChange      | -                             | void        | Handles changes to the group property.                                      |
| addChatBotElement      | wsMessage: PsAiChatWsMessage  | Promise<void> | Adds a chatbot element based on the WebSocket message received.            |
| hasMoreThanOneIdea     | -                             | void        | Placeholder method.                                                        |
| openMenuFor            | answer: AoiChoiceData         | void        | Logs the action of opening a menu for a specific answer.                    |
| generateIdeas          | -                             | void        | Initiates the generation of ideas using AI.                                 |
| submitIdeasForCreation | -                             | Promise<void> | Submits the ideas for creation to the server API.                          |
| toggleIdeaActivity     | answer: AoiChoiceData         | AsyncFunction | Toggles the active state of an idea.                                       |
| applyFilter            | filterType: string            | void        | Applies a filter to the ideas list.                                         |
| sortedChoices          | -                             | AoiChoiceData[] \| undefined | Returns the sorted list of choices based on the current filter.            |
| updated                | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method that runs after the element's properties have changed.   |
| generateAiIcons        | -                             | Promise<void> | Initiates the generation of AI icons for the choices.                      |
| stopGenerating         | -                             | void        | Stops the AI icon generation process.                                       |
| allChoicesHaveIcons    | -                             | boolean     | Checks if all choices have associated icons.                                |
| deleteImageUrl         | choice: AoiChoiceData         | Promise<void> | Deletes the image URL for a specific choice.                               |

## Events (if any)

- **yp-ws-closed**: Emitted when the WebSocket connection is closed.
- **yp-ws-error**: Emitted when there is an error with the WebSocket connection.
- **configuration-changed**: Emitted when the configuration data changes.
- **theme-config-changed**: Emitted when the theme configuration changes.

## Examples

```typescript
// Example usage of the AoiEarlIdeasEditor element
const editor = document.createElement('aoi-earl-ideas-editor');
editor.groupId = 123;
editor.communityId = 456;
editor.configuration = { /* ... */ };
editor.isCreatingIdeas = true;
document.body.appendChild(editor);
```

Note: The above example is a basic illustration of how to create and use the `AoiEarlIdeasEditor` element. The actual implementation would require proper handling of properties, methods, and events, as well as integration with the rest of the application logic.