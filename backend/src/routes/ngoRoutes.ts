import express from 'express';
import { getNgOs, getNgoById, createNgo } from '../controllers/ngoController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getNgOs)
  .post(protect, createNgo);

router.route('/:id')
  .get(getNgoById);

export default router;
