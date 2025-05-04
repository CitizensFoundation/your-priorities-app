# YpDomainHeader

A custom web component that extends `YpCollectionHeader` to display a domain/group header with media, name, actions, description, and stats. It is styled responsively and conditionally renders content based on the presence of a collection.

## Properties

| Name        | Type                        | Description                                      |
|-------------|-----------------------------|--------------------------------------------------|
| collection  | YpGroupData \| undefined    | The group/domain data to display in the header.  |

## Methods

| Name         | Parameters | Return Type | Description                                                                                 |
|--------------|------------|-------------|---------------------------------------------------------------------------------------------|
| render       | none       | unknown     | Renders the header layout, including media, name, actions, description, stats, and footer.  |

## Examples

```typescript
import "./yp-domain-header";

const groupData: YpGroupData = {
  // ...group data properties
};

const header = document.createElement("yp-domain-header");
header.collection = groupData;
document.body.appendChild(header);
```
