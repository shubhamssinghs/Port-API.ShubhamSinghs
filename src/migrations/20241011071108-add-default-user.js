'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    if (process.env.NODE_ENV === 'production') {
      console.log('Skipping seeding default user in production environment');
      return;
    }

    const hashedPassword = await bcrypt.hash('Test@123', 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          uuid: uuidv4(),
          name: 'Test User',
          email: 'test@test.com',
          password: hashedPassword,
          img: 'https://ui-avatars.com/api/?name=Test%20User&background=953699&color=ffffff&size=128',
          active: true,
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
    await queryInterface.bulkDelete('users', { email: 'test@test.com' }, {});
  }
};
