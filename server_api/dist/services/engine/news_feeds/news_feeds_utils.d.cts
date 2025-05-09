export function activitiesDefaultIncludes(options: any): ({
    model: any;
    required: boolean;
    attributes: any;
    where?: undefined;
    include?: undefined;
} | {
    model: any;
    required: boolean;
    attributes: any;
    where: {
        access: any;
        $or?: undefined;
    };
    include?: undefined;
} | {
    model: any;
    required: boolean;
    attributes: any;
    where: {
        $or: {
            access: any;
        }[];
        access?: undefined;
    };
    include: {
        model: any;
        as: string;
        attributes: any;
        required: boolean;
    }[];
} | {
    model: any;
    required: boolean;
    attributes: any;
    include: ({
        model: any;
        required: boolean;
        attributes: string[];
        as?: undefined;
        include?: undefined;
    } | {
        model: any;
        as: string;
        attributes: any;
        required: boolean;
        include?: undefined;
    } | {
        model: any;
        required: boolean;
        include: {
            model: any;
            attributes: any;
            required: boolean;
            as: string;
        }[];
        attributes?: undefined;
        as?: undefined;
    })[];
    where?: undefined;
} | {
    model: any;
    required: boolean;
    attributes: any[];
    include: ({
        model: any;
        attributes: any;
        include: {
            model: any;
            attributes: any;
            required: boolean;
        }[];
        required: boolean;
        as?: undefined;
    } | {
        model: any;
        required: boolean;
        attributes: string[];
        as: string;
        include?: undefined;
    } | {
        model: any;
        attributes: string[];
        required: boolean;
        include?: undefined;
        as?: undefined;
    })[];
    where?: undefined;
})[];
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
