# AoiStreamingAnalysis

A custom element that handles the streaming analysis of survey data, displaying choices and analysis content. It extends `YpStreamingLlmBase` and integrates with a server API to fetch and stream analysis data.

## Properties

| Name             | Type                        | Description                                                                 |
|------------------|-----------------------------|-----------------------------------------------------------------------------|
| earl             | AoiEarlData                 | Data related to the EARL (Early Analysis of Response Logic).                |
| groupId          | number                      | The ID of the group associated with the analysis.                           |
| group            | YpGroupData                 | Data about the group associated with the analysis.                          |
| analysisIndex    | number                      | The index of the current analysis.                                          |
| analysisTypeIndex| number                      | The index of the type of analysis being performed.                          |
| analysis         | string                      | The analysis content as a string of markdown-formatted text.                |
| selectedChoices  | AoiChoiceData[]             | An array of choices selected for the analysis.                              |
| serverApi        | AoiServerApi                | An instance of `AoiServerApi` for server interactions.                      |

## Methods

| Name               | Parameters                  | Return Type | Description                                                                 |
|--------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback  |                             | void        | Lifecycle method that runs when the element is added to the document's DOM. |
| disconnectedCallback|                            | void        | Lifecycle method that runs when the element is removed from the document's DOM. |
| streamAnalysis     |                             | Promise<void>| Initiates the streaming of analysis data from the server.                   |
| renderChoice       | index: number, result: AoiChoiceData | TemplateResult | Renders a single choice from the analysis data.                            |
| addChatBotElement  | wsMessage: PsAiChatWsMessage| Promise<void>| Handles the addition of chatbot elements based on websocket messages.      |

## Events

- **yp-ws-opened**: Emitted when the websocket connection is opened and triggers the streaming analysis.

## Examples

```typescript
// Example usage of the AoiStreamingAnalysis element
<aoi-streaming-analysis
  .earl="${earlData}"
  .groupId="${groupId}"
  .group="${groupData}"
  .analysisIndex="${analysisIndex}"
  .analysisTypeIndex="${analysisTypeIndex}"
  .selectedChoices="${selectedChoices}"
></aoi-streaming-analysis>
```

Please note that the actual data structures such as `AoiEarlData`, `YpGroupData`, `AoiChoiceData`, and `PsAiChatWsMessage` are not detailed here and should be defined elsewhere in your codebase.