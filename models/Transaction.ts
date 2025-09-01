import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  userId?: Types.ObjectId;
  type: 'deposit' | 'withdraw' | 'adjust' | 'order';
  amount: number;
  ref?: string;
  authority?: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdraw', 'adjust', 'order'], required: true },
  amount: { type: Number, required: true },
  ref: { type: String },
  authority: { type: String },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
