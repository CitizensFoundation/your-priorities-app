/** @returns {import("sequelize").Includeable[]} */
export function activitiesDefaultIncludes(options: any): import("sequelize").Includeable[];
export function getCommonWhereOptions(options: any): {
    status: string;
    deleted: boolean;
};
export function getCommonWhereDateOptions(options: any): {};
export var defaultKeyActivities: string[];
export var excludeActivitiesFromFilter: string[];
export function getActivityDate(options: any, callback: any): void;
export function getProcessedRange(options: any, callback: any): void;
export function getNewsFeedDate(options: any, type: any, callback: any): void;
