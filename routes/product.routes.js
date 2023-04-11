import { Router } from 'express';
import { getOneProduct, homePage } from '../controllers/product-controller.js';

const router = Router();

router.get('/', homePage);
router.get('/products/:id', getOneProduct);

export default router;
