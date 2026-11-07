import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    department: { type: String, trim: true },
    role: { type: String, default: 'instructor' },
    apiKey: { type: String, select: false },
    privateEmail: { type: String, select: false },
    privatePhone: { type: String, select: false }
  },
  { timestamps: true }
);

instructorSchema.pre('save', async function hashPassword() {
  if (this.isModified('password') && !/^\$2[aby]\$/.test(this.password)) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export const Instructor = mongoose.model('Instructor', instructorSchema);
