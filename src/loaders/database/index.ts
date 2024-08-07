import mongoose from 'mongoose';
import { migration } from '../../migrations';

mongoose.set('debug', false);
mongoose.set('strictQuery', false);
const databaseLoader = async () => new Promise(async (resolve, reject) => {
  try {
    const db = await mongoose.connect(String(process.env.MONGO_URI));
    console.log('Database connection established');

    if (process.argv[2]) {
      console.log('Migration Initiate');
      const result = await migration(process.argv[2])
      reject(result);
    }

    resolve(db);
  } catch (err) {
    reject(err);
  }
});

export { databaseLoader };
