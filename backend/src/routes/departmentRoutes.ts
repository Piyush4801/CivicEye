import express from 'express';
import { getDepartmentRankings } from '../controllers/departmentController';

const router = express.Router();

router.get('/rankings', getDepartmentRankings);

export default router;
