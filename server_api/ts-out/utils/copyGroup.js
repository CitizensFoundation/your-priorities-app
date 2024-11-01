import farmhash from "farmhash";
import { models } from "@policysynth/agents/dbModels/index.js";
async function copyGroup(fromGroupId, toCommunityIn, toDomainId, options) {
    try {
        // Find community and domain
        const communityIn = await models.Community.findOne({
            where: { id: toCommunityIn.id },
            attributes: ["id"],
            include: [
                {
                    model: models.Domain,
                    attributes: ["id", "theme_id", "name"],
                },
            ],
        });
        if (!communityIn) {
            throw new Error("Community not found");
        }
        const toCommunity = communityIn;
        const toDomain = communityIn.Domain;
        // Build group includes
        const groupIncludes = [
            {
                model: models.Community,
                attributes: [
                    "id",
                    "theme_id",
                    "name",
                    "access",
                    "google_analytics_code",
                    "configuration",
                ],
                include: [
                    {
                        model: models.Domain,
                        attributes: ["id", "theme_id", "name"],
                    },
                ],
            },
            {
                model: models.Category,
                required: false,
                include: [
                    {
                        model: models.Image,
                        required: false,
                        as: "CategoryIconImages",
                        attributes: ["id"],
                    },
                ],
            },
            {
                model: models.User,
                attributes: ["id"],
                as: "GroupAdmins",
                required: false,
            },
            {
                model: models.Image,
                as: "GroupLogoImages",
                attributes: models.Image.defaultAttributesPublic,
                required: false,
            },
            {
                model: models.Video,
                as: "GroupLogoVideos",
                attributes: ["id", "formats", "viewable", "public_meta"],
                required: false,
            },
            {
                model: models.Image,
                as: "GroupHeaderImages",
                attributes: models.Image.defaultAttributesPublic,
                required: false,
            },
        ];
        if (!options.skipUsers) {
            groupIncludes.push({
                model: models.User,
                attributes: ["id"],
                as: "GroupUsers",
                required: false,
            });
        }
        // Find source group
        const oldGroup = await models.Group.findOne({
            where: { id: fromGroupId },
            include: groupIncludes,
        });
        if (!oldGroup) {
            throw new Error("Source group not found");
        }
        // Create new group
        const groupJson = JSON.parse(JSON.stringify(oldGroup.toJSON()));
        delete groupJson["id"];
        const newGroup = models.Group.build(groupJson);
        // Set new properties
        newGroup.set("community_id", toCommunity.id);
        if (options.setInGroupFolderId) {
            newGroup.set("in_group_folder_id", options.setInGroupFolderId);
        }
        if (options.skipUsers) {
            newGroup.set("counter_users", 0);
        }
        if (!options.copyPoints) {
            newGroup.set("counter_points", 0);
        }
        if (!options.copyPosts) {
            newGroup.set("counter_posts", 0);
        }
        await newGroup.save();
        // Clone related data
        await Promise.all([
            clonePagesForGroup(oldGroup, newGroup),
            cloneTranslationForGroup(oldGroup, newGroup),
            cloneGroupMedia(oldGroup, newGroup),
            cloneGroupAdminsAndUsers(oldGroup, newGroup, options),
            cloneCategories(oldGroup, newGroup),
            handleGroupFolder(oldGroup, newGroup, toCommunity, toDomainId, options),
            handleCommunityLink(oldGroup, newGroup, toCommunity, toDomainId, options),
            handlePosts(oldGroup, newGroup, options),
        ]);
        // Recount posts if needed
        if (options.recountGroupPosts) {
            const postCount = await models.Post.count({
                where: { group_id: newGroup.id },
            });
            newGroup.set("counter_posts", postCount);
            await newGroup.save();
        }
        return newGroup;
    }
    catch (error) {
        console.error("Error in copyGroup:", error);
        throw error;
    }
}
async function cloneGroupMedia(oldGroup, newGroup) {
    // Clone logo images
    if (oldGroup.GroupLogoImages?.length) {
        for (const image of oldGroup.GroupLogoImages) {
            await newGroup.addGroupLogoImage(image);
        }
    }
    // Clone header images
    if (oldGroup.GroupHeaderImages?.length) {
        for (const image of oldGroup.GroupHeaderImages) {
            await newGroup.addGroupHeaderImage(image);
        }
    }
    // Clone logo videos
    if (oldGroup.GroupLogoVideos?.length) {
        for (const video of oldGroup.GroupLogoVideos) {
            await newGroup.addGroupLogoVideo(video);
        }
    }
}
async function cloneGroupAdminsAndUsers(oldGroup, newGroup, options) {
    // Clone admins
    if (oldGroup.GroupAdmins?.length) {
        for (const admin of oldGroup.GroupAdmins) {
            await newGroup.addGroupAdmin(admin);
        }
    }
    // Clone users if not skipped
    if (!options.skipUsers && oldGroup.GroupUsers?.length) {
        for (const user of oldGroup.GroupUsers) {
            await newGroup.addGroupUser(user);
        }
    }
}
async function cloneCategories(oldGroup, newGroup) {
    if (!oldGroup.Categories?.length)
        return;
    for (const category of oldGroup.Categories) {
        const newCategoryJson = JSON.parse(JSON.stringify(category.toJSON()));
        delete newCategoryJson.id;
        const newCategory = models.Category.build(newCategoryJson);
        newCategory.set("group_id", newGroup.id);
        await newCategory.save();
        if (category.CategoryIconImages?.length) {
            for (const image of category.CategoryIconImages) {
                await newCategory.addCategoryIconImage(image);
            }
        }
    }
}
async function cloneTranslationForGroup(inGroup, outGroup) {
    await Promise.all([
        cloneTranslationForItem("groupName", inGroup.id, outGroup.id, inGroup.name),
        cloneTranslationForItem("groupContent", inGroup.id, outGroup.id, inGroup.objectives || ""),
        cloneTranslationForConfig("GroupQuestions", inGroup.id, outGroup.id),
        cloneTranslationForConfig("GroupRegQuestions", inGroup.id, outGroup.id),
    ]);
}
async function cloneTranslationForItem(textType, inObjectId, outObjectId, content) {
    const translations = await getTranslationsForSearch(textType, inObjectId, content);
    if (translations.length > 0) {
        await cloneTranslations(translations, outObjectId);
    }
}
async function getTranslationsForSearch(textType, id, content) {
    const indexSearch = `${textType}-${id}-%-${farmhash
        .hash32(content)
        .toString()}`;
    return await models.AcTranslationCache.findAll({
        where: {
            index_key: {
                $like: indexSearch,
            },
        },
    });
}
async function handleGroupFolder(oldGroup, newGroup, toCommunity, toDomainId, options) {
    if (!oldGroup.is_group_folder)
        return;
    const groupsInFolder = await models.Group.findAll({
        where: { in_group_folder_id: oldGroup.id },
        attributes: ["id", "in_group_folder_id"],
    });
    for (const groupInFolder of groupsInFolder) {
        await copyGroup(groupInFolder.id, toCommunity, toDomainId, {
            ...options,
            setInGroupFolderId: newGroup.id,
        });
    }
}
async function handleCommunityLink(oldGroup, newGroup, toCommunity, toDomainId, options) {
    if (!options.deepCopyLinks || !oldGroup.configuration?.actAsLinkToCommunityId)
        return;
    const newCommunity = await copyCommunity(oldGroup.configuration.actAsLinkToCommunityId, toDomainId, options, { id: toCommunity.id, name: toCommunity.name });
    newGroup.set("configuration.actAsLinkToCommunityId", newCommunity.id);
    await newGroup.save();
}
async function handlePosts(oldGroup, newGroup, options) {
    if (!options.copyPosts)
        return;
    const posts = await models.Post.findAll({
        where: { group_id: oldGroup.id },
        attributes: ["id"],
    });
    for (const post of posts) {
        await copyPost(post.id, newGroup.id, options);
    }
}
export { copyGroup, cloneTranslationForGroup, cloneTranslationForItem, getTranslationsForSearch, };
