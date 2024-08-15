import { Router } from 'express';
import notificationRoute from './notification/index.js';
const router = Router();

router.use('/notifications', notificationRoute);
export default router;
