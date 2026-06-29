import { Request, Response } from 'express';
import { campaignService } from '../services/campaign.service';
import { AuthRequest } from '../middlewares/authMiddleware';
import { gamificationService } from '../services/gamification.service';

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.getAllCampaigns();
    res.json(campaigns);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id as string);
    if (!campaign) {
       return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const joinCampaign = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const campaign = await campaignService.joinCampaign(req.params.id as string, req.user._id.toString());
    
    // Award XP
    await gamificationService.awardXp(req.user._id.toString(), 'VOLUNTEER');
    
    res.json({ message: 'Successfully joined campaign', campaign });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
