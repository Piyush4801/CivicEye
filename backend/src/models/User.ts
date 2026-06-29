import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'citizen' | 'official' | 'admin' | 'ngo';
  avatarUrl?: string;
  xp: number;
  level: number;
  reputationScore: number;
  impactPoints: number;
  stats: {
    issuesReported: number;
    issuesVerified: number;
    issuesResolved: number;
    volunteerHours: number;
  };
  badges: {
    name: string;
    icon: string;
    unlockedAt: Date;
  }[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { 
      type: String, 
      enum: ['citizen', 'official', 'admin', 'ngo'],
      default: 'citizen'
    },
    avatarUrl: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    reputationScore: { type: Number, default: 100 },
    impactPoints: { type: Number, default: 0 },
    stats: {
      issuesReported: { type: Number, default: 0 },
      issuesVerified: { type: Number, default: 0 },
      issuesResolved: { type: Number, default: 0 },
      volunteerHours: { type: Number, default: 0 },
    },
    badges: [
      {
        name: { type: String },
        icon: { type: String },
        unlockedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
