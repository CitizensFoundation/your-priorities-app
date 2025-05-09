# Service Module: MarketingWorker

The `MarketingWorker` module is responsible for processing marketing-related work packages, such as sending campaigns. It acts as a worker that receives work packages (jobs) and delegates them to the appropriate handler based on their type. This module is typically used in a background job processing context, such as with a queue system.

## Methods

| Name      | Parameters                                      | Return Type | Description                                                                 |
|-----------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| process   | workPackage: object, callback: (error?: any) => void | void        | Processes a marketing work package by delegating to the appropriate handler. |

---

## Method: MarketingWorker.process

Processes a marketing work package. Currently, it supports the `send-campaign` type, which triggers the sending of a marketing campaign. If the work package type is unknown, it returns an error via the callback.

### Parameters

| Name        | Type                                | Description                                                                 |
|-------------|-------------------------------------|-----------------------------------------------------------------------------|
| workPackage | object                              | The work package object containing details about the marketing job to process. Must include a `type` property. |
| callback    | (error?: any) => void               | Callback function to be called after processing. Receives an error if one occurs. |

#### workPackage Object Schema

| Property | Type   | Description                                  | Required |
|----------|--------|----------------------------------------------|----------|
| type     | string | The type of marketing work to process. Supported: `"send-campaign"` | Yes      |
| ...      | any    | Additional properties required by the specific work type. | No       |

### Usage Example

```javascript
const marketingWorker = require('./path/to/marketing_worker.cjs');

const workPackage = {
  type: 'send-campaign',
  // ...other campaign-specific properties
};

marketingWorker.process(workPackage, (err) => {
  if (err) {
    console.error('Failed to process work package:', err);
  } else {
    console.log('Work package processed successfully.');
  }
});
```

### Behavior

- If `workPackage.type` is `'send-campaign'`, it calls [sendCampaign](../engine/marketing/campaign.cjs) with the work package and callback.
- For any other type, it calls the callback with an error message indicating an unknown type.

### Error Handling

If the work package type is not recognized, the callback is invoked with an error string:

```json
{
  "error": "Unknown type for workPackage: <type>"
}
```

---

## Dependencies

- [async](https://caolan.github.io/async/)
- [models](../../models/index.cjs)
- [logger](../utils/logger.cjs)
- [queue](./queue.cjs)
- [i18n](../utils/i18n.cjs)
- [toJson](../utils/to_json.cjs)
- [lodash](https://lodash.com/)
- [fs](https://nodejs.org/api/fs.html)
- [sendCampaign](../engine/marketing/campaign.cjs)
- [airbrake](../utils/airbrake.cjs) (conditionally loaded if `AIRBRAKE_PROJECT_ID` is set)

---

## Export

This module exports a singleton instance of `MarketingWorker`:

```javascript
module.exports = new MarketingWorker();
```

---

## See Also

- [sendCampaign](../engine/marketing/campaign.cjs)
- [queue](./queue.cjs)
- [logger](../utils/logger.cjs)
- [airbrake](../utils/airbrake.cjs)
