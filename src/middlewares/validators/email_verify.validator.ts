import { body } from 'express-validator';

export const verifyEmailValidator = [body('email', 'Invalid email').isEmail()];
