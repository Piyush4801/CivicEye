import express from 'express';
import { getCampaigns, getCampaignById, createCampaign, joinCampaign } from '../controllers/campaignController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getCampaigns)
  .post(protect, createCampaign);

router.route('/:id')
  .get(getCampaignById);

router.route('/:id/join')
  .post(protect, joinCampaign);

export default router;
