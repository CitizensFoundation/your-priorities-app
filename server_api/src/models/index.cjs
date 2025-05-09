"use strict";

const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const _ = require("lodash");
const { Sequelize, DataTypes } = require("sequelize");

let sequelize;

const Op = Sequelize.Op;
const operatorsAliases = {
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

if (process.env.NODE_ENV === "production") {
  if (process.env.DISABLE_PG_SSL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      minifyAliases: true,
      logging: false,
      operatorsAliases: operatorsAliases,
    });
  } else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      minifyAliases: true,
      logging: false,
      operatorsAliases: operatorsAliases,
    });
  }
} else {
  let config;
  try {
    sequelize = new Sequelize(
      process.env.YP_DEV_DATABASE_NAME,
      process.env.YP_DEV_DATABASE_USERNAME,
      process.env.YP_DEV_DATABASE_PASSWORD,
      {
        dialect: "postgres",
        protocol: "postgres",
        host: process.env.YP_DEV_DATABASE_HOST,
        port: process.env.YP_DEV_DATABASE_PORT,
        minifyAliases: true,
        dialectOptions: {
          ssl: false,
          rejectUnauthorized: false,
        },
        logging: false,
        operatorsAliases: operatorsAliases,
      }
    );
  } catch (error) {
    console.error("Error reading or parsing config file:", error);
    process.exit(1);
  }
}

const db = {};

async function createCompoundIndexes(indexCommands) {
  for (const command of indexCommands) {
    try {
      await sequelize.query(command);
      console.log(`Successfully created index with command: ${command}`);
    } catch (error) {
      if (error.message.indexOf("already exists") > -1) {
        //console.log("already exists")
      } else {
        console.error(`Error creating index with command: ${command}`);
        console.error(error.message);
      }
    }
  }
}

const compoundIndexCommands = [
  `CREATE INDEX domainheaderimage_idx2_domain_id ON "DomainHeaderImage" (domain_id)`,
  `CREATE INDEX domainlogoimage_idx2_domain_id ON "DomainLogoImage" (domain_id)`,
  `CREATE INDEX domainlogovideo_idx2_domain_id ON "DomainLogoVideo" (domain_id)`,

  `CREATE INDEX domainheaderimage_idx2_domain_id_u ON "DomainHeaderImage" (domain_id, updated_at)`,
  `CREATE INDEX domainlogoimage_idx2_domain_id_u ON "DomainLogoImage" (domain_id, updated_at)`,
  `CREATE INDEX domainlogovideo_idx2_domain_id_u ON "DomainLogoVideo" (domain_id, updated_at)`,

  `CREATE INDEX domainheaderimage_idx2_domain_id_c ON "DomainHeaderImage" (domain_id, created_at)`,
  `CREATE INDEX domainlogoimage_idx2_domain_id_c ON "DomainLogoImage" (domain_id, created_at)`,
  `CREATE INDEX domainlogovideo_idx2_domain_id_c ON "DomainLogoVideo" (domain_id, created_at)`,

  `CREATE INDEX communityheaderimage_idx2_community_id ON "CommunityHeaderImage" (community_id)`,
  `CREATE INDEX communitylogoimage_idx2_community_id ON "CommunityLogoImage" (community_id)`,
  `CREATE INDEX communitylogovideo_idx2_community_id ON "CommunityLogoVideo" (community_id)`,

  `CREATE INDEX communityheaderimage_idx2_community_id_u ON "CommunityHeaderImage" (community_id, updated_at)`,
  `CREATE INDEX communitylogoimage_idx2_community_id_u ON "CommunityLogoImage" (community_id, updated_at)`,
  `CREATE INDEX communitylogovideo_idx2_community_id_u ON "CommunityLogoVideo" (community_id, updated_at)`,

  `CREATE INDEX communityheaderimage_idx2_community_id_c ON "CommunityHeaderImage" (community_id, created_at)`,
  `CREATE INDEX communitylogoimage_idx2_community_id_c ON "CommunityLogoImage" (community_id, created_at)`,
  `CREATE INDEX communitylogovideo_idx2_community_id_c ON "CommunityLogoVideo" (community_id, created_at)`,

  `CREATE INDEX groupheaderimage_idx2_group_id_u ON "GroupHeaderImage" (group_id, updated_at)`,
  `CREATE INDEX grouplogoimage_idx2_group_id_u ON "GroupLogoImage" (group_id, updated_at)`,
  `CREATE INDEX grouplogovideo_idx2_group_id_u ON "GroupLogoVideo" (group_id, updated_at)`,

  `CREATE INDEX groupheaderimage_idx2_group_id_c ON "GroupHeaderImage" (group_id, created_at)`,
  `CREATE INDEX grouplogoimage_idx2_group_id_c ON "GroupLogoImage" (group_id, created_at)`,
  `CREATE INDEX grouplogovideo_idx2_group_id_c ON "GroupLogoVideo" (group_id, created_at)`,

  `CREATE INDEX idx2_group_categories_name ON Categories (group_id, name)`,

  `CREATE INDEX organizationlogoimag_idx_organization_id ON "OrganizationLogoImage" (organization_id)`,
  `CREATE INDEX organizationlogoimag_idx_organization_id_u ON "OrganizationLogoImage" (organization_id, updated_at)`,
  `CREATE INDEX organizationlogoimag_idx_organization_id_c ON "OrganizationLogoImage" (organization_id, created_at)`,

  `CREATE INDEX organizationuser_idx2_user_id ON "OrganizationUser" (user_id)`,

  `CREATE INDEX pointaudio_idx2_point_id ON "PointAudio" (point_id)`,
  `CREATE INDEX pointvideo_idx2_point_id ON "PointVideo" (point_id)`,

  `CREATE INDEX pointaudio_idx2_point_id_u ON "PointAudio" (point_id, updated_at)`,
  `CREATE INDEX pointvideo_idx2_point_id_u ON "PointVideo" (point_id, updated_at)`,

  `CREATE INDEX pointaudio_idx2_point_id_c ON "PointAudio" (point_id, created_at)`,
  `CREATE INDEX pointvideo_idx2_point_id_c ON "PointVideo" (point_id, created_at)`,

  `CREATE INDEX points_idx2_counter_sum_post_id_status_value_deleted ON points ((counter_quality_up-counter_quality_down), post_id, status, value, deleted)`,

  `CREATE INDEX userprofileimage_idx2_user_id ON "UserProfileImage" (user_id)`,
  `CREATE INDEX userprofileimage_idx2_user_id_u ON "UserProfileImage" (user_id, updated_at)`,
  `CREATE INDEX userprofileimage_idx2_user_id_c ON "UserProfileImage" (user_id, created_at)`,

  `CREATE INDEX categoryiconimage_idx2_category_id ON "CategoryIconImage" (category_id)`,
  `CREATE INDEX idx2_category_icon_images ON "CategoryIconImage" (category_id, updated_at)`,
  `CREATE INDEX idx2_category_icon_images_c ON "CategoryIconImage" (category_id, created_at)`,

  `CREATE INDEX videoimage_idx2_video_id ON "VideoImage" (video_id)`,
  `CREATE INDEX videoimage_idx2_video_id_u ON "VideoImage" (video_id, updated_at)`,
  `CREATE INDEX videoimage_idx2_video_id_c ON "VideoImage" (video_id, created_at)`,

  `CREATE INDEX postaudio_idx2_post_id ON "PostAudio" (post_id)`,
  `CREATE INDEX postvideo_idx2_post_id ON "PostVideo" (post_id)`,
  `CREATE INDEX postheaderimage_idx2_post_id ON "PostHeaderImage" (post_id)`,
  `CREATE INDEX posimage_idx2_post_id ON "PostImage" (post_id)`,

  `CREATE INDEX idx2_post_header_images_u ON "PostHeaderImage" (post_id, updated_at)`,
  `CREATE INDEX idx2_post_images_u ON "PostImage" (post_id, updated_at)`,
  `CREATE INDEX idx2_post_audios_u ON "PostAudio" (post_id, updated_at)`,
  `CREATE INDEX idx2_post_videos_u ON "PostVideo" (post_id, updated_at)`,

  `CREATE INDEX idx2_post_header_images_c ON "PostHeaderImage" (post_id, created_at)`,
  `CREATE INDEX idx2_post_images_c ON "PostImage" (post_id, created_at)`,
  `CREATE INDEX idx2_post_audios_c ON "PostAudio" (post_id, created_at)`,
  `CREATE INDEX idx2_post_videos_c ON "PostVideo" (post_id, created_at)`,

  `CREATE INDEX posts_idx2_counter_sum_group_id_deleted ON posts ((counter_endorsements_up-counter_endorsements_down),group_id,deleted)`,
  `CREATE INDEX posts_idx2_counter_sum_group_id_category_id_deleted ON posts ((counter_endorsements_up-counter_endorsements_down),group_id,category_id,deleted)`,
];

// Read models from local folder
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.endsWith(".cjs") && !file.endsWith(".d.cjs") && !file.endsWith(".d.cts") && file !== "index.cjs";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Read from active citizen,
const acDirname = __dirname + "/../services/models";
fs.readdirSync(acDirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.endsWith(".cjs") && !file.endsWith(".d.cjs") && !file.endsWith(".d.cts");
  })
  .forEach((file) => {
    const model = require(path.join(acDirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

if (process.env.FORCE_DB_SYNC || process.env.NODE_ENV === "development") {
  sequelize.sync().then(async () => {
    await createCompoundIndexes(compoundIndexCommands);
    db.Post.addFullTextIndex();
  });
} else if (process.env.FORCE_DB_INDEX_SYNC) {
  createCompoundIndexes(compoundIndexCommands);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
