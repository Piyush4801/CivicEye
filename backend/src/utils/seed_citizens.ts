import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civiceye');
    
    // Create some top citizens
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const citizens = [
      {
        name: 'Aisha Sharma',
        email: 'aisha@example.com',
        password: hashedPassword,
        role: 'citizen',
        avatarUrl: 'https://i.pravatar.cc/150?u=aisha',
        xp: 1450,
        level: 4,
        reputationScore: 950,
        impactPoints: 1450,
        stats: {
          issuesReported: 18,
          issuesVerified: 15,
          issuesResolved: 12,
          volunteerHours: 40
        },
        badges: [
          { name: 'First Voice', icon: '📢', unlockedAt: new Date() },
          { name: 'Verified Citizen', icon: '⭐', unlockedAt: new Date() },
          { name: 'Community Hero', icon: '🦸‍♀️', unlockedAt: new Date() },
          { name: 'Volunteer Champion', icon: '🤝', unlockedAt: new Date() }
        ]
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        password: hashedPassword,
        role: 'citizen',
        avatarUrl: 'https://i.pravatar.cc/150?u=rahul',
        xp: 820,
        level: 3,
        reputationScore: 620,
        impactPoints: 820,
        stats: {
          issuesReported: 8,
          issuesVerified: 7,
          issuesResolved: 5,
          volunteerHours: 15
        },
        badges: [
          { name: 'First Voice', icon: '📢', unlockedAt: new Date() },
          { name: 'Volunteer Champion', icon: '🤝', unlockedAt: new Date() }
        ]
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: hashedPassword,
        role: 'citizen',
        avatarUrl: 'https://i.pravatar.cc/150?u=priya',
        xp: 2100,
        level: 5,
        reputationScore: 1200,
        impactPoints: 2100,
        stats: {
          issuesReported: 25,
          issuesVerified: 22,
          issuesResolved: 20,
          volunteerHours: 65
        },
        badges: [
          { name: 'First Voice', icon: '📢', unlockedAt: new Date() },
          { name: 'Verified Citizen', icon: '⭐', unlockedAt: new Date() },
          { name: 'Legend', icon: '👑', unlockedAt: new Date() }
        ]
      }
    ];

    // Don't delete all users, just insert these if they don't exist
    for (const c of citizens) {
      const exists = await User.findOne({ email: c.email });
      if (!exists) {
        await User.create(c as any);
      }
    }
    
    console.log('Database seeded with Top Citizens successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding citizens:', error);
    process.exit(1);
  }
};

seedUsers();
