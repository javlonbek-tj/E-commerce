const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};
export default function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
}
