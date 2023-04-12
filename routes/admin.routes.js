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
} from '../controllers/admin-controller.js';
import { isAuth } from '../controllers/auth-controller.js';

const router = Router();

router.get('/', isAuth, getAdminPage);
router.get('/prodType', isAuth, getProdTypePage);
router.post('/type', [check('name', 'Mahsulot turi yozilmadi').not().isEmpty()], isAuth, createType);
router.get('/prodBrand', isAuth, getProdBrandPage);
router.post('/brand', [check('name', 'Mahsulot brandi yozilmadi').not().isEmpty()], isAuth, createBrand);
router.get('/addProduct', isAuth, getAddProduct);
router.post('/addProduct', isAuth, createProduct);

export default router;
