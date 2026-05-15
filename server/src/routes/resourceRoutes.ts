import { Router } from 'express';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', getResources);
router.post('/', authenticate, authorize([Role.ADMIN]), createResource);
router.put('/:id', authenticate, authorize([Role.ADMIN]), updateResource);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), deleteResource);

export default router;
