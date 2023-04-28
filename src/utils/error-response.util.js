class ErrorResponse {
    constructor(error, message = 'Something went wrong.', success = false) {
        this.success = success
        this.error = error
        this.message = message
    }
}

module.exports = ErrorResponse