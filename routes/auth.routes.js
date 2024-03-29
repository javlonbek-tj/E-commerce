import { Router } from 'express';
import { postSignup, postLogin, getSignUp, getLogin, logout } from '../controllers/auth-controller.js';
import { check } from 'express-validator';

const router = Router();

router.get('/signup', getSignUp);
router.post(
  '/signup',
  [
    check('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please provide email')
      .isEmail()
      .withMessage('Invalid email')
      .normalizeEmail(),
    check('password', "Parol minimal 6 va maksimal 12 ta belgidan iborat bo'lishi kerak").isLength({
      min: 6,
      max: 12,
    }),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  postSignup,
);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);

export default router;
