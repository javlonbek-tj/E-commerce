import { Router } from 'express';
import { signup, login } from '../controllers/auth-controller.js';
import { check } from 'express-validator';

const router = Router();

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
  signup,
);
router.post('/login', login);

export default router;
