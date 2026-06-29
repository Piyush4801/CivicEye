import mongoose, { Document, Schema } from 'mongoose';

export interface IIssue extends Document {
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'raised' | 'verified' | 'forwarded' | 'accepted' | 'inspection' | 'repair_started' | 'completed' | 'rejected';
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
    address?: string;
  };
  images: string[];
  videos?: string[];
  reporterId: mongoose.Types.ObjectId;
  assignedDepartments: mongoose.Types.ObjectId[];
  aiAnalysis?: {
    confidence: number;
    summary: string;
    keywords?: string[];
    isEmergency?: boolean;
    estimatedResolutionTime?: string;
  };
  verificationScore: number;
  trustScore: number; // 0 to 100
  confidenceMeter: string; // 'Low', 'Medium', 'High', 'Verified'
  riskScore: number; // For duplicate/fake probability
  verificationTimeline: {
    action: string;
    description: string;
    timestamp: Date;
    actorType: 'ai' | 'citizen' | 'official' | 'system';
  }[];
  evidence: {
    url: string;
    uploadedBy: mongoose.Types.ObjectId;
    timestamp: Date;
  }[];
  fakeProbability: number;
  upvotes: number;
}

const issueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'], 
      required: true 
    },
    status: {
      type: String,
      enum: ['raised', 'verified', 'forwarded', 'accepted', 'inspection', 'repair_started', 'completed', 'rejected'],
      default: 'raised'
    },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
      address: { type: String }
    },
    images: [{ type: String }],
    videos: [{ type: String }],
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDepartments: [{ type: Schema.Types.ObjectId, ref: 'Department' }],
    aiAnalysis: {
      isCivicIssue: { type: Boolean },
      category: { type: String },
      severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
      confidence: { type: Number },
      summary: { type: String },
      keywords: [{ type: String }],
      isEmergency: { type: Boolean, default: false },
      estimatedResolutionTime: { type: String }
    },
    verificationScore: { type: Number, default: 0 },
    trustScore: { type: Number, default: 0 },
    confidenceMeter: { type: String, enum: ['Low', 'Medium', 'High', 'Verified'], default: 'Low' },
    riskScore: { type: Number, default: 0 },
    fakeProbability: { type: Number, default: 0 },
    verificationTimeline: [
      {
        action: { type: String },
        description: { type: String },
        timestamp: { type: Date, default: Date.now },
        actorType: { type: String, enum: ['ai', 'citizen', 'official', 'system'] }
      }
    ],
    evidence: [
      {
        url: { type: String },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    upvotes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

issueSchema.index({ location: '2dsphere' });

export const Issue = mongoose.model<IIssue>('Issue', issueSchema);
