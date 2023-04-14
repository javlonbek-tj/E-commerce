import { Router } from 'express';
import {
  getCart,
  postCart,
  increaseQuantityByOne,
  decreaseQuantityByOne,
  deleteCart,
} from '../controllers/shop.controller.js';

const router = Router();

router.get('/cart', getCart);
router.post('/cart', postCart);
router.post('/cart/increaseQty', increaseQuantityByOne);
router.post('/cart/decreaseQty', decreaseQuantityByOne);
router.post('/deleteCart', deleteCart);

export default router;
