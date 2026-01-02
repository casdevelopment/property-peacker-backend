const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };

    error.message = err.message;

    console.error(err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
      const message = err.errors.map(e => e.message).join(', ');
      error = new Error(message);
      error.statusCode = 400;
    }

    // Sequelize unique constraint error (duplicate key)
    if (err.name === 'SequelizeUniqueConstraintError') {
      const message = 'Duplicate field value entered';
      error = new Error(message);
      error.statusCode = 400;
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      const message = 'Invalid reference to related resource';
      error = new Error(message);
      error.statusCode = 400;
    }

    // Sequelize database error
    if (err.name === 'SequelizeDatabaseError') {
      const message = 'Database error occurred';
      error = new Error(message);
      error.statusCode = 500;
    }

    // Resource not found (for invalid IDs)
    if (err.name === 'SequelizeEmptyResultError' || (err.statusCode === 404)) {
      const message = err.message || 'Resource not found';
      error = new Error(message);
      error.statusCode = 404;
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;