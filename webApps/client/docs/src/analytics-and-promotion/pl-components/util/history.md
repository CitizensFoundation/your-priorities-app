# Action

Actions represent the type of change to a location value.

## Properties

| Name   | Type   | Description |
|--------|--------|-------------|
| Pop    | string | A POP indicates a change to an arbitrary index in the history stack, such as a back or forward navigation. It does not describe the direction of the navigation, only that the current index changed. Note: This is the default action for newly created history objects. |
| Push   | string | A PUSH indicates a new entry being added to the history stack, such as when a link is clicked and a new page loads. When this happens, all subsequent entries in the stack are lost. |
| Replace| string | A REPLACE indicates the entry at the current index in the history stack being replaced by a new one. |

# Pathname

A URL pathname, beginning with a /.

## Properties

No properties.

# Search

A URL search string, beginning with a ?.

## Properties

No properties.

# Hash

A URL fragment identifier, beginning with a #.

## Properties

No properties.

# State

An object that is used to associate some arbitrary data with a location, but that does not appear in the URL path.

## Properties

No properties.

# Key

A unique string associated with a location. May be used to safely store and retrieve data in some other storage API, like `localStorage`.

## Properties

No properties.

# Path

The pathname, search, and hash values of a URL.

## Properties

| Name     | Type   | Description |
|----------|--------|-------------|
| pathname | string | A URL pathname, beginning with a /. |
| search   | string | A URL search string, beginning with a ?. |
| hash     | string | A URL fragment identifier, beginning with a #. |

# Location

An entry in a history stack. A location contains information about the URL path, as well as possibly some arbitrary state and a key.

## Properties

| Name     | Type   | Description |
|----------|--------|-------------|
| pathname | string | A URL pathname, beginning with a /. |
| search   | string | A URL search string, beginning with a ?. |
| hash     | string | A URL fragment identifier, beginning with a #. |
| state    | unknown| A value of arbitrary data associated with this location. |
| key      | string | A unique string associated with this location. May be used to safely store and retrieve data in some other storage API, like `localStorage`. Note: This value is always "default" on the initial location. |

# PartialPath

A partial Path object that may be missing some properties.

## Properties

No properties.

# PartialLocation

A partial Location object that may be missing some properties.

## Properties

No properties.

# Update

A change to the current location.

## Properties

| Name     | Type     | Description |
|----------|----------|-------------|
| action   | Action   | The action that triggered the change. |
| location | Location | The new location. |

# Listener

A function that receives notifications about location changes.

## Methods

| Name   | Parameters        | Return Type | Description |
|--------|-------------------|-------------|-------------|
| (anon) | update: Update    | void        | A function that is called when the location changes. |

# Transition

A change to the current location that was blocked. May be retried after obtaining user confirmation.

## Properties

| Name     | Type     | Description |
|----------|----------|-------------|
| action   | Action   | The action that triggered the change. |
| location | Location | The new location. |

## Methods

| Name   | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| retry  |            | void        | Retries the update to the current location. |

# Blocker

A function that receives transitions when navigation is blocked.

## Methods

| Name   | Parameters        | Return Type | Description |
|--------|-------------------|-------------|-------------|
| (anon) | tx: Transition    | void        | A function that is called when a transition is blocked. |

# To

Describes a location that is the destination of some navigation, either via `history.push` or `history.replace`. May be either a URL or the pieces of a URL path.

## Properties

No properties.

# History

A history is an interface to the navigation stack. The history serves as the source of truth for the current location, as well as provides a set of methods that may be used to change it.

## Properties

| Name     | Type     | Description |
|----------|----------|-------------|
| action   | Action   | The last action that modified the current location. This will always be Action.Pop when a history instance is first created. This value is mutable. |
| location | Location | The current location. This value is mutable. |

## Methods

| Name       | Parameters                  | Return Type | Description |
|------------|-----------------------------|-------------|-------------|
| createHref | to: To                      | string      | Returns a valid href for the given `to` value that may be used as the value of an <a href> attribute. |
| push       | to: To, state?: any         | void        | Pushes a new location onto the history stack, increasing its length by one. If there were any entries in the stack after the current one, they are lost. |
| replace    | to: To, state?: any         | void        | Replaces the current location in the history stack with a new one. The location that was replaced will no longer be available. |
| go         | delta: number               | void        | Navigates `n` entries backward/forward in the history stack relative to the current index. For example, a "back" navigation would use go(-1). |
| back       |                             | void        | Navigates to the previous entry in the stack. Identical to go(-1). Warning: if the current location is the first location in the stack, this will unload the current document. |
| forward    |                             | void        | Navigates to the next entry in the stack. Identical to go(1). |
| listen     | listener: Listener          | () => void  | Sets up a listener that will be called whenever the current location changes. |
| block      | blocker: Blocker            | () => void  | Prevents the current location from changing and sets up a listener that will be called instead. |

# BrowserHistory

A browser history stores the current location in regular URLs in a web browser environment. This is the standard for most web apps and provides the cleanest URLs the browser's address bar.

## Properties

No additional properties.

# HashHistory

A hash history stores the current location in the fragment identifier portion of the URL in a web browser environment.

## Properties

No additional properties.

# MemoryHistory

A memory history stores locations in memory. This is useful in stateful environments where there is no web browser, such as node tests or React Native.

## Properties

| Name  | Type   | Description |
|-------|--------|-------------|
| index | number | The current index in the history stack. |

# BrowserHistoryOptions

Options for creating a browser history.

## Properties

| Name   | Type   | Description |
|--------|--------|-------------|
| window | Window | The window object. |

# HashHistoryOptions

Options for creating a hash history.

## Properties

| Name   | Type   | Description |
|--------|--------|-------------|
| window | Window | The window object. |

# InitialEntry

A user-supplied object that describes a location. Used when providing entries to `createMemoryHistory` via its `initialEntries` option.

## Properties

No properties.

# MemoryHistoryOptions

Options for creating a memory history.

## Properties

| Name           | Type             | Description |
|----------------|------------------|-------------|
| initialEntries | InitialEntry[]   | The initial entries in the history stack. |
| initialIndex   | number           | The initial index in the history stack. |

# createBrowserHistory

Creates a browser history.

## Methods

| Name       | Parameters                  | Return Type       | Description |
|------------|-----------------------------|-------------------|-------------|
| (function) | options: BrowserHistoryOptions | BrowserHistory | Creates a browser history with the given options. |

# createHashHistory

Creates a hash history.

## Methods

| Name       | Parameters                | Return Type     | Description |
|------------|---------------------------|-----------------|-------------|
| (function) | options: HashHistoryOptions | HashHistory   | Creates a hash history with the given options. |

# createMemoryHistory

Creates a memory history.

## Methods

| Name       | Parameters                  | Return Type       | Description |
|------------|-----------------------------|-------------------|-------------|
| (function) | options: MemoryHistoryOptions | MemoryHistory | Creates a memory history with the given options. |

# createPath

Creates a string URL path from the given pathname, search, and hash components.

## Methods

| Name       | Parameters            | Return Type | Description |
|------------|-----------------------|-------------|-------------|
| (function) | path: Partial<Path>   | string      | Creates a string URL path from the given pathname, search, and hash components. |

# parsePath

Parses a string URL path into its separate pathname, search, and hash components.

## Methods

| Name       | Parameters        | Return Type       | Description |
|------------|-------------------|-------------------|-------------|
| (function) | path: string      | Partial<Path>     | Parses a string URL path into its separate pathname, search, and hash components. |

(Note: The above documentation is a simplified version of the provided TypeScript file, focusing on the main types and their properties and methods. It does not include private functions or utility types that are not part of the public API.)