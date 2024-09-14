import { Router } from 'express';

import { logController } from '../controllers';
import { auth as authMiddleware } from '../middlewares';

const router = Router();

router.use(authMiddleware.verifyToken);

router.get('/all', logController.getAllLogs);

export default router;
