import { Router } from 'express';
import { check } from 'express-validator';
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
router.post(
  '/order',
  [
    check('phone', 'Telefon raqami xato kiritildi').isLength(13).not().isEmpty(),
    check('name', 'Ism familiya kiritilmadi').not().isEmpty(),
    check('province', 'Viloyat kiritilmadi').not().isEmpty(),
    check('region', 'Tuman kiritilmadi').not().isEmpty(),
    check('extraAddress', 'Aholi punkti kiritilmadi').not().isEmpty(),
    check('address', 'Manzil kiritilmadi').not().isEmpty(),
  ],
  postOrder,
);
router.get('/orders', getOrders);

export default router;
