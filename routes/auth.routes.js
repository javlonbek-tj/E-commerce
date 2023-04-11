import { Router } from 'express';
import { postSignup, postLogin, getSignUp } from '../controllers/auth-controller.js';
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
    check('password', 'Password should have min 6 and max 12 characters').isLength({
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
router.post('/login', postLogin);

export default router;
