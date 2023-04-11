import { Router } from 'express';
import { check } from 'express-validator';
import {
  createProduct,
  getAdminPage,
  createBrand,
  createType,
  getProdTypePage,
} from '../controllers/admin-controller.js';
import { isAuth } from '../controllers/auth-controller.js';

const router = Router();

router.post('/', isAuth, createProduct);
router.get('/', isAuth, getAdminPage);
router.get('/prodType', isAuth, getProdTypePage);
router.post('/type', [check('name', 'Mahsulot turi yozilmadi').not().isEmpty()], isAuth, createType);
router.post('/brand', isAuth, createBrand);

export default router;
