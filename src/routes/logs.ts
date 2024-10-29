import { Router } from 'express';
import { createLog, getAllLogs } from '../controllers/log';
import authenticate from '../middlewares/auth';
import isAdmin from '../middlewares/isAdmin';

const router = Router();

router.post('/', createLog);
router.get('/', authenticate, isAdmin, getAllLogs);


export default router;
