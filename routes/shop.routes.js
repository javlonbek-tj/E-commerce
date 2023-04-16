import { Router } from 'express';
import {
  getCart,
  postCart,
  increaseQuantityByOne,
  decreaseQuantityByOne,
  deleteCart,
  getCheckout,
  postOrder,
  getOrders,
} from '../controllers/shop.controller.js';

const router = Router();

router.get('/cart', getCart);
router.post('/cart', postCart);
router.post('/cart/increaseQty', increaseQuantityByOne);
router.post('/cart/decreaseQty', decreaseQuantityByOne);
router.post('/deleteCart', deleteCart);
router.get('/checkout', getCheckout);
router.post('/order', postOrder);
router.get('/orders', getOrders);

export default router;
