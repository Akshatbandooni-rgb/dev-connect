class APIResponse {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
    this.timeStamp = new Date().toISOString();
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      timeStamp: this.timeStamp,
      success: true,
    };
  }
}

module.exports = APIResponse;
