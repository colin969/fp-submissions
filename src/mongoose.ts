import * as mongoose from 'mongoose';

export async function openMongooseConn() {
  const url = `mongodb://${process.env.MONGODB_HOSTNAME || 'localhost'}/`;
  console.log(`Connecting to ${url}`);
  return new Promise<void>((resolve, reject) => {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASS,
      dbName: 'submissions'
      }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}