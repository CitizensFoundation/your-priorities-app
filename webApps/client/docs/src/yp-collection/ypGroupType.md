# YpGroupType

An enumeration representing different types of group categories.

## Properties

| Name                     | Type | Description                                      |
|--------------------------|------|--------------------------------------------------|
| IdeaGenerationAndDebate  | 0    | Represents a group type for idea generation and debate. |
| AllOurIdeas              | 1    | Represents a group type for all our ideas.       |
| StaticHtml               | 2    | Represents a group type for static HTML content. |
| PsAgentWorkflow          | 3    | Represents a group type for PS agent workflow.   |
| Folder                   | 4    | Represents a group type for a folder.            |

## Methods

This enumeration does not have methods.

## Events

This enumeration does not emit events.

## Examples

```typescript
// Example usage of the YpGroupType enumeration
const groupType: YpGroupType = YpGroupType.IdeaGenerationAndDebate;

switch (groupType) {
  case YpGroupType.IdeaGenerationAndDebate:
    console.log("Group type is for idea generation and debate.");
    break;
  case YpGroupType.AllOurIdeas:
    console.log("Group type is for all our ideas.");
    break;
  case YpGroupType.StaticHtml:
    console.log("Group type is for static HTML content.");
    break;
  case YpGroupType.PsAgentWorkflow:
    console.log("Group type is for PS agent workflow.");
    break;
  case YpGroupType.Folder:
    console.log("Group type is for a folder.");
    break;
}
```