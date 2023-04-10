import { Router } from 'express';
import { createType, getAllTypes } from '../controllers/type-controller.js';

const router = Router();

router.get('/', getAllTypes);
router.post('/', createType);

export default router;
