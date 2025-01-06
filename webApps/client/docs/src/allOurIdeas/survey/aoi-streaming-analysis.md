# AoiStreamingAnalysis

The `AoiStreamingAnalysis` class is a custom web component that extends `YpStreamingLlmBase`. It is designed to handle streaming analysis of survey data, interact with a server API, and render choices and analysis results.

## Properties

| Name              | Type                | Description                                                                 |
|-------------------|---------------------|-----------------------------------------------------------------------------|
| earl              | AoiEarlData         | The data related to the EARL (Entity-Attribute-Relation-Label) analysis.    |
| groupId           | number              | The ID of the group associated with the analysis.                           |
| group             | YpGroupData         | The data related to the group being analyzed.                               |
| analysisIndex     | number              | The index of the analysis being performed.                                  |
| analysisTypeIndex | number              | The index of the type of analysis being performed.                          |
| analysis          | string              | The current analysis text being generated or displayed.                     |
| selectedChoices   | AoiChoiceData[]     | An array of selected choices from the analysis.                             |
| serverApi         | AoiServerApi        | An instance of the server API used to fetch survey analysis data.           |

## Methods

| Name              | Parameters                          | Return Type | Description                                                                 |
|-------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback | None                                | Promise<void> | Lifecycle method called when the element is added to the document.          |
| disconnectedCallback | None                             | void        | Lifecycle method called when the element is removed from the document.      |
| streamAnalysis    | None                                | Promise<void> | Fetches and processes survey analysis data from the server API.             |
| renderChoice      | index: number, result: AoiChoiceData | TemplateResult | Renders a choice result as a HTML template.                                 |
| addChatBotElement | wsMessage: YpAssistantMessage       | Promise<void> | Processes WebSocket messages and updates the analysis text accordingly.     |

## Events

- **yp-ws-opened**: Triggered when the WebSocket connection is opened, initiating the streaming analysis process.

## Examples

```typescript
// Example usage of the aoi-streaming-analysis component
import './path/to/aoi-streaming-analysis.js';

const analysisElement = document.createElement('aoi-streaming-analysis');
analysisElement.groupId = 123;
analysisElement.analysisIndex = 0;
analysisElement.analysisTypeIndex = 1;
document.body.appendChild(analysisElement);
```