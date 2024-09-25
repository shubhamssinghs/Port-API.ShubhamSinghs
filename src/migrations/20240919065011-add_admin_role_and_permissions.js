'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        // id: Sequelize.UUIDV4(),
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    const permissions = [
      { name: 'create_user' },
      { name: 'delete_user' },
      { name: 'update_user' },
      { name: 'view_user' },
      { name: 'manage_roles' },
      { name: 'manage_permissions' }
    ];

    const permissionEntries = permissions.map((permission) => ({
      // id: Sequelize.UUIDV4(),
      name: permission.name,
      created_at: new Date(),
      updated_at: new Date()
    }));

    for (const permission of permissionEntries) {
      await queryInterface.bulkInsert('permissions', [permission]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', { name: 'admin' });

    const permissions = [
      'create_user',
      'delete_user',
      'update_user',
      'view_user',
      'manage_roles',
      'manage_permissions'
    ];

    await queryInterface.bulkDelete('permissions', {
      name: {
        [Sequelize.Op.in]: permissions
      }
    });
  }
};
