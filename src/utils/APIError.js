class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.timeStamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      timeStamp: this.timeStamp,
      stackTrace: this.stack,
      success: false,
    };
  }
}

module.exports = APIError;
