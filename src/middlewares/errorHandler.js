const APIError = require("../utils/APIError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json(err.toJSON());
  }
  // Handle unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;
