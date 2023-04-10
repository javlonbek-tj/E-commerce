import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import AppError from '../services/AppErorr.js';

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }
  const candidate = await req.db.users.findOne({ where: { email } });
  console.log(candidate.id);
  if (candidate) {
    return next(new AppError(`User with this ${email} is already existed`));
  }
  const hashedPassword = await hash(password, 12);
  const user = await req.db.users.create({
    email,
    password: hashedPassword,
    role,
  });
  const token = generateToken(user.id, user.email, user.role);
  await req.db.carts.create({ userId: user.id });
  res.status(200).json({ token });
};
