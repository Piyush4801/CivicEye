import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Ngo } from '../models/Ngo';
import { Campaign } from '../models/Campaign';

dotenv.config();

const ngos = [
  {
    name: 'Green Earth Initiative',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
    description: 'A passionate group of environmentalists dedicated to restoring urban green spaces and combating climate change through community action.',
    mission: 'To create sustainable and breathable cities by planting trees and cleaning water bodies.',
    areaOfWork: 'Environment',
    isVerified: true,
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
      address: 'Mumbai Central'
    },
    contactEmail: 'hello@greenearth.org',
    contactPhone: '9876543210',
    website: 'https://greenearth.org',
    metrics: {
      totalVolunteers: 1540,
      projectsCompleted: 42,
      citiesServed: 3,
      transparencyScore: 95,
      impactScore: 88,
      citizenRating: 4.8,
      governmentPartnerships: 2
    },
    successStories: [
      {
        title: 'Reviving Sanjay Gandhi National Park',
        description: 'Planted over 5000 saplings in a single weekend with the help of 300 volunteers.',
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80'
      }
    ]
  },
  {
    name: 'Clean City Brigade',
    logo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
    description: 'Focusing on waste management, recycling awareness, and keeping our streets clean.',
    mission: 'Zero waste cities by 2030.',
    areaOfWork: 'Sanitation',
    isVerified: true,
    location: {
      type: 'Point',
      coordinates: [72.88, 19.08],
      address: 'Andheri East'
    },
    contactEmail: 'contact@cleancity.org',
    contactPhone: '9876543211',
    metrics: {
      totalVolunteers: 850,
      projectsCompleted: 120,
      citiesServed: 1,
      transparencyScore: 92,
      impactScore: 90,
      citizenRating: 4.9,
      governmentPartnerships: 4
    },
    successStories: []
  }
];

const seedCommunity = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civiceye');
    
    await Ngo.deleteMany();
    await Campaign.deleteMany();
    
    const insertedNgos = await Ngo.insertMany(ngos);
    
    const campaigns = [
      {
        title: 'Mega Beach Cleanup Drive',
        description: 'Join us for a massive cleanup drive at Juhu Beach following the recent festival. Gloves and bags will be provided.',
        category: 'Garbage Cleanup',
        ngoId: insertedNgos[1]._id, // Clean City Brigade
        location: {
          type: 'Point',
          coordinates: [72.8258, 19.0988],
          address: 'Juhu Beach, Mumbai'
        },
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        time: '07:00 AM',
        maxVolunteers: 200,
        registeredVolunteers: [],
        status: 'upcoming',
        images: ['https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?w=800&q=80']
      },
      {
        title: 'Urban Forest Plantation',
        description: 'Help us plant 1000 native trees to create a Miyawaki forest in the heart of the city.',
        category: 'Tree Plantation',
        ngoId: insertedNgos[0]._id, // Green Earth Initiative
        location: {
          type: 'Point',
          coordinates: [72.87, 19.12],
          address: 'Aarey Forest Edge'
        },
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
        time: '08:00 AM',
        maxVolunteers: 100,
        registeredVolunteers: [],
        status: 'upcoming',
        images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80']
      }
    ];

    await Campaign.insertMany(campaigns);
    
    console.log('Database seeded with NGOs and Campaigns successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCommunity();
