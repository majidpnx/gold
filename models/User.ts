import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  phone: string;
  password?: string;
  image?: string;
  userType: 'user' | 'technician' | 'admin';
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  userType: { type: String, enum: ['user', 'technician', 'admin'], default: 'user' },
  walletBalance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
