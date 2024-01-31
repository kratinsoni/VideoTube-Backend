class ApiError extends Error {

  //making a contructor this is called whenever a new object is initiated using this ApiError class

  constructor(
    statusCode, //codes likes 200, 400, 401, 400
    message = "Something went wrong", 
    errors = [], 
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

// this class utilises Error class from node.js which helps us to send custom errors to determine whats the error like sending errors with status code and message etc