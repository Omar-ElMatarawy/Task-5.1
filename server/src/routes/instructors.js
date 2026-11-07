import { Router } from 'express';
import {
  loginInstructor,
  getDirectory,
  searchInstructors
} from '../controllers/instructorController.js';
import {
  instructorLoginSchema,
  instructorSearchSchema,
  validateInstructorInput
} from '../validation/instructorSchemas.js';

const router = Router();

router.post('/login', validateInstructorInput(instructorLoginSchema, 'body'), loginInstructor);
router.get('/', getDirectory);
router.get('/search', validateInstructorInput(instructorSearchSchema, 'query'), searchInstructors);

export default router;
