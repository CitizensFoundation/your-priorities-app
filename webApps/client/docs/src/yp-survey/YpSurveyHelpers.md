# YpSurveyHelpers

Brief description of the class.

## Methods

| Name                          | Parameters                                  | Return Type | Description                                         |
|-------------------------------|---------------------------------------------|-------------|-----------------------------------------------------|
| getQuestionLengthWithSubOptions | questions: Array<YpStructuredQuestionData> | number      | Calculates the total length of questions including sub-options for radios, checkboxes, and dropdowns. |

## Examples

```typescript
// Example usage of the static method getQuestionLengthWithSubOptions
const questions: Array<YpStructuredQuestionData> = [
  {
    type: 'radios',
    radioButtons: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ]
  },
  {
    type: 'checkboxes',
    checkboxes: [
      { label: 'Check 1', value: '1' },
      { label: 'Check 2', value: '2' }
    ]
  }
];

const totalLength = YpSurveyHelpers.getQuestionLengthWithSubOptions(questions);
console.log(totalLength); // Output will depend on the structure of the questions array
```

Please note that the `YpStructuredQuestionData` type is not defined in the provided code snippet. You would need to define this type in your codebase for the above example to work correctly.