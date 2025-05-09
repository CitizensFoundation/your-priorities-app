export function domainIncludes(domainId: any): {
    model: any;
    required: boolean;
    attributes: string[];
    include: {
        model: any;
        required: boolean;
        attributes: string[];
        include: {
            model: any;
            attributes: string[];
            where: {
                id: any;
            };
            required: boolean;
        }[];
    }[];
}[];
export function communityIncludes(communityId: any): {
    model: any;
    required: boolean;
    attributes: string[];
    include: {
        model: any;
        required: boolean;
        attributes: string[];
        where: {
            id: any;
        };
    }[];
}[];
export function groupIncludes(groupId: any): {
    model: any;
    required: boolean;
    attributes: string[];
    where: {
        id: any;
    };
}[];
export function userIncludes(userId: any): {
    model: any;
    attributes: any;
    required: boolean;
    where: {
        id: any;
    };
}[];
export function getAllModeratedItemsByDomain(options: any, callback: any): void;
export function getAllModeratedItemsByUser(options: any, callback: any): void;
export function getAllModeratedItemsByCommunity(options: any, callback: any): void;
export function getAllModeratedItemsByGroup(options: any, callback: any): void;
export function countAllModeratedItemsByDomain(options: any, callback: any): void;
export function countAllModeratedItemsByCommunity(options: any, callback: any): void;
export function countAllModeratedItemsByGroup(options: any, callback: any): void;
export function countAllModeratedItemsByUser(options: any, callback: any): void;
