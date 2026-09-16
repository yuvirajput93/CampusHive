import ApiError from '../utils/apiError.js';

const errorHandler = (err, req, res, next) => {
  // If the error is an instance of our custom ApiError, use its details
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      success: false,
      errors: err.error,
    });
  }

  // For any other kind of error, return a generic 500 server error
  return res.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
    success: false,
    errors: [],
  });
};

export default errorHandler;
