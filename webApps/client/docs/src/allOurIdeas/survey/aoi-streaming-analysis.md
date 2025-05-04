# AoiStreamingAnalysis

A web component for streaming and displaying AI-generated analysis of survey data, including rendering selected choices and handling real-time updates via websocket messages. Inherits from `YpStreamingLlmScrolling`.

## Properties

| Name             | Type                    | Description                                                                 |
|------------------|------------------------|-----------------------------------------------------------------------------|
| earl             | AoiEarlData            | The EARL (Evaluation and Report Language) data object for the analysis.     |
| groupId          | number                 | The ID of the group for which the analysis is being performed.              |
| group            | YpGroupData            | The group data object associated with the analysis.                         |
| analysisIndex    | number                 | The index of the analysis to be performed.                                  |
| analysisTypeIndex| number                 | The index of the analysis type.                                             |
| analysis         | string                 | The current analysis text, updated as streaming data is received.           |
| selectedChoices  | AoiChoiceData[]        | The list of selected choices relevant to the analysis.                      |
| serverApi        | AoiServerApi           | The API client for server communication (instantiated in the constructor).  |

## Methods

| Name                | Parameters                                                                 | Return Type         | Description                                                                                      |
|---------------------|----------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------|
| constructor         | -                                                                          | void                | Initializes the component and creates a new `AoiServerApi` instance.                             |
| connectedCallback   | -                                                                          | Promise<void>       | Lifecycle method called when the element is added to the DOM. Adds event listener for streaming. |
| disconnectedCallback| -                                                                          | void                | Lifecycle method called when the element is removed from the DOM. Removes event listener.         |
| streamAnalysis      | -                                                                          | Promise<void>       | Fetches and streams the analysis from the server, updating `analysis` and `selectedChoices`.     |
| renderChoice        | index: number, result: AoiChoiceData                                       | unknown             | Renders a single choice (answer) in the analysis UI.                                             |
| addChatBotElement   | wsMessage: YpAssistantMessage                                              | Promise<void>       | Handles incoming websocket messages and updates the analysis text accordingly.                    |
| render              | -                                                                          | unknown             | Renders the main content of the component, including choices and the analysis markdown.           |
| styles (static)     | -                                                                          | CSSResultGroup[]    | Returns the component's styles, including responsive design.                                      |

## Examples

```typescript
import './aoi-streaming-analysis.js';

const analysisElement = document.createElement('aoi-streaming-analysis');
analysisElement.earl = earlData;
analysisElement.groupId = 123;
analysisElement.group = groupData;
analysisElement.analysisIndex = 0;
analysisElement.analysisTypeIndex = 1;
document.body.appendChild(analysisElement);
```
