import { body } from 'express-validator';

export const loginValidator = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Invalid password').not().isEmpty()
];
