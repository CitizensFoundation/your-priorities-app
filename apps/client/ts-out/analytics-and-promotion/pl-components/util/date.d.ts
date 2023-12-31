export declare function formatISO(date: Date): string;
export declare function shiftMonths(date: Date, months: number): Date;
export declare function shiftDays(date: Date, days: number): Date;
export declare function formatMonthYYYY(date: Date): string;
export declare function formatYear(date: Date): string;
export declare function formatDay(date: Date): string;
export declare function formatDayShort(date: Date): string;
export declare function parseUTCDate(dateString: string): Date;
export declare function nowForSite(site: PlausibleSiteData): Date;
export declare function lastMonth(site: PlausibleSiteData): Date;
export declare function isSameMonth(date1: Date, date2: Date): boolean;
export declare function isToday(site: PlausibleSiteData, date: Date): boolean;
export declare function isThisMonth(site: PlausibleSiteData, date: Date): boolean;
export declare function isThisYear(site: PlausibleSiteData, date: Date): boolean;
export declare function isBefore(date1: Date, date2: Date, period: 'day' | 'month' | 'year'): boolean;
export declare function isAfter(date1: Date, date2: Date, period: 'day' | 'month' | 'year'): boolean;
//# sourceMappingURL=date.d.ts.map