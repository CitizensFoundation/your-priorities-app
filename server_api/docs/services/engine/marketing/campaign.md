# Service Module: sendCampaign

This module provides functionality to send SMS campaigns to users using Twilio, update user send counts, and handle job error reporting. It interacts with several Sequelize models, including `AcCampaign`, `AcList`, `Group`, `AcListUser`, and `AcBackgroundJob`.

---

## Methods

| Name                | Parameters                                   | Return Type | Description                                                                                 |
|---------------------|----------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| sendCampaign        | workPackage: object, callback: Function      | void        | Orchestrates the process of sending a campaign SMS to all users in a list.                  |

---

## Function: sendCampaign

Orchestrates the process of sending a campaign SMS to all users in a list. Handles Twilio client initialization, user iteration, SMS sending, user update, and error reporting.

### Parameters

| Name         | Type     | Description                                                                 |
|--------------|----------|-----------------------------------------------------------------------------|
| workPackage  | object   | Contains `campaignId` and `jobId` for the campaign and background job.      |
| callback     | Function | Callback function to be called on completion or error.                      |

### Process Overview

1. **Fetch Campaign**: Retrieves the campaign and its associated list and group configuration.
2. **Initialize Twilio Client**: (Currently commented out) Would initialize the Twilio client using group configuration.
3. **Fetch List Users**: Retrieves all users in the campaign's list.
4. **Send SMS to Each User**: Iterates over users, sending SMS and updating their sent count.
5. **Error Handling**: If any error occurs, updates the background job with the error.

### Example Usage

```javascript
const { sendCampaign } = require('./path/to/this/module');

const workPackage = {
  campaignId: 123,
  jobId: 456
};

sendCampaign(workPackage, (error) => {
  if (error) {
    console.error('Campaign failed:', error);
  } else {
    console.log('Campaign sent successfully!');
  }
});
```

---

## Internal Functions

### sendSmsToUser

**Purpose:** Sends an SMS to a single user using the Twilio client. (Currently commented out.)

#### Parameters

| Name           | Type     | Description                                      |
|----------------|----------|--------------------------------------------------|
| twilioClient   | object   | Twilio client instance.                          |
| listUser       | object   | User object from AcListUser.                     |
| campaign       | object   | Campaign object.                                 |
| configuration  | object   | Group configuration (contains Twilio credentials).|
| done           | Function | Callback function.                               |

---

### updateListUserSent

**Purpose:** Increments the `sentCount` for a user and saves the update.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| listUser  | object   | User object from AcListUser.       |
| campaign  | object   | Campaign object.                   |
| done      | Function | Callback function.                 |

---

### setJobAndError

**Purpose:** Updates the background job with an error message.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| error     | any      | Error object or message.           |
| done      | Function | Callback function.                 |

---

## Dependencies

- [async](https://caolan.github.io/async/v3/)
- [Sequelize models](../../../models/index.cjs) (AcCampaign, AcList, Group, AcListUser, AcBackgroundJob)
- [Twilio](https://www.twilio.com/docs/libraries/node) (integration currently commented out)

---

## Exported Members

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| sendCampaign | Function | Main function to send a campaign to list users.  |

---

## Related Models

- **AcCampaign**: Represents a campaign to be sent.
- **AcList**: Represents a list of users for the campaign.
- **Group**: Contains configuration, including Twilio credentials.
- **AcListUser**: Represents a user in a list.
- **AcBackgroundJob**: Represents a background job for tracking status/errors.

---

## Notes

- The actual SMS sending logic is currently commented out. To enable, uncomment and provide valid Twilio credentials in the group configuration.
- Error handling is robust, updating the background job with any encountered errors.
- The module is designed for use in background job processing systems.

---

## See Also

- [AcCampaign Model](../../../models/index.cjs)
- [Twilio Node.js Library](https://www.twilio.com/docs/libraries/node)
- [async.eachSeries Documentation](https://caolan.github.io/async/v3/docs.html#eachSeries)
