import { Router } from 'express';
import { check } from 'express-validator';
import {
  createProduct,
  getAdminPage,
  getProdBrandPage,
  createBrand,
  getProdTypePage,
  createType,
  getAddProduct,
  deleteProduct,
  getAllOrders,
  deleteBrand,
  deleteType,
} from '../controllers/admin-controller.js';
import { isAuth } from '../controllers/auth-controller.js';

const router = Router();

router.get('/', isAuth, getAdminPage);
router.get('/prodType', isAuth, getProdTypePage);
router.post('/type', isAuth, [check('name', 'Mahsulot turi yozilmadi').not().isEmpty()], createType);
router.get('/prodBrand', isAuth, getProdBrandPage);
router.post('/brand', [check('name', 'Mahsulot brandi yozilmadi').not().isEmpty()], isAuth, createBrand);
router.get('/addProduct', isAuth, getAddProduct);
router.post(
  '/addProduct',
  isAuth,
  [check('name').not().isEmpty().isLength({ max: 30 }), check('price').not().isEmpty()],
  createProduct,
);
router.post('/deleteProd', deleteProduct);
router.get('/orders', getAllOrders);
router.post('/deleteBrand', deleteBrand);
router.post('/deleteType', deleteType);

export default router;
