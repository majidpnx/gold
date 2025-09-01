import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: Array<{
    productId: Types.ObjectId;
    qty: number;
    priceAtOrder: number;
  }>;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, default: 1 },
      priceAtOrder: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
