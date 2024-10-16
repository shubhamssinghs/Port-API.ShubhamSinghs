'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    await queryInterface.bulkInsert(
      'users',
      [
        {
          uuid: uuidv4(),
          name: 'Admin',
          email: 'admin@admin.com',
          password: hashedPassword,
          img: 'https://ui-avatars.com/api/?name=Admin&background=953699&color=ffffff&size=128',
          active: true,
          type: 'admin',
          verification_token: null,
          verification_token_expires: null,
          verified_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
