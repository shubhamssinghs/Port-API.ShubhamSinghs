'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions', Sequelize);
  }
};
