export function formatISO(date) {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
}
export function shiftMonths(date, months) {
    const newDate = new Date(date.getTime());
    const d = newDate.getDate();
    newDate.setMonth(newDate.getMonth() + months);
    if (newDate.getDate() !== d) {
        newDate.setDate(0);
    }
    return newDate;
}
export function shiftDays(date, days) {
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
export function formatMonthYYYY(date) {
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
export function formatYear(date) {
    return `Year of ${date.getFullYear()}`;
}
export function formatDay(date) {
    const weekday = DAYS_ABBREV[date.getDay()];
    if (date.getFullYear() !== (new Date()).getFullYear()) {
        return `${weekday}, ${date.getDate()} ${formatMonthShort(date)} ${date.getFullYear()}`;
    }
    else {
        return `${weekday}, ${date.getDate()} ${formatMonthShort(date)}`;
    }
}
export function formatDayShort(date) {
    return `${date.getDate()} ${formatMonthShort(date)}`;
}
export function parseUTCDate(dateString) {
    let date;
    // Safari Compatibility
    if (typeof dateString === "string" && dateString.includes(' ')) {
        const parts = dateString.split(/[^0-9]/).map(part => parseInt(part, 10));
        parts[1] -= 1; // Adjust for month index
        //@ts-ignore
        date = new Date(...parts);
    }
    else {
        date = new Date(dateString);
    }
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}
export function nowForSite(site) {
    const browserOffset = (new Date()).getTimezoneOffset() * 60;
    return new Date(new Date().getTime() + (site.offset * 1000) + (browserOffset * 1000));
}
export function lastMonth(site) {
    return shiftMonths(nowForSite(site), -1);
}
export function isSameMonth(date1, date2) {
    return formatMonthYYYY(date1) === formatMonthYYYY(date2);
}
export function isToday(site, date) {
    return formatISO(date) === formatISO(nowForSite(site));
}
export function isThisMonth(site, date) {
    return formatMonthYYYY(date) === formatMonthYYYY(nowForSite(site));
}
export function isThisYear(site, date) {
    return date.getFullYear() === nowForSite(site).getFullYear();
}
export function isBefore(date1, date2, period) {
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
export function isAfter(date1, date2, period) {
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
function formatMonthShort(date) {
    return `${MONTHS[date.getMonth()].substring(0, 3)}`;
}
//# sourceMappingURL=date.js.map