import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  type: string; // e.g., 'Municipality', 'Public Works', 'Electricity'
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
    address: string;
  };
  contactEmail: string;
  contactPhone: string;
  officials: mongoose.Types.ObjectId[];
  performanceScore: number;
  averageResolutionTimeHours: number;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true }
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    officials: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    performanceScore: { type: Number, default: 100 },
    averageResolutionTimeHours: { type: Number, default: 0 }
  },
  { timestamps: true }
);

departmentSchema.index({ location: '2dsphere' });

export const Department = mongoose.model<IDepartment>('Department', departmentSchema);
