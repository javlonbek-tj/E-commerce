import AppError from '../services/AppError.js';

export const getCart = async (req, res, next) => {
  try {
    res.render('shop/cart', {
      pageTitle: 'Savatdagi mahsulotlar',
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};
