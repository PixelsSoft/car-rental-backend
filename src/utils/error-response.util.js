class ErrorResponse {
    constructor(error, message = 'Something went wrong.', success = false, data = null) {
        this.success = success
        this.error = error
        this.message = message
        this.data = data
    }
}

module.exports = ErrorResponse