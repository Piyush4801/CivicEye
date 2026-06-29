import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  description: string;
  content: string; // Full HTML or Markdown body
  category: string;
  tags: string[];
  coverImage: string;
  author: {
    name: string;
    role: string;
  };
  likes: number;
  bookmarks: number;
  isEmergency: boolean;
}

const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Emergency Alert', 'Development'
    tags: [{ type: String }],
    coverImage: { type: String, required: true },
    author: {
      name: { type: String, required: true },
      role: { type: String, required: true } // e.g., 'Gov Official', 'Admin'
    },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    isEmergency: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const News = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
