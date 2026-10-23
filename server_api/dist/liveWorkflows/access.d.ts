import { type Model } from "sequelize";
export declare function groupAccess(groupId: number, userId: number): Promise<{
    group: Model<YpGroupData, Partial<YpGroupData>> & YpGroupData;
    userId: number;
    admin: boolean;
}>;
/** Match the same owner/member/community-admin access rules as groupAccess. */
export declare function groupChoices(userId: number, search: string): Promise<{
    id: number;
    name: string;
}[]>;
