import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
    next(err);
  }
};

export const postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
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
    next(err);
  }
};

export const getLogin = async (req, res, next) => {
  try {
    res.render('auth/login', {
      pageTitle: `Kirish`,
      errorMessage: null,
      candidate: {
        email: '',
        password: '',
      },
    });
  } catch (err) {
    next(err);
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await req.db.users.findOne({ where: { email } });
    if (!user) {
      return res.render('auth/login', {
        pageTitle: `Kirish`,
        errorMessage: `Email yoki parol xato`,
        candidate: {
          email,
          password,
        },
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', {
        pageTitle: `Kirish`,
        errorMessage: `Email yoki parol xato`,
        candidate: {
          email,
          password,
        },
      });
    }
    createSendToken(user, res);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.redirect('/');
  } catch (err) {
    next(err);
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
      // THERE IS A LOGGED IN USER
      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
