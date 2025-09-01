import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITrade extends Document {
  userId: Types.ObjectId;
  type: 'buy' | 'sell';
  grams: number;
  unitPrice: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const TradeSchema = new Schema<ITrade>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  grams: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Trade || mongoose.model<ITrade>('Trade', TradeSchema);
