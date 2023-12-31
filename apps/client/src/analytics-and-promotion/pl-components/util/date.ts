export function formatISO(date: Date): string {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    .toISOString()
    .split("T")[0];
}

export function shiftMonths(date: Date, months: number): Date {
  const newDate = new Date(date.getTime());
  const d = newDate.getDate();
  newDate.setMonth(newDate.getMonth() + months);
  if (newDate.getDate() !== d) {
    newDate.setDate(0);
  }
  return newDate;
}

export function shiftDays(date: Date, days: number): Date {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

const MONTHS = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

const DAYS_ABBREV = [
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];

export function formatMonthYYYY(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatYear(date: Date): string {
  return `Year of ${date.getFullYear()}`;
}

export function formatDay(date: Date): string {
  const weekday = DAYS_ABBREV[date.getDay()];
  if (date.getFullYear() !== (new Date()).getFullYear()) {
    return `${weekday}, ${date.getDate()} ${formatMonthShort(date)} ${date.getFullYear()}`;
  } else {
    return `${weekday}, ${date.getDate()} ${formatMonthShort(date)}`;
  }
}

export function formatDayShort(date: Date): string {
  return `${date.getDate()} ${formatMonthShort(date)}`;
}

export function parseUTCDate(dateString: string): Date {
  let date: Date;
  // Safari Compatibility
  if (typeof dateString === "string" && dateString.includes(' ')) {
    const parts = dateString.split(/[^0-9]/).map(part => parseInt(part, 10));
    parts[1] -= 1; // Adjust for month index
    //@ts-ignore
    date = new Date(...parts);
  } else {
    date = new Date(dateString);
  }
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

export function nowForSite(site: PlausibleSiteData): Date {
  const browserOffset = (new Date()).getTimezoneOffset() * 60;
  return new Date(new Date().getTime() + (site.offset! * 1000) + (browserOffset * 1000));
}

export function lastMonth(site: PlausibleSiteData): Date {
  return shiftMonths(nowForSite(site), -1);
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return formatMonthYYYY(date1) === formatMonthYYYY(date2);
}

export function isToday(site: PlausibleSiteData, date: Date): boolean {
  return formatISO(date) === formatISO(nowForSite(site));
}

export function isThisMonth(site: PlausibleSiteData, date: Date): boolean {
  return formatMonthYYYY(date) === formatMonthYYYY(nowForSite(site));
}

export function isThisYear(site: PlausibleSiteData, date: Date): boolean {
  return date.getFullYear() === nowForSite(site).getFullYear();
}

export function isBefore(date1: Date, date2: Date, period: 'day' | 'month' | 'year'): boolean {
  if (date1.getFullYear() !== date2.getFullYear()) {
    return date1.getFullYear() < date2.getFullYear();
  }
  if (period === "year") {
    return false;
  }
  if (date1.getMonth() !== date2.getMonth()) {
    return date1.getMonth() < date2.getMonth();
  }
  if (period === "month") {
    return false;
  }
  return date1.getDate() < date2.getDate();
}

export function isAfter(date1: Date, date2: Date, period: 'day' | 'month' | 'year'): boolean {
  if (date1.getFullYear() !== date2.getFullYear()) {
    return date1.getFullYear() > date2.getFullYear();
  }
  if (period === "year") {
    return false;
  }
  if (date1.getMonth() !== date2.getMonth()) {
    return date1.getMonth() > date2.getMonth();
  }
  if (period === "month") {
    return false;
  }
  return date1.getDate() > date2.getDate();
}

function formatMonthShort(date: Date): string {
  return `${MONTHS[date.getMonth()].substring(0, 3)}`;
}
