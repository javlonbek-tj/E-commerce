import { Router } from 'express';
import { createProduct, getOneProduct, getAllProducts } from '../controllers/product-controller.js';
import { isAuth } from '../controllers/auth-controller.js';
import { restrictTo } from '../controllers/auth-controller.js';

const router = Router();

router.post('/', isAuth, restrictTo('Admin'), createProduct);
router.get('/', getAllProducts);
router.get('/:id', getOneProduct);

export default router;
