# PsAiModelSelector

The `PsAiModelSelector` is a web component that allows users to select AI models and reasoning models based on their size and type. It provides a user interface for filtering and selecting models from a list of active AI models.

## Properties

| Name                    | Type                                                                 | Description                                                                 |
|-------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `activeAiModels`        | `PsAiModelAttributes[]`                                              | An array of active AI models available for selection.                       |
| `requestedAiModelSizes` | `PsAiModelSize[]`                                                    | An array of requested AI model sizes to be displayed in the selector.       |
| `currentModels`         | `{ [key in PsAiModelSize]?: PsAiModelAttributes | null }`                               | An object mapping AI model sizes to the currently selected AI models.       |
| `currentReasoningModels`| `{ [key in PsAiModelSize]?: PsAiModelAttributes | null }`                               | An object mapping AI model sizes to the currently selected reasoning models.|

## Methods

| Name                               | Parameters                                      | Return Type | Description                                                                 |
|------------------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| `updated`                          | `changedProperties: Map<string, any>`           | `void`      | Lifecycle method called when properties change, triggers model filtering.   |
| `filterAiModels`                   |                                                 | `void`      | Filters the active AI models based on size and type, excluding reasoning models. |
| `filterReasoningModels`            |                                                 | `void`      | Filters the active AI models to include only reasoning models based on size.|
| `isReasoningModel`                 | `modelType: PsAiModelType`                      | `boolean`   | Determines if a model type is a reasoning model.                            |
| `initializeSelectedModels`         |                                                 | `void`      | Initializes the selected AI model IDs based on current models.              |
| `initializeSelectedReasoningModels`|                                                 | `void`      | Initializes the selected reasoning model IDs based on current reasoning models. |
| `render`                           |                                                 | `TemplateResult` | Renders the component's HTML template.                                      |
| `renderAiModelSelect`              | `size: PsAiModelSize`                           | `TemplateResult` | Renders the AI model selection dropdown for a given size.                   |
| `renderReasoningModelSelect`       | `size: PsAiModelSize`                           | `TemplateResult` | Renders the reasoning model selection dropdown for a given size.            |
| `getLocalizedModelLabel`           | `size: PsAiModelSize`                           | `string`    | Returns a localized label for the AI model selection based on size.         |
| `getLocalizedReasoningModelLabel`  | `size: PsAiModelSize`                           | `string`    | Returns a localized label for the reasoning model selection based on size.  |
| `_handleAiModelSelection`          | `e: Event, size: PsAiModelSize`                 | `void`      | Handles the selection of an AI model from the dropdown.                     |
| `_handleAiReasoningModelSelection` | `e: Event, size: PsAiModelSize`                 | `void`      | Handles the selection of a reasoning model from the dropdown.               |
| `_handleRemoveModel`               | `size: PsAiModelSize`                           | `void`      | Removes the selected AI model for a given size.                             |
| `_handleRemoveReasoningModel`      | `size: PsAiModelSize`                           | `void`      | Removes the selected reasoning model for a given size.                      |
| `_emitChangeEvent`                 |                                                 | `void`      | Emits a custom event when the selected models change.                       |

## Events

- **ai-models-changed**: Emitted when the selected AI models or reasoning models change. Contains details of the selected model IDs.

## Examples

```typescript
// Example usage of the ps-ai-model-selector component
import './ps-ai-model-selector.js';

const modelSelector = document.createElement('ps-ai-model-selector');
modelSelector.activeAiModels = [
  { id: 1, name: 'Model A', configuration: { modelSize: 'small', type: 'text' } },
  { id: 2, name: 'Model B', configuration: { modelSize: 'medium', type: 'text' } },
];
modelSelector.requestedAiModelSizes = ['small', 'medium'];
document.body.appendChild(modelSelector);

modelSelector.addEventListener('ai-models-changed', (event) => {
  console.log('Selected AI Models:', event.detail.selectedAiModelIds);
  console.log('Selected Reasoning Models:', event.detail.selectedReasoningModelIds);
});
```