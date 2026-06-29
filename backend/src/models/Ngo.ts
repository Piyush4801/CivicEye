import mongoose, { Document, Schema } from 'mongoose';

export interface INgo extends Document {
  name: string;
  logo: string;
  description: string;
  mission: string;
  areaOfWork: string;
  isVerified: boolean;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  contactEmail: string;
  contactPhone: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  metrics: {
    totalVolunteers: number;
    projectsCompleted: number;
    citiesServed: number;
    transparencyScore: number;
    impactScore: number;
    citizenRating: number;
    governmentPartnerships: number;
  };
  successStories: {
    title: string;
    description: string;
    image: string;
  }[];
}

const NgoSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String, required: true },
    mission: { type: String, required: true },
    areaOfWork: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
      address: { type: String, required: true },
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    website: { type: String },
    socialLinks: {
      twitter: String,
      facebook: String,
      instagram: String,
    },
    metrics: {
      totalVolunteers: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
      citiesServed: { type: Number, default: 0 },
      transparencyScore: { type: Number, default: 0 }, // Out of 100
      impactScore: { type: Number, default: 0 }, // Out of 100
      citizenRating: { type: Number, default: 0 }, // Out of 5
      governmentPartnerships: { type: Number, default: 0 },
    },
    successStories: [
      {
        title: { type: String },
        description: { type: String },
        image: { type: String },
      },
    ],
  },
  { timestamps: true }
);

NgoSchema.index({ location: '2dsphere' });

export const Ngo = mongoose.models.Ngo || mongoose.model<INgo>('Ngo', NgoSchema);
