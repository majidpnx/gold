import { MongoClient } from 'mongodb';

// Set fallback URI if not provided
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment variables. Using fallback.');
  process.env.MONGODB_URI = 'mongodb://localhost:27017/gold-trading';
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
