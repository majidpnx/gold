import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  images: string[];
  pricePerGram: number;
  weightGrams: number;
  tags: string[];
  inStock: boolean;
  type: 'jewelry' | 'bar';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  pricePerGram: { type: Number, required: true },
  weightGrams: { type: Number, required: true },
  tags: [{ type: String }],
  inStock: { type: Boolean, default: true },
  type: { type: String, enum: ['jewelry', 'bar'], required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
