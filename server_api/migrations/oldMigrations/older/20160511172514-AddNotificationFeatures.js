'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('delayed_notifications', 'ac_activity_id', 'ac_delayed_notification_id').then(function () {
      return queryInterface.addColumn(
        'ac_notifications',
        'from_notification_setting',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )});
  },

  down: function (queryInterface, Sequelize) {
  }
};
