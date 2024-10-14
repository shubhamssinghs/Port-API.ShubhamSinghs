import { Router } from 'express';

import authRouter from './auth.route';
import logRouter from './logs.route';
import userRouter from './user.route';

const router = Router();

router.use('/log', logRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);

export default router;
