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

const seedReal = async () => {
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

    // 1. Create Users
    console.log('Seeding Users...');
    const admin = await User.create({
      name: 'System Admin', email: 'admin@civiceye.ai', password: hashedPassword, role: 'admin'
    });
    const official1 = await User.create({
      name: 'Prakash Deshmukh (BMC)', email: 'prakash@bmc.gov.in', password: hashedPassword, role: 'official', avatarUrl: 'https://i.pravatar.cc/150?img=11'
    });
    const official2 = await User.create({
      name: 'Sunita Rao (Traffic Police)', email: 'sunita.rao@traffic.gov', password: hashedPassword, role: 'official', avatarUrl: 'https://i.pravatar.cc/150?img=5'
    });
    
    const citizen1 = await User.create({
      name: 'Aisha Sharma', email: 'aisha@example.com', password: hashedPassword, role: 'citizen', avatarUrl: 'https://i.pravatar.cc/150?img=9',
      xp: 2100, level: 5, reputationScore: 1200, impactPoints: 2100,
      stats: { issuesReported: 25, issuesVerified: 22, issuesResolved: 20, volunteerHours: 65 },
      badges: [{ name: 'Legend', icon: '👑', unlockedAt: new Date() }, { name: 'Verified Citizen', icon: '⭐', unlockedAt: new Date() }]
    });
    const citizen2 = await User.create({
      name: 'Rahul Verma', email: 'rahul@example.com', password: hashedPassword, role: 'citizen', avatarUrl: 'https://i.pravatar.cc/150?img=12',
      xp: 1850, level: 4, reputationScore: 980, impactPoints: 1850,
      stats: { issuesReported: 18, issuesVerified: 15, issuesResolved: 12, volunteerHours: 40 },
      badges: [{ name: 'Community Hero', icon: '🦸‍♂️', unlockedAt: new Date() }]
    });
    const citizen3 = await User.create({
      name: 'Vikram Singh', email: 'vikram@example.com', password: hashedPassword, role: 'citizen', avatarUrl: 'https://i.pravatar.cc/150?img=14',
      xp: 920, level: 3, reputationScore: 600, impactPoints: 920,
      stats: { issuesReported: 10, issuesVerified: 8, issuesResolved: 5, volunteerHours: 12 },
      badges: [{ name: 'First Voice', icon: '📢', unlockedAt: new Date() }]
    });

    // 2. Create Departments
    console.log('Seeding Departments...');
    const deptPWD = await Department.create({
      name: 'Public Works Department (PWD)', type: 'Infrastructure', contactEmail: 'pwd@mumbai.gov', contactPhone: '1800-22-1234',
      performanceScore: 78, averageResolutionTimeHours: 96,
      location: { type: 'Point', coordinates: [72.8777, 19.0760], address: 'PWD HQ, Fort, Mumbai' }
    }) as any;
    const deptTraffic = await Department.create({
      name: 'Mumbai Traffic Police', type: 'Public Safety', contactEmail: 'traffic@mumbaipolice.gov', contactPhone: '103',
      performanceScore: 88, averageResolutionTimeHours: 12,
      location: { type: 'Point', coordinates: [72.8258, 19.0144], address: 'Worli Police Camp' }
    }) as any;
    const deptWater = await Department.create({
      name: 'Water Supply Department (BMC)', type: 'Utilities', contactEmail: 'water@bmc.gov.in', contactPhone: '1916',
      performanceScore: 82, averageResolutionTimeHours: 48,
      location: { type: 'Point', coordinates: [72.83, 19.11], address: 'Andheri West Ward Office' }
    }) as any;
    const deptSWM = await Department.create({
      name: 'Solid Waste Management', type: 'Sanitation', contactEmail: 'swm@bmc.gov.in', contactPhone: '1916',
      performanceScore: 65, averageResolutionTimeHours: 120,
      location: { type: 'Point', coordinates: [72.90, 19.05], address: 'Chembur East Ward Office' }
    }) as any;

    // 3. Create NGOs & Campaigns
    console.log('Seeding NGOs & Campaigns...');
    const ngoGreen = await Ngo.create({
      name: 'Green Earth Initiative', logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
      description: 'Restoring urban green spaces and combating climate change.', mission: 'Sustainable cities.', areaOfWork: 'Environment', isVerified: true,
      location: { type: 'Point', coordinates: [72.8777, 19.0760], address: 'Dadar, Mumbai' },
      contactEmail: 'hello@greenearth.org', contactPhone: '9876543210',
      metrics: { totalVolunteers: 1540, projectsCompleted: 42, citiesServed: 3, transparencyScore: 95, impactScore: 88, citizenRating: 4.8, governmentPartnerships: 2 }
    });
    const ngoClean = await Ngo.create({
      name: 'Clean City Brigade', logo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
      description: 'Focusing on waste management and recycling awareness.', mission: 'Zero waste cities by 2030.', areaOfWork: 'Sanitation', isVerified: true,
      location: { type: 'Point', coordinates: [72.88, 19.08], address: 'Andheri East, Mumbai' },
      contactEmail: 'contact@cleancity.org', contactPhone: '9876543211',
      metrics: { totalVolunteers: 850, projectsCompleted: 120, citiesServed: 1, transparencyScore: 92, impactScore: 90, citizenRating: 4.9, governmentPartnerships: 4 }
    });
    const ngoStray = await Ngo.create({
      name: 'Paws & Care Foundation', logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
      description: 'Rescuing and treating injured stray animals on city streets.', mission: 'Compassion for all species.', areaOfWork: 'Animal Welfare', isVerified: true,
      location: { type: 'Point', coordinates: [72.83, 19.12], address: 'Malad West, Mumbai' },
      contactEmail: 'help@pawscare.org', contactPhone: '9999888877',
      metrics: { totalVolunteers: 320, projectsCompleted: 85, citiesServed: 1, transparencyScore: 98, impactScore: 94, citizenRating: 4.7, governmentPartnerships: 1 }
    });

    await Campaign.create([
      {
        title: 'Mega Juhu Beach Cleanup', description: 'Join us for a massive cleanup drive after the festival season.',
        category: 'Sanitation', ngoId: ngoClean._id, location: { type: 'Point', coordinates: [72.8258, 19.0988], address: 'Juhu Beach, Mumbai' },
        startDate: new Date(Date.now() + 86400000 * 5), endDate: new Date(Date.now() + 86400000 * 5 + 14400000), time: '07:00 AM - 11:00 AM',
        maxVolunteers: 200, registeredVolunteers: [citizen1._id, citizen2._id], status: 'upcoming',
        images: ['https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?w=800&q=80']
      },
      {
        title: 'Aarey Forest Plantation Drive', description: 'Planting 2000 native saplings to restore degraded patches.',
        category: 'Environment', ngoId: ngoGreen._id, location: { type: 'Point', coordinates: [72.8687, 19.1481], address: 'Aarey Milk Colony' },
        startDate: new Date(Date.now() + 86400000 * 12), endDate: new Date(Date.now() + 86400000 * 12 + 28800000), time: '08:00 AM - 04:00 PM',
        maxVolunteers: 150, registeredVolunteers: [citizen3._id], status: 'upcoming',
        images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80']
      },
      {
        title: 'Anti-Rabies Vaccination Camp', description: 'Free vaccination for strays in the western suburbs.',
        category: 'Animal Welfare', ngoId: ngoStray._id, location: { type: 'Point', coordinates: [72.83, 19.18], address: 'Borivali West' },
        startDate: new Date(Date.now() - 86400000 * 2), endDate: new Date(Date.now() - 86400000 * 2 + 14400000), time: '10:00 AM - 02:00 PM',
        maxVolunteers: 50, registeredVolunteers: [citizen1._id], status: 'completed',
        images: ['https://images.unsplash.com/photo-1623387641177-e8a49c0b37f4?w=800&q=80']
      }
    ]);

    // 4. Create News & Alerts
    console.log('Seeding News...');
    await News.create([
      {
        title: 'CivicEye AI Detection System Goes Live', description: 'Our new AI engine will now automatically categorize and route citizen reports.',
        content: 'A major milestone for urban management! The new CivicEye AI will analyze image uploads, identify severity, and instantly route issues to the correct municipal department without human intervention.',
        category: 'Platform Update', tags: ['CivicEye', 'AI', 'Launch'], coverImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80',
        author: { name: 'CivicEye Core Team', role: 'Admin' }, likes: 1205, bookmarks: 145, isEmergency: false
      },
      {
        title: 'Major Pothole Repair Drive Starts This Weekend', description: 'Local municipal workers and citizen volunteers join hands.',
        content: 'Following a massive influx of pothole reports, a joint initiative between the BMC and local citizens will commence this weekend to patch up arterial roads.',
        category: 'Community News', tags: ['Roads', 'Repairs', 'Volunteering'], coverImage: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&q=80',
        author: { name: 'CivicEye Editor', role: 'Admin' }, likes: 450, bookmarks: 60, isEmergency: false
      },
      {
        title: 'Heavy Rainfall Warning for Next 48 Hours', description: 'Red alert issued for Mumbai and suburbs.',
        content: 'The IMD has issued a red alert predicting extremely heavy rainfall over the next 48 hours. Citizens are advised to stay indoors and avoid low-lying areas.',
        category: 'Emergency Alert', tags: ['Weather', 'Monsoon', 'Alert'], coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80',
        author: { name: 'Disaster Management Cell', role: 'Government' }, likes: 854, bookmarks: 320, isEmergency: true
      }
    ]);

    // 5. Create Issues
    console.log('Seeding Issues...');
    await Issue.create([
      {
        title: 'Massive Pothole near Metro Site', description: 'Extremely deep pothole causing severe traffic jams during rush hour.',
        category: 'Infrastructure', severity: 'high', location: { type: 'Point', coordinates: [72.86, 19.07], address: 'BKC Road, Bandra East' },
        images: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80'],
        status: 'forwarded', reporterId: citizen1._id, assignedDepartments: [deptPWD._id, deptTraffic._id],
        trustScore: 92, confidenceMeter: 'High', fakeProbability: 2, upvotes: 145,
        aiAnalysis: { isCivicIssue: true, category: 'Infrastructure', severity: 'High', confidence: 95, summary: 'Deep pothole on arterial road', keywords: ['pothole', 'traffic', 'hazard'], isEmergency: false, estimatedResolutionTime: '3 Days' },
        createdAt: new Date(Date.now() - 86400000 * 2)
      },
      {
        title: 'Burst Water Pipe Flooding Street', description: 'Thousands of liters of drinking water being wasted since morning.',
        category: 'Water', severity: 'critical', location: { type: 'Point', coordinates: [72.84, 19.12], address: 'SV Road, Andheri West' },
        images: ['https://images.unsplash.com/photo-1584285420371-12f71694f4c2?w=800&q=80'],
        status: 'completed', reporterId: citizen2._id, assignedDepartments: [deptWater._id],
        trustScore: 98, confidenceMeter: 'Verified', fakeProbability: 0, upvotes: 210,
        aiAnalysis: { isCivicIssue: true, category: 'Water', severity: 'Critical', confidence: 99, summary: 'Major pipeline burst', keywords: ['water leak', 'wastage', 'pipeline'], isEmergency: true, estimatedResolutionTime: '6 Hours' },
        createdAt: new Date(Date.now() - 86400000 * 5)
      },
      {
        title: 'Illegal Garbage Dumping on Vacant Plot', description: 'Construction debris and garbage being dumped at night.',
        category: 'Garbage', severity: 'medium', location: { type: 'Point', coordinates: [72.91, 19.06], address: 'Near Diamond Garden, Chembur' },
        images: ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80'],
        status: 'raised', reporterId: citizen3._id, assignedDepartments: [deptSWM._id],
        trustScore: 75, confidenceMeter: 'Medium', fakeProbability: 15, upvotes: 42,
        aiAnalysis: { isCivicIssue: true, category: 'Garbage', severity: 'Medium', confidence: 85, summary: 'Illegal debris dumping', keywords: ['garbage', 'debris', 'health hazard'], isEmergency: false, estimatedResolutionTime: '7 Days' },
        createdAt: new Date(Date.now() - 43200000)
      },
      {
        title: 'Non-functioning Streetlights', description: 'Entire stretch of road is pitch dark, making it unsafe for pedestrians.',
        category: 'Electricity', severity: 'medium', location: { type: 'Point', coordinates: [72.83, 19.05], address: 'Carter Road Promenade, Bandra West' },
        images: ['https://images.unsplash.com/photo-1517260739337-6799d239ce83?w=800&q=80'],
        status: 'forwarded', reporterId: citizen2._id, assignedDepartments: [deptPWD._id],
        trustScore: 88, confidenceMeter: 'High', fakeProbability: 5, upvotes: 89,
        aiAnalysis: { isCivicIssue: true, category: 'Electricity', severity: 'Medium', confidence: 90, summary: 'Streetlights out over long stretch', keywords: ['streetlights', 'darkness', 'safety'], isEmergency: false, estimatedResolutionTime: '48 Hours' },
        createdAt: new Date(Date.now() - 86400000 * 1.5)
      },
      {
        title: 'Fallen Tree Blocking Major Intersection', description: 'Huge banyan tree fell during the storm, completely blocking traffic.',
        category: 'Infrastructure', severity: 'critical', location: { type: 'Point', coordinates: [72.825, 18.995], address: 'Worli Sea Face Road' },
        images: ['https://images.unsplash.com/photo-1597843817122-cbbf2810ecdf?w=800&q=80'],
        status: 'repair_started', reporterId: citizen1._id, assignedDepartments: [deptPWD._id, deptTraffic._id],
        trustScore: 99, confidenceMeter: 'Verified', fakeProbability: 0, upvotes: 350,
        aiAnalysis: { isCivicIssue: true, category: 'Infrastructure', severity: 'Critical', confidence: 99, summary: 'Fallen tree obstructing traffic', keywords: ['fallen tree', 'blockage', 'storm damage'], isEmergency: true, estimatedResolutionTime: '4 Hours' },
        createdAt: new Date(Date.now() - 7200000)
      }
    ] as any[]);

    console.log('Real Data Seeded Successfully! The platform is now populated with rich realistic records.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedReal();
