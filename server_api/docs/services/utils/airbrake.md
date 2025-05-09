# Utility Module: airbrake.js

This module conditionally initializes and exports an [Airbrake](https://airbrake.io/) Notifier instance for error tracking and reporting, based on the presence of the `AIRBRAKE_PROJECT_ID` environment variable. If the required environment variables are not set or initialization fails, the module exports `null`.

## Description

- If `process.env.AIRBRAKE_PROJECT_ID` is defined, the module attempts to create an Airbrake Notifier instance using the provided project ID and API key.
- If initialization fails (e.g., due to invalid configuration), the error is logged to the console and `null` is exported.
- If `AIRBRAKE_PROJECT_ID` is not set, the module does not export anything.

## Exported Value

| Name      | Type                        | Description                                                                 |
|-----------|-----------------------------|-----------------------------------------------------------------------------|
| airBrake  | Airbrake.Notifier \| null   | An instance of Airbrake Notifier if configured, otherwise `null`.           |

## Configuration

The following environment variables must be set for Airbrake to be initialized:

| Name                   | Type   | Description                                      | Required |
|------------------------|--------|--------------------------------------------------|----------|
| AIRBRAKE_PROJECT_ID    | string | Airbrake project ID                              | Yes      |
| AIRBRAKE_API_KEY       | string | Airbrake project API key                         | Yes      |

## Example Usage

```javascript
const airbrake = require('./airbrake');

if (airbrake) {
  airbrake.notify(new Error('Something went wrong!'));
}
```

## Error Handling

- If the Airbrake Notifier fails to initialize (e.g., due to invalid credentials), the error is logged to the console and `null` is exported.

## Notes

- The module only exports the Airbrake Notifier if the `AIRBRAKE_PROJECT_ID` environment variable is present.
- The `performanceStats` option is explicitly set to `false` to disable performance monitoring.

---

**Related Links:**
- [Airbrake Node.js Documentation](https://github.com/airbrake/node)
