# PlausibleFadeIn

A custom web component that conditionally applies fade-in animation styles to its content based on a `show` property.

## Properties

| Name        | Type                  | Description                                      |
|-------------|-----------------------|--------------------------------------------------|
| show        | Boolean               | Determines whether the fade-in style is applied. |
| myClassName | String \| undefined   | An optional class name to add to the container.  |

## Methods

| Name    | Parameters | Return Type | Description                                      |
|---------|------------|-------------|--------------------------------------------------|
| render  |            | TemplateResult | Generates a template result with the appropriate classes based on the `show` property. |

## Events

None.

## Examples

```typescript
// Example usage of the PlausibleFadeIn web component
<pl-fade-in show myClassName="custom-class">
  <!-- Content to fade in goes here -->
</pl-fade-in>
```

Note: The `show` attribute is a boolean attribute. If it is present without a value, it is considered to be `true`. The `myClassName` attribute is optional and can be used to add additional custom classes to the element.