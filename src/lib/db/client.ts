import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zenith';

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to get database
export async function getDatabase() {
  const client = await clientPromise;
  return client.db('myApp');
}

// Helper function to check connection status
export async function checkConnection() {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    return { status: 'connected', message: 'Successfully connected to MongoDB' };
  } catch (error) {
    return { status: 'error', message: `Failed to connect: ${error}` };
  }
}