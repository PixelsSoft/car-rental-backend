interface IErrorHandler extends Error {
  statusCode: number;
}

class ErrorHandler extends Error implements IErrorHandler {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorHandler;
