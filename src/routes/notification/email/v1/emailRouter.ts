import { Router } from 'express';
import emailController from '../../../../controllers/emailController.js';

const router = Router();

router.route('/sendEmail').post(emailController.sendEmail);

export default router;
