const UserModel = require('../models/user.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')

// Create user
exports.createUser = async (req, res, next) => {
    try {

        const { email, username } = req.body

        let alreadyExists = await UserModel.findOne({ email, username })
        if(alreadyExists) {
            return res.status(400).json(new CustomResponse(null, 'User already exists', false))
        }

        let user = new UserModel(req.body)
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
