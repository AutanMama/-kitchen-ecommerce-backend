import express from 'express';
import { initiateInstallmentPayment, paystackWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initiate', protect, initiateInstallmentPayment);
router.post('/webhook/paystack', paystackWebhook);

export default router;