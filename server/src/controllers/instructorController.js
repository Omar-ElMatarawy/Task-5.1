import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Instructor } from '../models/Instructor.js';

function instructorProfile(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    username: doc.username,
    department: doc.department,
    role: doc.role
  };
}

// POST /api/instructors/login
export async function loginInstructor(req, res, next) {
  try {
    const { username, password } = req.body;
    const instructor = await Instructor.findOne({ username })
      .select('+password name username department role');

    if (!instructor || !(await bcrypt.compare(password, instructor.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const profile = instructorProfile(instructor);
    const token = jwt.sign(
      { id: profile.id, username: profile.username, role: profile.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    return res.json({ token, instructor: profile });
  } catch (err) {
    next(err);
  }
}

// GET /api/instructors
export async function getDirectory(req, res, next) {
  try {
    const instructors = await Instructor.find()
      .select('name department')
      .sort({ name: 1 })
      .lean();
    res.json({ instructors });
  } catch (err) {
    next(err);
  }
}

// GET /api/instructors/search
export async function searchInstructors(req, res, next) {
  try {
    const filter = {};
    for (const field of ['name', 'department']) {
      if (req.query[field] !== undefined) {
        const escaped = req.query[field].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter[field] = { $regex: escaped, $options: 'i' };
      }
    }

    const instructors = await Instructor.find(filter)
      .select('name department')
      .sort({ name: 1 })
      .limit(50)
      .lean();
    res.json({ count: instructors.length, instructors });
  } catch (err) {
    next(err);
  }
}
