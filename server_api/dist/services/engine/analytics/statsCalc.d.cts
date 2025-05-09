export function getPointDomainIncludes(id: any): {
    model: any;
    required: boolean;
    attributes: never[];
    include: {
        model: any;
        required: boolean;
        attributes: never[];
        include: {
            model: any;
            required: boolean;
            attributes: never[];
            include: {
                model: any;
                where: {
                    id: any;
                };
                required: boolean;
                attributes: never[];
            }[];
        }[];
    }[];
}[];
export function getDomainIncludes(id: any): {
    model: any;
    required: boolean;
    attributes: never[];
    include: {
        model: any;
        required: boolean;
        attributes: never[];
        include: {
            model: any;
            where: {
                id: any;
            };
            required: boolean;
            attributes: never[];
        }[];
    }[];
}[];
export function getPointCommunityIncludes(id: any): {
    model: any;
    required: boolean;
    attributes: never[];
    include: {
        model: any;
        required: boolean;
        attributes: never[];
        include: {
            model: any;
            where: {
                id: any;
            };
            required: boolean;
            attributes: never[];
        }[];
    }[];
}[];
export function getCommunityIncludes(id: any): {
    model: any;
    required: boolean;
    attributes: never[];
    include: {
        model: any;
        where: {
            id: any;
        };
        required: boolean;
        attributes: never[];
    }[];
}[];
export function getPointGroupIncludes(id: any): {
    model: any;
    required: boolean;
    attributes: never[];
    include: {
        model: any;
        required: boolean;
        where: {
            id: any;
        };
        attributes: never[];
    }[];
}[];
export function getGroupIncludes(id: any): {
    model: any;
    required: boolean;
    where: {
        id: any;
    };
    attributes: never[];
}[];
export function countModelRowsByTimePeriod(req: any, cacheKey: any, model: any, whereOptions: any, includeOptions: any, done: any): void;
