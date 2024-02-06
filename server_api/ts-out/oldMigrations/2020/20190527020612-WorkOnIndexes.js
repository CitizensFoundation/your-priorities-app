'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.sequelize.query(`
        DROP INDEX notification_active_by_type_and_user_id;
        DROP INDEX notification_all_by_type;
        DROP INDEX notification_public_and_active_by_type;
        DROP INDEX notification_active_by_type;
        DROP INDEX notification_active_by_user_id;
        DROP INDEX activity_public_and_active_by_type;
        DROP INDEX activity_public_and_active_by_post_id;
        DROP INDEX activity_public_and_active_by_group_id;
        DROP INDEX activity_public_and_active_by_domain_id;
        DROP INDEX activity_public_and_active_by_community_id;
        
        CREATE INDEX ac_activities_idx_post_id_user_id_type_delete_status ON ac_activities (post_id,user_id,type,deleted,status);
        CREATE INDEX ac_notifications_idx_user_id_type_deleted_created_at ON ac_notifications (user_id,type,deleted,created_at);
        CREATE INDEX ac_activities_idx_deleted_status ON ac_activities (deleted,status);
        CREATE INDEX ac_notifications_idx_deleted_id ON ac_notifications (deleted,id);

        CREATE INDEX audios_idx_deleted ON audios (deleted);
        CREATE INDEX categories_idx_deleted_group_id ON categories (deleted,group_id);
        CREATE INDEX categories_idx_deleted ON categories (deleted);
        CREATE INDEX groups_idx_counter_users ON groups (counter_users);
        CREATE INDEX images_idx_deleted ON images (deleted);
        CREATE INDEX organizations_idx_deleted ON organizations (deleted);
        CREATE INDEX point_qualities_idx_deleted ON point_qualities (deleted);
        CREATE INDEX point_revisions_idx_deleted ON point_revisions (deleted);
        CREATE INDEX point_revisions_idx_deleted_point_id ON point_revisions (deleted,point_id);
        CREATE INDEX post_revisions_idx_deleted ON post_revisions (deleted);
        CREATE INDEX posts_idx_deleted_status_id ON posts (deleted,status,id);
        CREATE INDEX posts_idx_deleted_status ON posts (deleted,status);
        CREATE INDEX users_idx_deleted_status ON users (deleted,status);
        CREATE INDEX videos_idx_deleted ON videos (deleted);
                
        CREATE INDEX categoryiconimage_idx_category_id ON "CategoryIconImage" (category_id);
        CREATE INDEX communityheaderimage_idx_community_id ON "CommunityHeaderImage" (community_id);
        CREATE INDEX notification_activit_idx_ac_id ON notification_activities (ac_notification_id);
        CREATE INDEX communitylogoimage_idx_community_id ON "CommunityLogoImage" (community_id);
        CREATE INDEX communitylogovideo_idx_community_id ON "CommunityLogoVideo" (community_id);
        CREATE INDEX groupheaderimage_idx_group_id ON "GroupHeaderImage" (group_id);
        CREATE INDEX grouplogoimage_idx_group_id ON "GroupLogoImage" (group_id);
        CREATE INDEX grouplogovideo_idx_group_id ON "GroupLogoVideo" (group_id);
        CREATE INDEX organizationlogoimag_idx_organization_id ON "OrganizationLogoImage" (organization_id);
        CREATE INDEX organizationuser_idx_user_id ON "OrganizationUser" (user_id);
        CREATE INDEX pointaudio_idx_point_id ON "PointAudio" (point_id);
        CREATE INDEX pointvideo_idx_point_id ON "PointVideo" (point_id);
        CREATE INDEX postaudio_idx_post_id ON "PostAudio" (post_id);
        CREATE INDEX postvideo_idx_post_id ON "PostVideo" (post_id);
        CREATE INDEX userprofileimage_idx_user_id ON "UserProfileImage" (user_id);
        CREATE INDEX postheaderimage_idx_post_id ON "PostHeaderImage" (post_id);
        CREATE INDEX videoimage_idx_video_id ON "VideoImage" (video_id);
        
        CREATE INDEX domains_idx_deleted_domain_name ON domains (deleted,domain_name);
        CREATE INDEX communities_idx_deleted_hostname ON communities (deleted,hostname);
                
        CREATE INDEX groups_idx_counter_users_community_id_access_deleted ON groups (counter_users,community_id,access,deleted);
        
        CREATE INDEX pages_idx_domain_id_published_deleted ON pages (domain_id,published,deleted);
        CREATE INDEX pages_idx_community_id_published_deleted ON pages (community_id,published,deleted);
        CREATE INDEX pages_idx_group_id_published_deleted ON pages (group_id,published,deleted);
        
        CREATE INDEX points_idx_counter_sum_post_id_status_value_deleted ON points ((counter_quality_up-counter_quality_down),post_id,value,status,deleted);
        CREATE INDEX points_idx_created_at_post_id_status_deleted ON points (created_at,post_id,status,deleted);
        CREATE INDEX points_idx_deleted_status_id ON points (deleted,status,id);
        CREATE INDEX points_idx_deleted_status ON points (deleted,status);
        
        CREATE INDEX posts_idx_counter_sum_group_id_deleted ON posts ((counter_endorsements_up-counter_endorsements_down),group_id,deleted);
        CREATE INDEX posts_idx_counter_sum_group_id_category_id_deleted ON posts ((counter_endorsements_up-counter_endorsements_down),group_id,category_id,deleted);
        CREATE INDEX posts_idx_counter_points_group_id_deleted ON posts (counter_points,group_id,deleted);
        CREATE INDEX posts_idx_created_at_group_id_deleted ON posts (created_at,group_id,deleted);
        
        CREATE INDEX communities_idx_domain_id_in_id_deleted_access ON communities (domain_id,in_community_folder_id,deleted,access);
      `),
        ];
    },
    down: function (queryInterface, Sequelize) {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
    }
};
export {};
