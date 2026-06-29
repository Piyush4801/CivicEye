import { Issue } from '../models/Issue';

export class TrustService {
  
  async calculateTrustScore(issueId: string) {
    const issue = await Issue.findById(issueId);
    if (!issue) throw new Error('Issue not found');

    let baseScore = 20; // Base score for just being reported
    let fakeProb = 0;
    const timeline = issue.verificationTimeline || [];

    // 1. AI Confidence Factor (max +30)
    if (issue.aiAnalysis?.confidence) {
      baseScore += (issue.aiAnalysis.confidence / 100) * 30;
      if (issue.aiAnalysis.confidence < 40) fakeProb += 20;
    }

    // 2. Evidence Factor (max +25)
    if (issue.evidence && issue.evidence.length > 0) {
      baseScore += Math.min(issue.evidence.length * 10, 25); // +10 per evidence image, max 25
      if (issue.evidence.length === 0) fakeProb += 30;
    }

    // 3. Upvotes / Community Factor (max +25)
    if (issue.upvotes > 0) {
      baseScore += Math.min(issue.upvotes * 5, 25);
    }

    // 4. Verification Score Factor (Official/AI verifications)
    baseScore += (issue.verificationScore || 0);

    // Normalize
    const finalTrustScore = Math.min(Math.max(Math.round(baseScore), 0), 100);
    const finalFakeProb = Math.min(Math.max(Math.round(fakeProb), 0), 100);

    issue.trustScore = finalTrustScore;
    issue.fakeProbability = finalFakeProb;

    // Set Confidence Meter String
    if (finalTrustScore >= 90) issue.confidenceMeter = 'Verified';
    else if (finalTrustScore >= 70) issue.confidenceMeter = 'High';
    else if (finalTrustScore >= 40) issue.confidenceMeter = 'Medium';
    else issue.confidenceMeter = 'Low';

    await issue.save();
    return issue;
  }

  async addEvidence(issueId: string, userId: string, url: string) {
    const issue = await Issue.findById(issueId);
    if (!issue) throw new Error('Issue not found');

    if (!issue.evidence) issue.evidence = [];
    issue.evidence.push({
      url,
      uploadedBy: userId as any,
      timestamp: new Date()
    });

    if (!issue.verificationTimeline) issue.verificationTimeline = [];
    issue.verificationTimeline.push({
      action: 'Evidence Added',
      description: 'New visual evidence uploaded by community member.',
      timestamp: new Date(),
      actorType: 'citizen'
    });

    await issue.save();
    
    // Recalculate Trust Score automatically
    return await this.calculateTrustScore(issueId);
  }
}

export const trustService = new TrustService();
