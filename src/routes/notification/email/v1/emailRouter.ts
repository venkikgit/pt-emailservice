import { Router } from 'express';
import emailController from '../../../../controllers/emailController.js';

const router = Router();

router.route('/send-email').post(emailController.sendEmail);
router.route('/queue-email').post(emailController.queueEmail);
router.route('/email-status/:jobId').get(emailController.getEmailStatus);

export default router;
