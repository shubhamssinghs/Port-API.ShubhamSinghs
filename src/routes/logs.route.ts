import { Router } from 'express';

import { logController } from '../controllers';
import { auth as authMiddleware, permission } from '../middlewares';

const router = Router();

router.use(authMiddleware.verifyToken, permission.checkPermissions());

router.get('/all', logController.getAllLogs);

export default router;
