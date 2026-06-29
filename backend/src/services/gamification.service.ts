import { User } from '../models/User';

export class GamificationService {
  private readonly XP_TABLE = {
    REPORT_ISSUE: 50,
    ISSUE_RESOLVED: 100,
    VOLUNTEER: 80,
    VOTE: 10,
    EVIDENCE: 20
  };

  private calculateLevel(xp: number): number {
    // Simple progression: Level = floor(sqrt(XP / 100)) + 1
    // 0 XP -> Lvl 1
    // 100 XP -> Lvl 2
    // 400 XP -> Lvl 3
    // 900 XP -> Lvl 4
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  async awardXp(userId: string, action: keyof typeof this.XP_TABLE) {
    const user = await User.findById(userId);
    if (!user) return;

    const gainedXp = this.XP_TABLE[action] || 10;
    user.xp += gainedXp;
    
    // Update impact points (1:1 with XP for now, but could be weighted differently)
    user.impactPoints += gainedXp;

    // Update stats based on action
    if (!user.stats) {
      user.stats = { issuesReported: 0, issuesVerified: 0, issuesResolved: 0, volunteerHours: 0 };
    }
    if (action === 'REPORT_ISSUE') {
      user.stats.issuesReported = (user.stats.issuesReported || 0) + 1;
    } else if (action === 'ISSUE_RESOLVED') {
      user.stats.issuesResolved = (user.stats.issuesResolved || 0) + 1;
    }

    const newLevel = this.calculateLevel(user.xp);
    if (newLevel > user.level) {
      user.level = newLevel;
      // In a real app, emit a socket event here for "LEVEL UP!" animation
    }

    // Check for badges
    await this.checkBadges(user);

    await user.save();
    return user;
  }

  private async checkBadges(user: any) {
    const existingBadgeNames = user.badges.map((b: any) => b.name);

    if (user.stats.issuesReported >= 1 && !existingBadgeNames.includes('First Voice')) {
      user.badges.push({ name: 'First Voice', icon: '📢', unlockedAt: new Date() });
    }

    if (user.stats.issuesReported >= 10 && !existingBadgeNames.includes('Verified Citizen')) {
      user.badges.push({ name: 'Verified Citizen', icon: '⭐', unlockedAt: new Date() });
    }
    
    if (user.stats.volunteerHours >= 10 && !existingBadgeNames.includes('Volunteer Champion')) {
      user.badges.push({ name: 'Volunteer Champion', icon: '🤝', unlockedAt: new Date() });
    }
  }

  async getTopCitizens() {
    return await User.find({ role: 'citizen' })
      .select('name avatarUrl xp level reputationScore badges impactPoints')
      .sort({ reputationScore: -1, xp: -1 })
      .limit(10);
  }
}

export const gamificationService = new GamificationService();
