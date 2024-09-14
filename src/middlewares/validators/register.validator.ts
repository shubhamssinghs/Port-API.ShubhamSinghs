import { body } from 'express-validator';

export const registerValidator = [
  body('name', 'Invalid name').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'Invalid password').not().isEmpty().isLength({ min: 5 })
];
