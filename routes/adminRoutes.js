import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);

export default router;