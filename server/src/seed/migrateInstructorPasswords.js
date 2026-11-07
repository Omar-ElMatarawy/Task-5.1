import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { Instructor } from '../models/Instructor.js';

async function migrate() {
  await connectDB();
  const instructors = await Instructor.find({}).select('+password');
  let migrated = 0;

  for (const instructor of instructors) {
    if (!/^\$2[aby]\$/.test(instructor.password)) {
      instructor.password = await bcrypt.hash(instructor.password, 10);
      await instructor.save();
      migrated += 1;
    }
  }

  console.log(`Hashed passwords for ${migrated} instructor(s).`);
  await mongoose.disconnect();
}

migrate().catch(async (err) => {
  console.error('Instructor password migration failed:', err.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
