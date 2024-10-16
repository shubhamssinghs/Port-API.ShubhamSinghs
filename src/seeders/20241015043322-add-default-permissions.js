'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const permissions = [
      {
        uuid: uuidv4(),
        name: 'view_all_users',
        description: 'Allows the user to view a list of all users',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'view_user_profile',
        description: 'Allows the user to view details of a specific user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'update_user_profile',
        description: 'Allows the user to update the details of a specific user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'delete_user_profile',
        description: 'Allows the user to delete a specific user profile',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'view_all_logs',
        description: 'Allows the user to view all system logs',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'view_own_profile',
        description: 'Allows the user to view their own profile data',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'update_own_profile',
        description: 'Allows the user to update their own profile data',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: uuidv4(),
        name: 'delete_own_profile',
        description: 'Allows the user to delete their own profile',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('permissions', permissions, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
