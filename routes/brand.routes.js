import { Router } from 'express';
import { createBrand, getAllBrands } from '../controllers/brand-controller.js';

const router = Router();

router.get('/', getAllBrands);
router.post('/', createBrand);

export default router;
