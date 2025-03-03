class APIResponse {
  constructor(message, statusCode, data) {
    this.message = message;
    this.statusCode = statusCode;
    this.timeStamp = new Date().toISOString();
    this.data = data;
  }

  toJSON() {
    return {
      message: this.message,
      data: this.data,
      statusCode: this.statusCode,
      timeStamp: this.timeStamp,
      success: true,
    };
  }
}

module.exports = APIResponse;
