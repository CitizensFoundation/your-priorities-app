import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Sequelize, DataTypes, Op } from "sequelize";
import { sequelize as psSequelize } from "@policysynth/agents/dbModels/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// PolicySynth Models
import { PsAiModel } from "@policysynth/agents/dbModels/aiModel.js";
import { PsAgentClass } from "@policysynth/agents/dbModels/agentClass.js";
import { PsExternalApiUsage } from "@policysynth/agents/dbModels/externalApiUsage.js";
import { PsExternalApi } from "@policysynth/agents/dbModels/externalApis.js";
import { PsModelUsage } from "@policysynth/agents/dbModels/modelUsage.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import { PsAgentAuditLog } from "@policysynth/agents/dbModels/agentAuditLog.js";
import { PsAgentConnector } from "@policysynth/agents/dbModels/agentConnector.js";
import { PsAgentConnectorClass } from "@policysynth/agents/dbModels/agentConnectorClass.js";
import { PsAgentRegistry } from "@policysynth/agents/dbModels/agentRegistry.js";
const psModels = {
    PsAgentClass,
    PsExternalApiUsage,
    PsModelUsage,
    PsAgentConnector,
    PsAgent,
    PsAgentAuditLog,
    PsAgentConnectorClass,
    PsAgentRegistry,
    PsAiModel,
    PsExternalApi,
};
const env = process.env.NODE_ENV || "development";
let mainSequelize;
// Operator aliases from server_api/models/index.cjs
const mainOperatorsAliases = {
    $gt: Op.gt,
    $gte: Op.gte,
    $lt: Op.lt,
    $lte: Op.lte,
    $in: Op.in,
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $ne: Op.ne,
    $is: Op.is,
    $not: Op.not,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $like: Op.like,
    $contains: Op.contains,
    $any: Op.any,
};
if (env === "production") {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL environment variable is not set for production.");
        process.exit(1);
    }
    if (process.env.DISABLE_PG_SSL) {
        mainSequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: "postgres",
            minifyAliases: true,
            logging: false,
            operatorsAliases: mainOperatorsAliases,
        });
    }
    else {
        mainSequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
            minifyAliases: true,
            logging: false,
            operatorsAliases: mainOperatorsAliases,
        });
    }
}
else {
    if (!process.env.YP_DEV_DATABASE_NAME ||
        !process.env.YP_DEV_DATABASE_USERNAME ||
        !process.env.YP_DEV_DATABASE_PASSWORD ||
        !process.env.YP_DEV_DATABASE_HOST ||
        !process.env.YP_DEV_DATABASE_PORT) {
        console.error("One or more YP_DEV_DATABASE environment variables are not set for development.");
        process.exit(1);
    }
    try {
        mainSequelize = new Sequelize(process.env.YP_DEV_DATABASE_NAME, process.env.YP_DEV_DATABASE_USERNAME, process.env.YP_DEV_DATABASE_PASSWORD, {
            dialect: "postgres",
            protocol: "postgres",
            host: process.env.YP_DEV_DATABASE_HOST,
            port: parseInt(process.env.YP_DEV_DATABASE_PORT, 10),
            minifyAliases: true,
            dialectOptions: {
                ssl: false,
                rejectUnauthorized: false,
            },
            logging: false, // Set to console.log for verbose output during seeding
            operatorsAliases: mainOperatorsAliases,
        });
    }
    catch (error) {
        console.error("Error initializing Sequelize for development:", error);
        process.exit(1);
    }
}
const mainDb = {};
// Compound index commands from server_api/models/index.cjs
const mainCompoundIndexCommands = [
    'CREATE INDEX domainheaderimage_idx2_domain_id ON "DomainHeaderImage" (domain_id)',
    'CREATE INDEX domainlogoimage_idx2_domain_id ON "DomainLogoImage" (domain_id)',
    'CREATE INDEX domainlogovideo_idx2_domain_id ON "DomainLogoVideo" (domain_id)',
    'CREATE INDEX domainheaderimage_idx2_domain_id_u ON "DomainHeaderImage" (domain_id, updated_at)',
    'CREATE INDEX domainlogoimage_idx2_domain_id_u ON "DomainLogoImage" (domain_id, updated_at)',
    'CREATE INDEX domainlogovideo_idx2_domain_id_u ON "DomainLogoVideo" (domain_id, updated_at)',
    'CREATE INDEX domainheaderimage_idx2_domain_id_c ON "DomainHeaderImage" (domain_id, created_at)',
    'CREATE INDEX domainlogoimage_idx2_domain_id_c ON "DomainLogoImage" (domain_id, created_at)',
    'CREATE INDEX domainlogovideo_idx2_domain_id_c ON "DomainLogoVideo" (domain_id, created_at)',
    'CREATE INDEX communityheaderimage_idx2_community_id ON "CommunityHeaderImage" (community_id)',
    'CREATE INDEX communitylogoimage_idx2_community_id ON "CommunityLogoImage" (community_id)',
    'CREATE INDEX communitylogovideo_idx2_community_id ON "CommunityLogoVideo" (community_id)',
    'CREATE INDEX communityheaderimage_idx2_community_id_u ON "CommunityHeaderImage" (community_id, updated_at)',
    'CREATE INDEX communitylogoimage_idx2_community_id_u ON "CommunityLogoImage" (community_id, updated_at)',
    'CREATE INDEX communitylogovideo_idx2_community_id_u ON "CommunityLogoVideo" (community_id, updated_at)',
    'CREATE INDEX communityheaderimage_idx2_community_id_c ON "CommunityHeaderImage" (community_id, created_at)',
    'CREATE INDEX communitylogoimage_idx2_community_id_c ON "CommunityLogoImage" (community_id, created_at)',
    'CREATE INDEX communitylogovideo_idx2_community_id_c ON "CommunityLogoVideo" (community_id, created_at)',
    'CREATE INDEX groupheaderimage_idx2_group_id_u ON "GroupHeaderImage" (group_id, updated_at)',
    'CREATE INDEX grouplogoimage_idx2_group_id_u ON "GroupLogoImage" (group_id, updated_at)',
    'CREATE INDEX grouplogovideo_idx2_group_id_u ON "GroupLogoVideo" (group_id, updated_at)',
    'CREATE INDEX groupheaderimage_idx2_group_id_c ON "GroupHeaderImage" (group_id, created_at)',
    'CREATE INDEX grouplogoimage_idx2_group_id_c ON "GroupLogoImage" (group_id, created_at)',
    'CREATE INDEX grouplogovideo_idx2_group_id_c ON "GroupLogoVideo" (group_id, created_at)',
    "CREATE INDEX idx2_group_categories_name ON Categories (group_id, name)",
    'CREATE INDEX organizationlogoimag_idx_organization_id ON "OrganizationLogoImage" (organization_id)',
    'CREATE INDEX organizationlogoimag_idx_organization_id_u ON "OrganizationLogoImage" (organization_id, updated_at)',
    'CREATE INDEX organizationlogoimag_idx_organization_id_c ON "OrganizationLogoImage" (organization_id, created_at)',
    'CREATE INDEX organizationuser_idx2_user_id ON "OrganizationUser" (user_id)',
    'CREATE INDEX pointaudio_idx2_point_id ON "PointAudio" (point_id)',
    'CREATE INDEX pointvideo_idx2_point_id ON "PointVideo" (point_id)',
    'CREATE INDEX pointaudio_idx2_point_id_u ON "PointAudio" (point_id, updated_at)',
    'CREATE INDEX pointvideo_idx2_point_id_u ON "PointVideo" (point_id, updated_at)',
    'CREATE INDEX pointaudio_idx2_point_id_c ON "PointAudio" (point_id, created_at)',
    'CREATE INDEX pointvideo_idx2_point_id_c ON "PointVideo" (point_id, created_at)',
    "CREATE INDEX points_idx2_counter_sum_post_id_status_value_deleted ON points ((counter_quality_up-counter_quality_down), post_id, status, value, deleted)",
    'CREATE INDEX userprofileimage_idx2_user_id ON "UserProfileImage" (user_id)',
    'CREATE INDEX userprofileimage_idx2_user_id_u ON "UserProfileImage" (user_id, updated_at)',
    'CREATE INDEX userprofileimage_idx2_user_id_c ON "UserProfileImage" (user_id, created_at)',
    'CREATE INDEX categoryiconimage_idx2_category_id ON "CategoryIconImage" (category_id)',
    'CREATE INDEX idx2_category_icon_images ON "CategoryIconImage" (category_id, updated_at)',
    'CREATE INDEX idx2_category_icon_images_c ON "CategoryIconImage" (category_id, created_at)',
    'CREATE INDEX videoimage_idx2_video_id ON "VideoImage" (video_id)',
    'CREATE INDEX videoimage_idx2_video_id_u ON "VideoImage" (video_id, updated_at)',
    'CREATE INDEX videoimage_idx2_video_id_c ON "VideoImage" (video_id, created_at)',
    'CREATE INDEX postaudio_idx2_post_id ON "PostAudio" (post_id)',
    'CREATE INDEX postvideo_idx2_post_id ON "PostVideo" (post_id)',
    'CREATE INDEX postheaderimage_idx2_post_id ON "PostHeaderImage" (post_id)',
    'CREATE INDEX posimage_idx2_post_id ON "PostImage" (post_id)',
    'CREATE INDEX idx2_post_header_images_u ON "PostHeaderImage" (post_id, updated_at)',
    'CREATE INDEX idx2_post_images_u ON "PostImage" (post_id, updated_at)',
    'CREATE INDEX idx2_post_audios_u ON "PostAudio" (post_id, updated_at)',
    'CREATE INDEX idx2_post_videos_u ON "PostVideo" (post_id, updated_at)',
    'CREATE INDEX idx2_post_header_images_c ON "PostHeaderImage" (post_id, created_at)',
    'CREATE INDEX idx2_post_images_c ON "PostImage" (post_id, created_at)',
    'CREATE INDEX idx2_post_audios_c ON "PostAudio" (post_id, created_at)',
    'CREATE INDEX idx2_post_videos_c ON "PostVideo" (post_id, created_at)',
    "CREATE INDEX posts_idx2_counter_sum_group_id_deleted ON posts ((counter_endorsements_up-counter_endorsements_down),group_id,deleted)",
    "CREATE INDEX posts_idx2_counter_sum_group_id_category_id_deleted ON posts ((counter_endorsements_up-counter_endorsements_down),group_id,category_id,deleted)",
];
async function createMainCompoundIndexes(sequelizeInstance, indexCommands) {
    for (const command of indexCommands) {
        try {
            await sequelizeInstance.query(command);
            console.log(`Successfully created main index: ${command.substring(0, 100)}...`);
        }
        catch (error) {
            if (error.message && error.message.indexOf("already exists") > -1) {
                // console.log(`Main index already exists: ${command.substring(0,100)}...`);
            }
            else {
                console.error(`Error creating main index with command: ${command}`);
                console.error(error.message);
            }
        }
    }
}
async function syncMainDatabase() {
    console.log("Starting main database synchronization...");
    const modelsPath = path.join(__dirname, "../models");
    const modelFiles = fs
        .readdirSync(modelsPath)
        .filter((file) => file.indexOf(".") !== 0 &&
        file.endsWith(".cjs") &&
        !file.endsWith(".d.cjs") &&
        !file.endsWith(".d.cts") &&
        file !== "index.cjs");
    for (const file of modelFiles) {
        const filePath = path.join(modelsPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        try {
            const module = await import(fileUrl);
            const modelFactory = module.default; // Assuming the .cjs files use module.exports = ...
            const model = modelFactory(mainSequelize, DataTypes);
            mainDb[model.name] = model;
        }
        catch (err) {
            console.error(`Error importing model ${file}:`, err);
            throw err; // Re-throw to stop the process if a model fails to load
        }
    }
    const acModelsPath = path.join(__dirname, "../services/models");
    if (fs.existsSync(acModelsPath)) {
        const acModelFiles = fs
            .readdirSync(acModelsPath)
            .filter((file) => file.indexOf(".") !== 0 &&
            file.endsWith(".cjs") &&
            !file.endsWith(".d.cjs") &&
            !file.endsWith(".d.cts"));
        for (const file of acModelFiles) {
            const filePath = path.join(acModelsPath, file);
            const fileUrl = pathToFileURL(filePath).href;
            try {
                const module = await import(fileUrl);
                const modelFactory = module.default; // Assuming the .cjs files use module.exports = ...
                const model = modelFactory(mainSequelize, DataTypes);
                mainDb[model.name] = model;
            }
            catch (err) {
                console.error(`Error importing services model ${file}:`, err);
                throw err; // Re-throw to stop the process if a model fails to load
            }
        }
    }
    else {
        console.warn(`Directory not found, skipping services models: ${acModelsPath}`);
    }
    Object.keys(mainDb).forEach((modelName) => {
        if (mainDb[modelName] &&
            typeof mainDb[modelName].associate === "function") {
            mainDb[modelName].associate(mainDb);
        }
    });
    // This script is intended for creating a new database, so always force sync.
    await mainSequelize.sync({ force: true });
    console.log("Main database schema forcefully synchronized (tables dropped and recreated).");
    await createMainCompoundIndexes(mainSequelize, mainCompoundIndexCommands);
    if (mainDb.Post && typeof mainDb.Post.addFullTextIndex === "function") {
        console.log("Adding full text index for Post model...");
        await mainDb.Post.addFullTextIndex();
        console.log("Full text index for Post model added.");
    }
    else {
        console.warn("Post model or addFullTextIndex method not found in mainDb. Skipping full text index.");
    }
    console.log("Main database synchronization finished.");
}
async function syncPolicySynthDatabase() {
    console.log("Starting PolicySynth database synchronization...");
    try {
        // This script is intended for creating a new database, so always force sync.
        await psSequelize.sync({ force: false });
        console.log("PolicySynth database schema forcefully synchronized (tables dropped and recreated).");
        console.log("Associating PolicySynth models...");
        for (const modelName of Object.keys(psModels)) {
            const model = psModels[modelName];
            if (model && typeof model.associate === "function") {
                model.associate(psSequelize.models);
            }
        }
        console.log("PolicySynth models associated successfully.");
    }
    catch (error) {
        console.error("Error during PolicySynth database synchronization:", error);
        process.exit(1);
    }
    console.log("PolicySynth database synchronization finished.");
}
async function seedAllModels() {
    console.log("--- Starting Database Seeding and Synchronization ---");
    console.log("NOTE: This script will forcefully synchronize the database (drop and recreate tables).");
    console.log("NODE_ENV:", env);
    // The following environment variables are logged for informational purposes,
    // but this script will always force database synchronization.
    console.log("FORCE_DB_SYNC (ignored, always true for this script):", process.env.FORCE_DB_SYNC);
    console.log("FORCE_DB_INDEX_SYNC (ignored, indexes created after forced sync):", process.env.FORCE_DB_INDEX_SYNC);
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error("Usage: node <script_path> <username/email> <password>");
        process.exit(1);
    }
    const userEmail = args[0].toLowerCase();
    const userName = args[0]; // Using email as name for simplicity, or a fixed name
    const userPassword = args[1];
    // Check for main database config outside of production if not using DATABASE_URL
    if (env !== "production") {
        if (!process.env.YP_DEV_DATABASE_NAME ||
            !process.env.YP_DEV_DATABASE_USERNAME ||
            !process.env.YP_DEV_DATABASE_PASSWORD ||
            !process.env.YP_DEV_DATABASE_HOST ||
            !process.env.YP_DEV_DATABASE_PORT) {
            console.error("Missing YP_DEV_DATABASE environment variables for main database in non-production.");
            process.exit(1);
        }
    }
    else {
        if (!process.env.DATABASE_URL) {
            console.error("Missing DATABASE_URL for production environment.");
            process.exit(1);
        }
    }
    try {
        await syncMainDatabase();
        await syncPolicySynthDatabase();
        console.log("--- Databases Synchronized ---");
        console.log("--- Creating User and Domain ---");
        if (!mainDb.User) {
            console.error("User model (mainDb.User) not found after sync.");
            process.exit(1);
        }
        if (!mainDb.Domain) {
            console.error("Domain model (mainDb.Domain) not found after sync.");
            process.exit(1);
        }
        // Create User
        console.log(`Attempting to create user: ${userEmail}`);
        const newUser = mainDb.User.build({
            email: userEmail,
            name: userName, // Or a dedicated name argument if preferred
            status: "active",
            // Attempt to set default notifications, fallback if AcNotification not on mainDb
            notifications_settings: mainDb.AcNotification
                ? mainDb.AcNotification.defaultNotificationSettings
                : { email: true },
        });
        // createPasswordHash is an instance method on User model from user.cjs
        const salt = bcrypt.genSaltSync(10);
        newUser.encrypted_password = bcrypt.hashSync(userPassword, salt);
        await newUser.save();
        console.log(`User ${newUser.email} created with ID: ${newUser.id}`);
        // Create Domain
        const randomDomainName = crypto.randomBytes(8).toString("hex") + ".seed.local"; // Shorter and identifiable
        console.log(`Attempting to create domain: ${randomDomainName} for user ${newUser.id}`);
        const newDomain = mainDb.Domain.build({
            name: `Default Domain for ${userName}`,
            domain_name: randomDomainName,
            access: mainDb.Domain.ACCESS_PUBLIC !== undefined
                ? mainDb.Domain.ACCESS_PUBLIC
                : 0, // Use constant if available
            default_locale: "en",
            ip_address: "::1", // Using localhost IP
            user_agent: "seedModelsScript/1.0",
            user_id: newUser.id, // Associate domain with the new user
            configuration: {},
            secret_api_keys: {},
            data: {},
            other_social_media_info: {},
            public_api_keys: {},
            info_texts: {},
            // Fill other required non-nullable fields based on domain.cjs definition if any
            // deleted: false, (already defaults to false)
        });
        await newDomain.save();
        console.log(`Domain ${newDomain.name} created with ID: ${newDomain.id} and domain_name: ${newDomain.domain_name}`);
        // Associate User with Domain
        if (typeof newDomain.addDomainUsers === "function") {
            await newDomain.addDomainUsers(newUser);
            console.log(`User ${newUser.email} added to domain ${newDomain.domain_name} as a user.`);
        }
        else {
            console.warn(`newDomain.addDomainUsers is not a function. Skipping adding user to domain users.`);
        }
        if (typeof newDomain.addDomainAdmins === "function") {
            await newDomain.addDomainAdmins(newUser);
            console.log(`User ${newUser.email} added to domain ${newDomain.domain_name} as an admin.`);
        }
        else {
            console.warn(`newDomain.addDomainAdmins is not a function. Skipping adding user to domain admins.`);
        }
        console.log("--- User and Domain Creation Complete ---");
        console.log("--- All model seeding and synchronization complete. ---");
        process.exit(0);
    }
    catch (error) {
        console.error("Unhandled error during seeding process:", error);
        process.exit(1);
    }
    finally {
        console.log("Closing database connections...");
        await mainSequelize.close();
        await psSequelize.close();
        console.log("Database connections closed.");
    }
}
seedAllModels().catch((error) => {
    console.error("Fatal error running seedAllModels:", error);
    process.exit(1);
});
export { seedAllModels }; // Export if you plan to import and run this elsewhere
