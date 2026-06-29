import express from 'express';
import { getUserProfile, getTopCitizens, getUsersByRole } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsersByRole);
router.get('/top', getTopCitizens);
router.get('/:id', getUserProfile);

export default router;
