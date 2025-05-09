# Utility Module: airbrake.js

This module conditionally initializes and exports an [Airbrake](https://airbrake.io/) Notifier instance for error tracking and reporting, based on the presence of the `AIRBRAKE_PROJECT_ID` environment variable. If the required environment variables are not set or initialization fails, the module exports `undefined`.

## Description

- If `process.env.AIRBRAKE_PROJECT_ID` is defined, the module attempts to create an Airbrake Notifier instance using the provided project ID and API key.
- If initialization fails (e.g., due to invalid credentials or missing dependencies), the error is logged to the console and `null` is exported.
- If `process.env.AIRBRAKE_PROJECT_ID` is not set, the module does not export anything.

## Exported Value

| Name      | Type                                | Description                                                                                 |
|-----------|-------------------------------------|---------------------------------------------------------------------------------------------|
| airBrake  | Airbrake.Notifier \| null \| undefined | The Airbrake Notifier instance, or `null` if initialization failed, or `undefined` if not configured. |

## Configuration

The following environment variables must be set for Airbrake to be initialized:

| Name                   | Type   | Description                                      | Required |
|------------------------|--------|--------------------------------------------------|----------|
| AIRBRAKE_PROJECT_ID    | string | Airbrake project ID                              | Yes      |
| AIRBRAKE_API_KEY       | string | Airbrake project API key                         | Yes      |

## Usage Example

```javascript
const airBrake = require('./airbrake');

if (airBrake) {
  airBrake.notify(new Error('Something went wrong!'));
}
```

## Error Handling

- If the Airbrake Notifier cannot be initialized (e.g., due to invalid configuration), the error is logged to the console and `null` is exported.
- If the required environment variable `AIRBRAKE_PROJECT_ID` is not set, the module does not export anything.

## Dependencies

- [@airbrake/node](https://www.npmjs.com/package/@airbrake/node)

## Notes

- This module is typically used as a singleton utility throughout the application to report errors to Airbrake.
- If you require this module in a file and the environment is not configured for Airbrake, the result will be `undefined`.
- If you want to ensure that Airbrake is always available, you should check for its existence before using it.

---

**See also:**  
- [@airbrake/node documentation](https://github.com/airbrake/node)