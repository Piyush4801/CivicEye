import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  category: string;
  ngoId: mongoose.Types.ObjectId;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  startDate: Date;
  endDate?: Date;
  time: string;
  maxVolunteers: number;
  registeredVolunteers: mongoose.Types.ObjectId[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  images: string[];
  completionReport?: string;
}

const CampaignSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Tree Plantation', 'Lake Cleaning'
    ngoId: { type: Schema.Types.ObjectId, ref: 'Ngo', required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
      address: { type: String, required: true },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    time: { type: String, required: true },
    maxVolunteers: { type: Number, required: true },
    registeredVolunteers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    images: [{ type: String }],
    completionReport: { type: String },
  },
  { timestamps: true }
);

CampaignSchema.index({ location: '2dsphere' });

export const Campaign = mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
