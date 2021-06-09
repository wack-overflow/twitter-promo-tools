import { Db, MongoClient } from 'mongodb';
import { Collection } from 'mongodb';
import { CollectionTypeMap } from '@/types';

// Create cached connection variable
let cachedDb: Db;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
export const connectToDatabase = async (): Promise<Db> => {
  const uri = process.env.MONGODB_URI!;
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  // Select the database through the connection,
  // using the database path of the connection string
  const dbName = new URL(uri).pathname.substr(1);
  const db = client.db(dbName);

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}

export const getCollection = async <TKey extends keyof CollectionTypeMap>(key: TKey) => {
  const db = await connectToDatabase();
  return db.collection(key) as Collection<CollectionTypeMap[TKey]>;
};