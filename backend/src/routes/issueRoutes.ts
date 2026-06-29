import express from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  upvoteIssue,
  updateIssueStatus,
  uploadEvidence
} from '../controllers/issueController';
import { protect, officialOnly } from '../middlewares/authMiddleware';
import { upload } from '../services/upload.service';

const router = express.Router();

router.route('/')
  .post(protect, createIssue)
  .get(getIssues);

router.route('/:id')
  .get(getIssueById);

router.route('/:id/upvote')
  .put(protect, upvoteIssue);

router.route('/:id/status')
  .put(protect, officialOnly, updateIssueStatus);

router.route('/:id/evidence')
  .post(protect, upload.single('evidence'), uploadEvidence);

export default router;
