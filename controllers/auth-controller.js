import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AppError from '../services/AppError.js';
import { validationResult } from 'express-validator';
import { promisify } from 'util';

const signToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, res) => {
  const token = signToken(user.id, user.email);
  const coookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    coookieOptions.secure = true;
  }
  res.cookie('jwt', token, coookieOptions);
};

export const getSignUp = async (req, res, next) => {
  try {
    res.render('auth/signup', {
      pageTitle: `Ro'yxatdan o'tish`,
      errorMessage: null,
      validationErrors: [],
      candidate: {
        email: '',
        password: '',
        confirmPassword: '',
      },
      error: null,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const postSignup = async (req, res, next) => {
  try {
    const { email, password, role, confirmPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/signup', {
        pageTitle: `Ro'yxatdan o'tish`,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
        candidate: {
          email,
          password,
          confirmPassword,
        },
        error: true,
      });
    }
    const candidate = await req.db.users.findOne({ where: { email } });
    if (candidate) {
      return res.render('auth/signup', {
        pageTitle: `Ro'yxatdan o'tish`,
        errorMessage: `Ushbu email bilan ro'yxatdan o'tilgan. Iltimos boshqa email tanlang`,
        validationErrors: errors.array(),
        candidate: {
          email,
          password,
          confirmPassword,
        },
        error: true,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await req.db.users.create({
      email,
      password: hashedPassword,
      role,
    });
    await req.db.carts.create({ userId: user.id });
    createSendToken(user, res);
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await req.db.users.findOne({ where: { email } });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(user, res);
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.json({
      success: true,
      message: 'User successfully logged out',
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

// Auth for rendered page
export const isAuth = async (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_KEY);

      // 2) Check if user still exists
      const currentUser = await req.db.users.findByPk(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.passwordChangedAt) {
        const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        if (decoded.iat < changedTimestamp) {
          return next();
        }
      }
      // THERE IS A LOGGED IN USER
      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// Auth for API
/* export const isAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in'), 401);
    }

    // 1) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // 2) Check user still exists
    const currentUser = await req.db.users.findByPk(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // 3) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
      }
    }
    req.user = currentUser;
    res.locals.user = req.user || null;
    next();
  } catch (err) {
    next(new AppError(err, 500));
  }
}; */
