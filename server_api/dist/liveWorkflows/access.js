import models from "../models/index.cjs";
import { ForbiddenError, NotFoundError } from "./services/errors.js";
import { Op } from "sequelize";
export async function groupAccess(groupId, userId) {
    if (!Number.isSafeInteger(userId) || userId < 1)
        throw new ForbiddenError("Sign in to Your Priorities first");
    const group = await models.Group.findByPk(groupId);
    if (!group || group.get("deleted"))
        throw new NotFoundError("Group", groupId);
    const membership = group;
    const community = await models.Community.findByPk(group.get("community_id"));
    const admin = group.get("user_id") === userId ||
        (await membership.hasGroupAdmin(userId)) ||
        Boolean(community &&
            (community.get("user_id") === userId ||
                (await community.hasCommunityAdmin(userId))));
    const member = admin || (await membership.hasGroupUser(userId));
    if (!member)
        throw new ForbiddenError("Live workflow data is restricted to group members");
    return { group, userId, admin };
}
/** Match the same owner/member/community-admin access rules as groupAccess. */
export async function groupChoices(userId, search) {
    const user = (await models.User.findByPk(userId));
    if (!user)
        throw new ForbiddenError();
    const options = { attributes: ["id"], joinTableAttributes: [] };
    const [members, admins, communityAdmins, ownedCommunities] = await Promise.all([
        user.getGroupUsers(options),
        user.getGroupAdmins(options),
        user.getCommunityAdmins(options),
        models.Community.findAll({
            where: { user_id: userId },
            attributes: ["id"],
        }),
    ]);
    const ids = (rows) => rows.map((row) => Number(row.get("id")));
    const groups = await models.Group.findAll({
        where: {
            [Op.or]: [
                { user_id: userId },
                { id: { [Op.in]: ids([...members, ...admins]) } },
                {
                    community_id: {
                        [Op.in]: ids([...communityAdmins, ...ownedCommunities]),
                    },
                },
            ],
            ...(search.trim() ? { name: { [Op.iLike]: `%${search.trim()}%` } } : {}),
        },
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
        limit: 50,
    });
    return groups.map((group) => ({
        id: Number(group.get("id")),
        name: String(group.get("name")),
    }));
}
