const UserModel = require('../models/user.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')

// Create user
exports.createUser = async (req, res, next) => {
    try {
        let user = new UserModel({
            username: 'saadullahkh',
            email: 'test@test.com',
            password: 'test@123'
        })

        await user.save()
        res.status(200).json(new CustomResponse(user, 'user created'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

// Login User
exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json(new ErrorResponse(null, 'Username and password are required'))
        }

        const user = await UserModel.findOne({ username }).select('+password')
        if (!user) return res.status(404).json(new ErrorResponse(null, 'Invalid username/password'))

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) return res.status(400).json(new ErrorResponse(null, 'Invalid username/password'))

        const token = user.generateJwtToken()

        res.status(200).json(new CustomResponse({ token, user }))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

// change password
exports.changePassword = async (req, res) => {
    try {
        const user = await UserModel.findOne({ username: req.user.username })
        user.password = req.body.password
        await user.save()
        res.status(201).json(new CustomResponse(user, 'Password changed successfully'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}
