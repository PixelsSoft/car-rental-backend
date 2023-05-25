class CustomResponse {
  constructor(data, message = null, success = true) {
    this.success = success
    this.message = message
    this.data = data
  }
}

module.exports = CustomResponse
