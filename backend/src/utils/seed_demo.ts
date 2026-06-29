import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Issue } from '../models/Issue';
import { Department } from '../models/Department';
import { Ngo } from '../models/Ngo';
import { Campaign } from '../models/Campaign';
import { News } from '../models/News';

dotenv.config();

const seedDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civiceye');
    console.log('Connected to DB. Wiping old data...');

    await User.deleteMany();
    await Issue.deleteMany();
    await Department.deleteMany();
    await Ngo.deleteMany();
    await Campaign.deleteMany();
    await News.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Top Citizens
    const admin = await User.create({
      name: 'Admin', email: 'admin@civiceye.ai', password: hashedPassword, role: 'admin'
    });
    const official = await User.create({
      name: 'City Commissioner', email: 'official@civiceye.ai', password: hashedPassword, role: 'official', avatarUrl: 'https://i.pravatar.cc/150?u=gov'
    });
    const citizen1 = await User.create({
      name: 'Aisha Sharma', email: 'aisha@civiceye.ai', password: hashedPassword, role: 'citizen', avatarUrl: 'https://i.pravatar.cc/150?u=aisha',
      xp: 2100, level: 5, reputationScore: 1200, impactPoints: 2100,
      stats: { issuesReported: 25, issuesVerified: 22, issuesResolved: 20, volunteerHours: 65 },
      badges: [{ name: 'Legend', icon: '👑', unlockedAt: new Date() }, { name: 'Verified Citizen', icon: '⭐', unlockedAt: new Date() }]
    });

    // 2. Create Departments
    const dept1 = await Department.create({
      name: 'Public Works Department (PWD)', type: 'Public Works', contactEmail: 'pwd@city.gov', contactPhone: '9876543210',
      performanceScore: 85, averageResolutionTimeHours: 96,
      location: { type: 'Point', coordinates: [72.8777, 19.0760], address: 'HQ' }
    }) as any;
    const dept2 = await Department.create({
      name: 'Disaster Management', type: 'Emergency', contactEmail: 'dmc@city.gov', contactPhone: '9876543210',
      performanceScore: 95, averageResolutionTimeHours: 24,
      location: { type: 'Point', coordinates: [72.87, 19.07], address: 'Emergency HQ' }
    }) as any;

    // 3. Create NGOs & Campaigns
    const ngo = await Ngo.create({
      name: 'Green Earth Initiative', logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
      description: 'Restoring urban green spaces.', mission: 'Sustainable cities.', areaOfWork: 'Environment', isVerified: true,
      location: { type: 'Point', coordinates: [72.8777, 19.0760], address: 'Mumbai' },
      contactEmail: 'hello@greenearth.org', contactPhone: '9876543210',
      metrics: { totalVolunteers: 1540, projectsCompleted: 42, citiesServed: 3, transparencyScore: 95, impactScore: 88, citizenRating: 4.8, governmentPartnerships: 2 }
    });

    const campaign = await Campaign.create({
      title: 'Mega Coastal Cleanup Drive',
      description: 'Join us for a city-wide beach cleanup to restore the coastline after the high tide.',
      category: 'Environment',
      ngoId: ngo._id,
      location: { type: 'Point', coordinates: [72.82, 19.10], address: 'Juhu Beach, Mumbai' },
      startDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      endDate: new Date(Date.now() + 86400000 * 4),
      time: '07:00 AM - 11:00 AM',
      maxVolunteers: 100,
      registeredVolunteers: [],
      status: 'upcoming',
      images: ['https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?w=800&q=80']
    });

    // 4. Create News & Alerts
    await News.create({
      title: 'High Tide Alert for Coastal Areas', description: 'Residents advised to stay away from the promenade.',
      content: 'Tides expected to reach 4.5 meters. Disaster teams on standby.', category: 'Emergency Alert',
      tags: ['Weather', 'Alert'], coverImage: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?w=800&q=80',
      author: { name: 'Disaster Management Cell', role: 'Government' }, likes: 340, bookmarks: 112, isEmergency: true
    });

    // 5. Create Issues (Normal & Emergency)
    await Issue.create(
      {
        title: 'Massive Pothole on Link Road',
        description: 'Large pothole causing severe traffic and accidents.',
        category: 'Infrastructure',
        severity: 'high',
        location: { type: 'Point', coordinates: [72.83, 19.11], address: 'Link Road, Andheri West' },
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80',
        status: 'raised',
        reporterId: citizen1._id,
        assignedDepartments: [dept1._id],
        trustScore: 85,
        confidenceMeter: 'High',
        fakeProbability: 5,
        aiAnalysis: {
          isCivicIssue: true, category: 'Infrastructure', severity: 'High', confidence: 92,
          summary: 'Severe road damage causing traffic hazards.', keywords: ['pothole', 'traffic', 'accident'],
          isEmergency: false, estimatedResolutionTime: '3 Days'
        },
        verificationTimeline: [{ action: 'Issue Reported', description: 'Citizen raised the issue.', timestamp: new Date(), actorType: 'citizen' }]
      } as any
    );
      
    await Issue.create(
      {
        title: 'Live Electrical Wire on Footpath',
        description: 'Sparking wire hanging low near the school gate. Highly dangerous!',
        category: 'Electricity',
        severity: 'critical',
        location: { type: 'Point', coordinates: [72.84, 19.12], address: 'SV Road, near Holy Family School' },
        imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=800&q=80',
        status: 'forwarded',
        reporterId: citizen1._id,
        assignedDepartments: [dept2._id],
        trustScore: 98,
        confidenceMeter: 'Verified',
        fakeProbability: 0,
        upvotes: 45,
        aiAnalysis: {
          isCivicIssue: true, category: 'Electricity', severity: 'Critical', confidence: 99,
          summary: 'Life-threatening electrical hazard near pedestrian zone.', keywords: ['sparking wire', 'school', 'danger'],
          isEmergency: true, estimatedResolutionTime: '2 Hours'
        },
        verificationTimeline: [
          { action: 'Issue Reported', description: 'Citizen raised the issue.', timestamp: new Date(Date.now() - 3600000), actorType: 'citizen' },
          { action: 'AI Emergency Flag', description: 'AI detected critical life threat.', timestamp: new Date(Date.now() - 3500000), actorType: 'ai' }
        ]
      } as any
    );

    console.log('Smart City Demo Data Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDemo();
