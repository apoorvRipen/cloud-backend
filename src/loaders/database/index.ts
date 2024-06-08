import mongoose from 'mongoose';

mongoose.set('debug', false);
mongoose.set('strictQuery', false);
const databaseLoader = async () => new Promise ( async (resolve, reject) => {
  try {
    const db = await mongoose.connect(String(process.env.MONGO_URI));
    console.log('Database connection established');

    resolve(db);
  } catch (err) {
    reject(err);
  }
});

export { databaseLoader };
