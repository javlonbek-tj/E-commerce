import { Router } from 'express';
import { createBrand, getAllBrands } from '../controllers/brand-controller.js';
import { isAuth } from '../controllers/auth-controller.js';

const router = Router();

router.get('/', isAuth, getAllBrands);
router.post('/', isAuth, createBrand);

export default router;
