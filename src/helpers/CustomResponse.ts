class CustomResponse {
  data: any;
  success: boolean;
  message: string | null;

  constructor(data: any, success: boolean, message: string | null = null) {
    this.data = data;
    this.success = success;
    this.message = message;
  }
}

export default CustomResponse;
