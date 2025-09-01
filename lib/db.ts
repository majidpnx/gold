import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI || '';
// const MONGODB_URI = 'mongodb+srv://mymongofree:mymongofree@cluster0.rnskh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_URI = 'mongodb+srv://mymongofree:mymongofree@cluster0.rnskh.mongodb.net/gold?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}
