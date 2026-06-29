import { Request, Response } from 'express';
import { Issue } from '../models/Issue';
import { AuthRequest } from '../middlewares/authMiddleware';
import { gamificationService } from '../services/gamification.service';
import { trustService } from '../services/trust.service';
import { analyzeIssueWithAI } from '../services/ai.service';

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
export const createIssue = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, category, location, images } = req.body;

  try {
    // Basic validation
    if (!title || !description || !category || !location || !location.coordinates) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    // Call Gemini AI for analysis
    const aiAnalysis = await analyzeIssueWithAI(title, description, category);

    // Map AI risk level to severity enum
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (aiAnalysis.riskLevel.toLowerCase() === 'low') severity = 'low';
    if (aiAnalysis.riskLevel.toLowerCase() === 'high') severity = 'high';
    if (aiAnalysis.riskLevel.toLowerCase() === 'critical') severity = 'critical';

    const issue = await Issue.create({
      title,
      description,
      category,
      severity,
      location: {
        type: 'Point',
        coordinates: location.coordinates, // [lng, lat]
        address: location.address || '',
      },
      images: images || [],
      reporterId: req.user?._id,
      aiAnalysis,
      verificationScore: aiAnalysis.confidence > 80 ? 10 : 0, // Initial boost if AI is confident
    });

    if (req.user) {
      await gamificationService.awardXp(req.user._id.toString(), 'REPORT_ISSUE');
    }
    
    // Add initial timeline entry and calculate initial trust score
    issue.verificationTimeline = [{
      action: 'Issue Reported',
      description: 'Issue reported by citizen via app.',
      timestamp: new Date(),
      actorType: 'citizen'
    }];
    await issue.save();
    await trustService.calculateTrustScore(issue._id.toString());

    res.status(201).json(issue);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all issues (with optional filters)
// @route   GET /api/issues
// @access  Public
export const getIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    // We can add filtering by bounds, category, status later
    const issues = await Issue.find().populate('reporterId', 'name avatarUrl').sort('-createdAt');
    res.json(issues);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get issue by ID
// @route   GET /api/issues/:id
// @access  Public
export const getIssueById = async (req: Request, res: Response) => {
  try {
    const issue = await Issue.findById(req.params.id as string).populate('reporterId', 'name avatarUrl');
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upvote an issue
// @route   PUT /api/issues/:id/upvote
// @access  Private
export const upvoteIssue = async (req: AuthRequest, res: Response) => {
  try {
    const issue = await Issue.findById(req.params.id as string);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    issue.upvotes = (issue.upvotes || 0) + 1;
    await issue.save();
    res.json(issue);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private (Official/Admin)
export const updateIssueStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // In a real app, verify req.user.role === 'official' or 'admin'
    
    const issue = await Issue.findById(id);
    if (!issue) {
      res.status(404).json({ message: 'Issue not found' });
      return;
    }

    issue.status = status;
    const updatedIssue = await issue.save();

    // Award XP to reporter if resolved
    if (status === 'completed' && issue.reporterId) {
      await gamificationService.awardXp(issue.reporterId.toString(), 'ISSUE_RESOLVED');
    }

    res.json(updatedIssue);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload additional evidence for an issue
// @route   POST /api/issues/:id/evidence
// @access  Private
export const uploadEvidence = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // req.file.path contains the Cloudinary URL because of multer-storage-cloudinary
    const issue = await trustService.addEvidence(req.params.id as string, req.user._id.toString(), req.file.path);
    
    // Award XP for uploading evidence
    await gamificationService.awardXp(req.user._id.toString(), 'EVIDENCE');

    res.json(issue);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

