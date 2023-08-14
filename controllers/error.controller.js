import logger from '../utils/logger.js';

export const get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Sahifa topilmadi',
  });
};

const sendErrorDev = (error, req, res) => {
  console.log(error);
  return res.render('error', {
    pageTitle: 'Xatolik!',
    msg: error.message,
  });
};

const sendErrorProd = (error, req, res) => {
  logger.error(error);
  res.status(500).render('error', {
    pageTitle: 'Xatolik!',
    msg: 'Tizimda texnik ishlar amalga oshirilmoqda. Noqulayliklar uchun uzr.',
  });
};
export function globalErrorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
}
