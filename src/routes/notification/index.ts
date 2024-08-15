import { Router } from 'express';
import emailRoute from './email/index.js';
const router = Router();

router.use('/email', emailRoute);
export default router;
