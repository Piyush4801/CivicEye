import { Request, Response } from 'express';
import { Department } from '../models/Department';

// @desc    Get department rankings
// @route   GET /api/departments/rankings
// @access  Public
export const getDepartmentRankings = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real app, this score would be calculated dynamically based on Issue resolution times.
    // For now, we sort by performanceScore in descending order.
    const departments = await Department.find()
      .select('name type performanceScore averageResolutionTimeHours')
      .sort({ performanceScore: -1 });
    
    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
