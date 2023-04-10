import { Router } from 'express';
import { createType, getAllTypes } from '../controllers/type-controller.js';
import { isAuth } from '../controllers/auth-controller.js';

const router = Router();

router.get('/', isAuth, getAllTypes);
router.post('/', isAuth, createType);

export default router;
