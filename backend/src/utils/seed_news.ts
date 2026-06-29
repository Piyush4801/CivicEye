import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { News } from '../models/News';

dotenv.config();

const newsItems = [
  {
    title: 'New Metro Line 3 Construction Phase Begins',
    description: 'Expect heavy traffic diversions around the BKC area starting next Monday.',
    content: 'The highly anticipated Metro Line 3 project is moving into its next crucial phase. Construction crews will be laying the groundwork for the underground station at BKC. Commuters are advised to take alternative routes via the Western Express Highway.',
    category: 'Development',
    tags: ['Infrastructure', 'Traffic', 'Metro'],
    coverImage: 'https://images.unsplash.com/photo-1517616656461-827fc697d81a?w=800&q=80',
    author: {
      name: 'MMRDA Official',
      role: 'Government'
    },
    likes: 124,
    bookmarks: 45,
    isEmergency: false
  },
  {
    title: 'High Tide Alert for Coastal Areas',
    description: 'Residents advised to stay away from the promenade between 1:00 PM and 4:00 PM today.',
    content: 'The Meteorological Department has issued a high tide warning for the western coast. Tides are expected to reach up to 4.5 meters. Disaster response teams are on standby.',
    category: 'Emergency Alert',
    tags: ['Weather', 'Safety', 'Alert'],
    coverImage: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?w=800&q=80',
    author: {
      name: 'Disaster Management Cell',
      role: 'Government'
    },
    likes: 340,
    bookmarks: 112,
    isEmergency: true
  },
  {
    title: 'Zero Garbage Ward Initiative Launched',
    description: 'Ward K-West aims to become 100% zero garbage within the next 6 months.',
    content: 'Partnering with local NGOs like Clean City Brigade, the municipality has distributed twin bins to all residential societies in K-West ward to enforce source segregation.',
    category: 'Community News',
    tags: ['Environment', 'Sanitation', 'Initiative'],
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    author: {
      name: 'K-West Ward Officer',
      role: 'Government'
    },
    likes: 512,
    bookmarks: 89,
    isEmergency: false
  }
];

const seedNews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civiceye');
    
    await News.deleteMany();
    await News.insertMany(newsItems);
    
    console.log('Database seeded with News successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding news:', error);
    process.exit(1);
  }
};

seedNews();
