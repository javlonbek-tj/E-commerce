import { Router } from 'express';
import { createProduct, getOneProduct } from '../controllers/product-controller.js';
import { isAuth } from '../controllers/auth-controller.js';

const router = Router();

router.post('/', isAuth, createProduct);
router.get('/:id', isAuth, getOneProduct);

export default router;
