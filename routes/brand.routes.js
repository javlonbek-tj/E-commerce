import { Router } from 'express';
import { createBrand, getAllBrands } from '../controllers/brand-controller.js';
import { isAuth } from '../controllers/auth-controller.js';
import { restrictTo } from '../controllers/auth-controller.js';

const router = Router();

router.get('/', isAuth, restrictTo('Admin'), getAllBrands);
router.post('/', isAuth, restrictTo('Admin'), createBrand);

export default router;
