import { Router } from 'express';
import { createType, getAllTypes } from '../controllers/type-controller.js';
import { isAuth } from '../controllers/auth-controller.js';
import { restrictTo } from '../controllers/auth-controller.js';

const router = Router();

router.get('/', isAuth, restrictTo('Admin'), getAllTypes);
router.post('/', isAuth, restrictTo('Admin'), createType);

export default router;
