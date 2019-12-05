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
      `),
    ]
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
