import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Department } from '../models/Department';

dotenv.config();

const departments = [
  {
    name: 'Municipal Corporation',
    type: 'Municipality',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
      address: 'Mumbai Head Office'
    },
    contactEmail: 'contact@mcgm.gov.in',
    contactPhone: '1916',
    performanceScore: 92,
    averageResolutionTimeHours: 24,
  },
  {
    name: 'Public Works Department',
    type: 'Infrastructure',
    location: {
      type: 'Point',
      coordinates: [72.88, 19.08],
      address: 'PWD Central'
    },
    contactEmail: 'pwd@gov.in',
    contactPhone: '18001234',
    performanceScore: 78,
    averageResolutionTimeHours: 72,
  },
  {
    name: 'Electricity Board',
    type: 'Utilities',
    location: {
      type: 'Point',
      coordinates: [72.89, 19.09],
      address: 'MSEB HQ'
    },
    contactEmail: 'power@mseb.in',
    contactPhone: '1912',
    performanceScore: 85,
    averageResolutionTimeHours: 48,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civiceye');
    
    // Clear existing
    await Department.deleteMany();
    
    // Insert new
    await Department.insertMany(departments);
    
    console.log('Database seeded with Departments successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
