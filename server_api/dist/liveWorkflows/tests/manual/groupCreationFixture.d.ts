import type { Express } from "express";
import { Sequelize } from "sequelize";
export declare function groupCreationFixture(database: Sequelize, userId: number): Promise<{
    mount: (app: Express) => void;
    close: () => void;
    communityId: number;
    otherGroupId: number;
    groupId: () => number | undefined;
    groupAccess: typeof import("../../access.js").groupAccess;
    groupChoices: typeof import("../../access.js").groupChoices;
    /** An external source owned by another user; membership can really be revoked. */
    sourceGroup(): Promise<{
        id: number;
        postId: number;
        revoke: () => any;
    }>;
    verify(): Promise<{
        groupId: number;
        communityId: number;
        name: string;
        groupType: number;
        creatorIsAdminAndMember: boolean;
        unrelatedGroupAccessDenied: boolean;
        backgroundJobsRecordedOnly: string[];
    }>;
}>;
export type GroupCreationFixture = Awaited<ReturnType<typeof groupCreationFixture>>;
