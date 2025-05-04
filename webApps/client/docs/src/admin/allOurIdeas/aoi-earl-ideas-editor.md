# AoiEarlIdeasEditor

A web component for managing, generating, and editing "ideas" (choices) in an AI-powered group brainstorming or voting context. It supports AI-based idea and icon generation, idea submission, sorting, and activity toggling, and integrates with Material Web Components and custom APIs.

Extends: `YpStreamingLlmScrolling`

## Properties

| Name                    | Type                                                                 | Description                                                                                  |
|-------------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| groupId                 | number                                                               | The ID of the group this editor is associated with.                                          |
| communityId             | number \| undefined                                                  | The ID of the community, if applicable.                                                      |
| openForAnswers          | boolean                                                              | Whether the editor is open for entering answers/ideas.                                       |
| domainId                | number \| undefined                                                  | The ID of the domain, if applicable.                                                         |
| configuration           | AoiConfigurationData                                                 | The configuration object for the editor, including earl and question data.                   |
| isCreatingIdeas         | boolean                                                              | Whether the editor is in the process of creating ideas.                                      |
| choices                 | AoiChoiceData[] \| undefined                                         | The list of idea choices currently managed by the editor.                                    |
| isGeneratingWithAi      | boolean                                                              | Whether AI-based idea or icon generation is in progress.                                     |
| isSubmittingIdeas       | boolean                                                              | Whether ideas are currently being submitted for creation.                                    |
| isTogglingIdeaActive    | number \| undefined                                                  | The ID of the idea currently being toggled for active/inactive status.                       |
| isFetchingChoices       | boolean                                                              | Whether choices are currently being fetched from the server.                                 |
| group                   | YpGroupData                                                          | The group data object, proxied for change observation.                                       |
| aiStyleInputElement     | MdOutlinedTextField \| undefined                                     | Reference to the AI style input text field element.                                          |
| currentIdeasFilter      | "latest" \| "highestScore" \| "activeDeactive"                       | The current filter applied to the ideas list.                                                |
| answersElement          | MdFilledTextField                                                    | Reference to the answers text field element.                                                 |
| scrollElementSelector   | string                                                               | CSS selector for the element to scroll (overrides base).                                     |
| serverApi               | AoiAdminServerApi                                                    | API client for server communication.                                                         |
| imageGenerator          | AoiGenerateAiLogos                                                   | Instance for AI icon generation.                                                             |
| shouldContinueGenerating| boolean                                                              | Flag to control whether icon generation should continue.                                     |
| currentGeneratingIndex  | number \| undefined                                                  | Index of the idea currently being processed for icon generation.                             |

## Methods

| Name                        | Parameters                                                                                 | Return Type         | Description                                                                                      |
|-----------------------------|--------------------------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------|
| constructor                 | —                                                                                          | void                | Initializes the component, API client, and icon generator.                                        |
| connectedCallback           | —                                                                                          | void                | Lifecycle: Sets up observers, listeners, and initializes state on connect.                        |
| disconnectedCallback        | —                                                                                          | void                | Lifecycle: Cleans up listeners and observers on disconnect.                                       |
| themeUpdated                | event: CustomEvent                                                                         | void                | Updates the icon generator's theme color when the theme changes.                                  |
| socketClosed                | —                                                                                          | void                | Handles websocket closed event, stops AI generation.                                              |
| socketError                 | —                                                                                          | void                | Handles websocket error event, stops AI generation.                                               |
| getChoices                  | —                                                                                          | Promise<void>       | Fetches the list of choices/ideas from the server.                                                |
| createGroupObserver         | —                                                                                          | void                | Sets up a Proxy to observe changes to the group object.                                           |
| handleGroupChange           | —                                                                                          | void                | Handles changes to the group object (currently logs to console).                                  |
| addChatBotElement           | wsMessage: YpAssistantMessage                                                              | Promise<void>       | Handles incoming websocket messages for AI chat/streaming.                                        |
| answers                     | —                                                                                          | string[]            | Returns the current list of answers/ideas from the answers text field.                            |
| hasMoreThanOneIdea          | —                                                                                          | void                | (Stub) Checks if there is more than one idea.                                                     |
| openMenuFor                 | answer: AoiChoiceData                                                                      | void                | Opens a menu for a specific answer (currently logs to console).                                   |
| generateIdeas               | —                                                                                          | void                | Initiates AI-based idea generation via the server API.                                            |
| submitIdeasForCreation      | —                                                                                          | Promise<void>       | Submits the current answers/ideas for creation to the server.                                     |
| toggleIdeaActivity          | answer: AoiChoiceData                                                                      | () => Promise<void> | Returns a function that toggles the active status of an idea and updates the server.              |
| applyFilter                 | filterType: string                                                                         | void                | Applies a filter to the ideas list (latest, highestScore, activeDeactive).                        |
| sortedChoices               | —                                                                                          | AoiChoiceData[] \| undefined | Returns the sorted list of choices based on the current filter.                                   |
| updated                     | changedProperties: Map<string \| number \| symbol, unknown>                                | void                | Lifecycle: Called after properties are updated.                                                   |
| generateAiIcons             | —                                                                                          | Promise<void>       | Generates AI icons for all choices in parallel batches, updates server and UI.                    |
| generateAiIconsOld          | —                                                                                          | Promise<void>       | (Legacy) Sequentially generates AI icons for all choices, updates server and UI.                  |
| stopGenerating              | —                                                                                          | void                | Stops the ongoing AI icon generation process.                                                     |
| allChoicesHaveIcons         | —                                                                                          | boolean             | Returns true if all choices have an associated icon.                                              |
| deleteImageUrl              | choice: AoiChoiceData                                                                      | Promise<void>       | Deletes the image URL for a choice and updates the server.                                        |
| styles (static)             | —                                                                                          | CSSResultGroup      | Returns the component's styles.                                                                   |
| answersChanged              | —                                                                                          | void                | Requests a UI update when answers change.                                                         |
| renderCreateIdeas           | —                                                                                          | TemplateResult      | Renders the UI for creating new ideas.                                                            |
| renderIdeasSortingChips     | —                                                                                          | TemplateResult      | Renders the filter chips for sorting ideas.                                                       |
| renderIcon                  | choice: AoiChoiceData                                                                      | TemplateResult      | Renders the icon or spinner for a choice.                                                         |
| aiStyleChanged              | —                                                                                          | void                | Fires a theme config change event when the AI style input changes.                                |
| renderAnswerData            | answer: AoiChoiceData                                                                      | TemplateResult      | Renders the UI for a single answer/idea, including icon and controls.                             |
| renderEditIdeas             | —                                                                                          | TemplateResult      | Renders the UI for editing existing ideas.                                                        |
| render                      | —                                                                                          | TemplateResult      | Main render method: shows create or edit UI depending on state.                                   |

## Examples

```typescript
import "./aoiEarlIdeasEditor.js";

const editor = document.createElement("aoi-earl-ideas-editor");
editor.groupId = 123;
editor.communityId = 456;
editor.domainId = 789;
editor.configuration = myAoiConfigurationData;
document.body.appendChild(editor);

// Listen for configuration changes
editor.addEventListener("configuration-changed", (e) => {
  console.log("Configuration updated:", e.detail);
});
```
