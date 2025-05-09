export function commonIndexForActivitiesAndNewsFeeds(createdAtField: any): {
    fields: any[];
    where: {
        status: string;
        deleted: boolean;
    };
}[];
