import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AppError from '../services/AppError.js';
import { validationResult } from 'express-validator';
import { promisify } from 'util';
import { decode } from 'punycode';

const signToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id, user.email, user.role);
  const coookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    coookieOptions.secure = true;
  }
  res.cookie('jwt', token, coookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }
    const candidate = await req.db.users.findOne({ where: { email } });
    if (candidate) {
      return next(new AppError(`User with this ${email} is already existed`, 400));
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await req.db.users.create({
      email,
      password: hashedPassword,
      role,
    });
    await req.db.carts.create({ userId: user.id });
    createSendToken(user, 201, req, res);
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await req.db.users.findOne({ where: { email } });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(user, 200, req, res);
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

export const isAuth = async (req, res, next) => {
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

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // 3) Check user still exists
    const currentUser = await req.db.users.findByPk(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
      }
    }
    req.user = currentUser;
    next();
  } catch (err) {
    next(new AppError(err, 500));
  }
};
