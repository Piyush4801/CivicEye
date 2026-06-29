import { Request, Response } from 'express';
import { User } from '../models/User';
import { gamificationService } from '../services/gamification.service';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getTopCitizens = async (req: Request, res: Response) => {
  try {
    const topCitizens = await gamificationService.getTopCitizens();
    res.json(topCitizens);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const role = req.query.role;
    const query = role ? { role } : {};
    const users = await User.find(query as any).select('-password');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
