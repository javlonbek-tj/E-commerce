import { Router } from 'express';
import { getCart } from '../controllers/shop.controller.js';

const router = Router();

router.get('/cart', getCart);

export default router;
