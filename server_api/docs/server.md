# API Entry Point: index.js

This file serves as the main entry point for the application. It initializes and starts the YourPrioritiesApi server.

---

## Initialization

The application imports the `YourPrioritiesApi` class from the `app.js` module and creates an instance of it, specifying the port number (8000) on which the server should listen.

```typescript
import { YourPrioritiesApi } from './app.js';

const app = new YourPrioritiesApi(
  8000
);

app.listen();
```

---

## Components

### Class: YourPrioritiesApi

- **Source:** [app.js](./app.md)
- **Description:** The main API application class responsible for configuring and running the Express.js server, including route registration, middleware setup, and server startup.

---

## Usage

```typescript
import { YourPrioritiesApi } from './app.js';

const app = new YourPrioritiesApi(8000);
app.listen();
```

- **Port:** The server will listen on port `8000`.

---

## Exported Constants

None.

---

## Configuration

- **Port:** `8000` (hardcoded in this entry point; can be changed as needed).

---

## Example

To start the API server, simply run this file with Node.js:

```bash
node index.js
```

---

## Related Documentation

- [YourPrioritiesApi (app.js)](./app.md)

---

## Notes

- This file does not define any routes, middleware, controllers, or services directly. All such logic is encapsulated within the [YourPrioritiesApi](./app.md) class.
- For details on API endpoints, middleware, and other components, refer to the documentation for [app.js](./app.md) and related modules.