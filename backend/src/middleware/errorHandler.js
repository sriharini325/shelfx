// Centralized error handler. Works alongside express-async-errors so any
// thrown/rejected error in a route handler lands here.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'A record with that value already exists.',
      fields: err.errors?.map((e) => e.path),
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation failed.',
      details: err.errors?.map((e) => e.message),
    });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong.' });
}

module.exports = errorHandler;
