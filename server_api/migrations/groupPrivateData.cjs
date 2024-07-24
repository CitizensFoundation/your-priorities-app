"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("groups", "private_access_configuration", {
        type: Sequelize.JSONB,
        allowNull: true,
      }),
      await queryInterface.addIndex("groups", {
        fields: ["configuration"],
        using: "gin",
        operator: "jsonb_path_ops",
      }),
      await queryInterface.addIndex("groups", {
        fields: ["private_access_configuration"],
        using: "gin",
        operator: "jsonb_path_ops",
      }),
    ];
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
