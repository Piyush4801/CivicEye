import { Campaign } from '../models/Campaign';

export class CampaignService {
  async getAllCampaigns() {
    return await Campaign.find().populate('ngoId', 'name logo').sort({ startDate: 1 });
  }

  async getCampaignById(id: string) {
    return await Campaign.findById(id).populate('ngoId', 'name logo');
  }

  async createCampaign(data: any) {
    const campaign = new Campaign(data);
    return await campaign.save();
  }

  async joinCampaign(campaignId: string, userId: string) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    if (campaign.registeredVolunteers.includes(userId as any)) {
      throw new Error('Already registered');
    }

    if (campaign.registeredVolunteers.length >= campaign.maxVolunteers) {
      throw new Error('Campaign is full');
    }

    campaign.registeredVolunteers.push(userId as any);
    return await campaign.save();
  }
}

export const campaignService = new CampaignService();
