# Script: addAllPlausibleGoals Runner

This script is a standalone Node.js executable that triggers the addition of all Plausible Analytics goals by invoking the `addAllPlausibleGoals` function from the Plausible analytics manager module. It is typically used for batch or administrative operations to ensure all required goals are registered in the Plausible analytics system.

---

## Overview

- **Purpose:** Runs the `addAllPlausibleGoals` function to register all Plausible Analytics goals.
- **Execution:** Immediately invoked asynchronous function (IIFE).
- **Error Handling:** Logs errors to the console and exits the process with a failure code if an error occurs.
- **Success Handling:** Logs "All done" and exits the process with a success code.

---

## Dependencies

- [`addAllPlausibleGoals`](../../engine/analytics/plausible/manager)  
  Function responsible for adding all Plausible Analytics goals.  
  See: [manager.js documentation](../../engine/analytics/plausible/manager.md)

---

## Script Execution Flow

1. **Invoke `addAllPlausibleGoals`:**  
   Calls the function to add all Plausible goals.

2. **Success:**  
   - Logs `"All done"` to the console.
   - Exits the process with code `0`.

3. **Failure:**  
   - Logs the error to the console.
   - Exits the process with code `1`.

---

## Usage

This script is intended to be run from the command line:

```bash
node path/to/this/script.js
```

No arguments are required.

---

## Example Output

**On Success:**
```
All done
```

**On Error:**
```
Error: <error message>
```

---

## Exported Constants

_None._  
This script does not export any constants or functions; it is intended for direct execution.

---

## Related Modules

- [addAllPlausibleGoals (manager.js)](../../engine/analytics/plausible/manager.md)  
  The core function invoked by this script.

---

## Configuration

_No configuration required._  
All configuration is handled internally by the `addAllPlausibleGoals` function.

---

## Notes

- The script uses `process.exit()` to terminate the Node.js process after completion or error.
- Ensure that the environment is properly configured for Plausible Analytics before running this script.

---

## See Also

- [Plausible Analytics Documentation](https://plausible.io/docs/)
- [manager.js Documentation](../../engine/analytics/plausible/manager.md)