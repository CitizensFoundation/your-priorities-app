export function activitiesDefaultIncludes(options: any): ({
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpUserData, Partial<YpUserData>> & YpUserData>;
    required: boolean;
    attributes: any;
    include: {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpImageData, Partial<YpImageData>> & YpImageData>;
        as: string;
        attributes: any;
        required: boolean;
    }[];
    where?: undefined;
} | {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpDomainData, Partial<YpDomainData>> & YpDomainData>;
    required: boolean;
    attributes: any;
    include?: undefined;
    where?: undefined;
} | {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpCommunityData, Partial<YpCommunityData>> & YpCommunityData>;
    required: boolean;
    attributes: any;
    where: {
        access: any;
        $or?: undefined;
    };
    include?: undefined;
} | {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpCommunityData, Partial<YpCommunityData>> & YpCommunityData>;
    attributes: any;
    required: boolean;
    include?: undefined;
    where?: undefined;
} | {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
    required: boolean;
    attributes: any;
    where: {
        $or: {
            access: any;
        }[];
        access?: undefined;
    };
    include: {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpImageData, Partial<YpImageData>> & YpImageData>;
        as: string;
        attributes: any;
        required: boolean;
    }[];
} | {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
    required: boolean;
    attributes: any;
    include: {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpImageData, Partial<YpImageData>> & YpImageData>;
        as: string;
        attributes: any;
        required: boolean;
    }[];
    where?: undefined;
} | {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpPostData, Partial<YpPostData>> & YpPostData>;
    required: boolean;
    attributes: any;
    include: ({
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpGroupData, Partial<YpGroupData>> & YpGroupData>;
        required: boolean;
        attributes: string[];
        as?: undefined;
        include?: undefined;
    } | {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpUserData, Partial<YpUserData>> & YpUserData>;
        attributes: string[];
        required: boolean;
        as?: undefined;
        include?: undefined;
    } | {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpImageData, Partial<YpImageData>> & YpImageData>;
        as: string;
        attributes: any;
        required: boolean;
        include?: undefined;
    } | {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpAudioData, Partial<YpAudioData>> & YpAudioData>;
        required: boolean;
        attributes: string[];
        as: string;
        include?: undefined;
    } | {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpCategoryData, Partial<YpCategoryData>> & YpCategoryData>;
        required: boolean;
        include: {
            model: import("sequelize").ModelStatic<import("sequelize").Model<YpImageData, Partial<YpImageData>> & YpImageData>;
            attributes: any;
            required: boolean;
            as: string;
        }[];
        attributes?: undefined;
        as?: undefined;
    })[];
    where?: undefined;
} | {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpPointData, Partial<YpPointData>> & YpPointData>;
    required: boolean;
    attributes: any[];
    include: ({
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpPointRevision, Partial<YpPointRevision>> & YpPointRevision>;
        attributes: any;
        include: {
            model: import("sequelize").ModelStatic<import("sequelize").Model<YpUserData, Partial<YpUserData>> & YpUserData>;
            attributes: any;
            required: boolean;
        }[];
        required: boolean;
        as?: undefined;
    } | {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpAudioData, Partial<YpAudioData>> & YpAudioData>;
        required: boolean;
        attributes: string[];
        as: string;
        include?: undefined;
    } | {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpPostData, Partial<YpPostData>> & YpPostData>;
        attributes: string[];
        required: boolean;
        include?: undefined;
        as?: undefined;
    } | {
        model: import("sequelize").ModelStatic<import("sequelize").Model<YpUserData, Partial<YpUserData>> & YpUserData>;
        attributes: string[];
        required: boolean;
        include?: undefined;
        as?: undefined;
    })[];
    where?: undefined;
} | {
    model: import("sequelize").ModelStatic<import("sequelize").Model<YpPostStatusChange, Partial<YpPostStatusChange>> & YpPostStatusChange>;
    attributes: any;
    required: boolean;
    include?: undefined;
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
