import { Router } from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/', authenticate, getBookings);
router.put('/:id/status', authenticate, authorize([Role.ADMIN, Role.STAFF]), updateBookingStatus);

export default router;
