export function getPointDomainIncludes(id: any): {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpPostData, Partial<YpPostData>> & YpPostData>;
    required: boolean;
    attributes: never[];
    include: {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
        required: boolean;
        attributes: never[];
        include: {
            model: import("sequelize").ModelStatic<import("sequelize").Model<YpCommunityData, Partial<YpCommunityData>> & YpCommunityData>;
            required: boolean;
            attributes: never[];
            include: {
                model: import("sequelize").ModelStatic<import("sequelize").Model<YpDomainData, Partial<YpDomainData>> & YpDomainData>;
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
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
    required: boolean;
    attributes: never[];
    include: {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpCommunityData, Partial<YpCommunityData>> & YpCommunityData>;
        required: boolean;
        attributes: never[];
        include: {
            model: import("sequelize").ModelStatic<import("sequelize").Model<YpDomainData, Partial<YpDomainData>> & YpDomainData>;
            where: {
                id: any;
            };
            required: boolean;
            attributes: never[];
        }[];
    }[];
}[];
export function getPointCommunityIncludes(id: any): {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpPostData, Partial<YpPostData>> & YpPostData>;
    required: boolean;
    attributes: never[];
    include: {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
        required: boolean;
        attributes: never[];
        include: {
            model: import("sequelize").ModelStatic<import("sequelize").Model<YpCommunityData, Partial<YpCommunityData>> & YpCommunityData>;
            where: {
                id: any;
            };
            required: boolean;
            attributes: never[];
        }[];
    }[];
}[];
export function getCommunityIncludes(id: any): {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
    required: boolean;
    attributes: never[];
    include: {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpCommunityData, Partial<YpCommunityData>> & YpCommunityData>;
        where: {
            id: any;
        };
        required: boolean;
        attributes: never[];
    }[];
}[];
export function getPointGroupIncludes(id: any): {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpPostData, Partial<YpPostData>> & YpPostData>;
    required: boolean;
    attributes: never[];
    include: {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
        required: boolean;
        where: {
            id: any;
        };
        attributes: never[];
    }[];
}[];
export function getGroupIncludes(id: any): {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
    required: boolean;
    where: {
        id: any;
    };
    attributes: never[];
}[];
export function countModelRowsByTimePeriod(req: any, cacheKey: any, model: any, whereOptions: any, includeOptions: any, done: any): void;
