import { Router } from 'express';
import { getOneProduct, homePage, getAllProducts } from '../controllers/product-controller.js';

const router = Router();

router.get('/', homePage);
router.get('/products', getAllProducts);
router.get('/products/:id', getOneProduct);

export default router;
