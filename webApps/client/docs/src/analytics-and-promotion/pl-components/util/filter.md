# FILTER_GROUPS

Constant that defines groups of related filters for analytics queries.

## Properties

| Name          | Type                                  | Description               |
|---------------|---------------------------------------|---------------------------|
| FILTER_GROUPS | Record<string, string[]>              | Maps filter group names to arrays of related filter names. |

# getFormState

Function that returns the state of a form based on the provided filter group and query data.

## Methods

| Name          | Parameters                                      | Return Type | Description                 |
|---------------|-------------------------------------------------|-------------|-----------------------------|
| getFormState  | filterGroup: string, query: PlausibleQueryData | any         | Returns an object representing the state of a form for a given filter group and query data. |

# FILTER_TYPES

Constant that defines the types of filters available.

## Properties

| Name         | Type   | Description               |
|--------------|--------|---------------------------|
| FILTER_TYPES | object | Maps filter type names to their string representations. |

# FILTER_PREFIXES

Constant that defines the prefixes used for different filter types.

## Properties

| Name            | Type   | Description               |
|-----------------|--------|---------------------------|
| FILTER_PREFIXES | object | Maps filter types to their corresponding prefixes. |

# toFilterType

Function that determines the filter type based on a given value.

## Methods

| Name         | Parameters       | Return Type | Description                 |
|--------------|------------------|-------------|-----------------------------|
| toFilterType | value: string    | string      | Returns the filter type for a given value. |

# valueWithoutPrefix

Function that removes the filter prefix from a given value.

## Methods

| Name              | Parameters       | Return Type | Description                 |
|-------------------|------------------|-------------|-----------------------------|
| valueWithoutPrefix| value: string    | string      | Returns the value without its filter prefix. |

# toFilterQuery

Function that constructs a filter query string from a value and type.

## Methods

| Name           | Parameters                  | Return Type | Description                 |
|----------------|-----------------------------|-------------|-----------------------------|
| toFilterQuery  | value: string, type: string | string      | Returns a filter query string based on the provided value and type. |

# supportsContains

Function that checks if a filter supports the 'contains' type.

## Methods

| Name             | Parameters            | Return Type | Description                 |
|------------------|-----------------------|-------------|-----------------------------|
| supportsContains | filterName: string    | boolean     | Returns true if the filter supports the 'contains' type, false otherwise. |

# supportsIsNot

Function that checks if a filter supports the 'is not' type.

## Methods

| Name            | Parameters            | Return Type | Description                 |
|-----------------|-----------------------|-------------|-----------------------------|
| supportsIsNot   | filterName: string    | boolean     | Returns true if the filter supports the 'is not' type, false otherwise. |

# withIndefiniteArticle

Function that returns a word with the appropriate indefinite article.

## Methods

| Name                   | Parameters         | Return Type | Description                 |
|------------------------|--------------------|-------------|-----------------------------|
| withIndefiniteArticle  | word: string       | string      | Returns the word with the correct indefinite article ('a' or 'an'). |

# formatFilterGroup

Function that formats a filter group name for display.

## Methods

| Name              | Parameters              | Return Type | Description                 |
|-------------------|-------------------------|-------------|-----------------------------|
| formatFilterGroup | filterGroup: string     | string      | Returns a formatted string representing the filter group name. |

# filterGroupForFilter

Function that returns the filter group for a given filter.

## Methods

| Name                  | Parameters          | Return Type | Description                 |
|-----------------------|---------------------|-------------|-----------------------------|
| filterGroupForFilter  | filter: string      | string      | Returns the filter group name for a given filter. |