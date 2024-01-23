# DateUtils

Utilities for manipulating and formatting JavaScript Date objects.

## Methods

| Name            | Parameters                  | Return Type | Description                                                                 |
|-----------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| formatISO       | date: Date                  | string      | Converts a Date object to an ISO date string (YYYY-MM-DD).                  |
| shiftMonths     | date: Date, months: number  | Date        | Shifts the given date by a specified number of months.                      |
| shiftDays       | date: Date, days: number    | Date        | Shifts the given date by a specified number of days.                        |
| formatMonthYYYY | date: Date                  | string      | Formats the given date as "Month YYYY".                                     |
| formatYear      | date: Date                  | string      | Formats the given date as "Year of YYYY".                                   |
| formatDay       | date: Date                  | string      | Formats the given date with the weekday and date, including the year if not the current year. |
| formatDayShort  | date: Date                  | string      | Formats the given date as "DD MonthShort".                                  |
| parseUTCDate    | dateString: string          | Date        | Parses a date string into a Date object, considering UTC.                   |
| nowForSite      | site: PlausibleSiteData     | Date        | Returns the current date and time for a given site.                         |
| lastMonth       | site: PlausibleSiteData     | Date        | Returns the date one month prior to the current date for a given site.      |
| isSameMonth     | date1: Date, date2: Date    | boolean     | Checks if two dates are in the same month and year.                         |
| isToday         | site: PlausibleSiteData, date: Date | boolean | Checks if the given date is today for a given site.                         |
| isThisMonth     | site: PlausibleSiteData, date: Date | boolean | Checks if the given date is in the current month for a given site.          |
| isThisYear      | site: PlausibleSiteData, date: Date | boolean | Checks if the given date is in the current year for a given site.           |
| isBefore        | date1: Date, date2: Date, period: 'day' \| 'month' \| 'year' | boolean | Checks if date1 is before date2 within the specified period.                |
| isAfter         | date1: Date, date2: Date, period: 'day' \| 'month' \| 'year' | boolean | Checks if date1 is after date2 within the specified period.                 |

## Examples

```typescript
// Example usage of formatISO
const date = new Date('2023-04-15T12:00:00Z');
const isoDateString = formatISO(date); // "2023-04-15"

// Example usage of shiftMonths
const shiftedDate = shiftMonths(new Date('2023-04-15'), 2); // Date object representing "2023-06-15"

// Example usage of isToday
const siteData = { offset: -18000 }; // Example site data with timezone offset
const today = new Date();
const isTodayResult = isToday(siteData, today); // true or false depending on the current date and site's timezone
```

Note: `PlausibleSiteData` is a type used in the `nowForSite`, `lastMonth`, `isToday`, `isThisMonth`, and `isThisYear` methods, which should include a timezone offset property. However, the full definition of `PlausibleSiteData` is not provided in the given context.