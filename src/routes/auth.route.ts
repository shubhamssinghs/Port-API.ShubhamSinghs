import { Router } from 'express';
import config from 'config';

import { authController } from '../controllers';
import { auth as authMiddleware } from '../middlewares';
import {
  registerValidator,
  loginValidator,
  verifyEmailValidator
} from '../middlewares/validators';

const router = Router();

const environment = config.get<string>('environment');
const isProduction = environment === 'production';

if (isProduction) {
  router.use(authMiddleware.authRateLimiter);
}

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post(
  '/send-verification-email',
  verifyEmailValidator,
  authController.sendEmailVerificationToken
);
router.get('/verify-email/:token', authController.verifyEmailToken);

export default router;
