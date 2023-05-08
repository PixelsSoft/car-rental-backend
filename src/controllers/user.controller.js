const UserModel = require('../models/user.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')

// Create user
exports.createUser = async (req, res, next) => {
    try {
        const { email } = req.body

        let alreadyExists = await UserModel.findOne({ email })
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
        console.log('req')
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json(new CustomResponse(null, 'email and password are required', false))
        }

        const user = await UserModel.findOne({ email }).select('+password')
        if (!user) return res.status(404).json(new CustomResponse(null, 'Invalid email/password', false))

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) return res.status(400).json(new CustomResponse(null, 'Invalid username/password', false))

        const token = user.generateJwtToken()

        res.status(200).json(new CustomResponse({ token, user }))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

// change password
exports.changePassword = async (req, res) => {
    try {
        req.user.password = req.body.password
        await user.save()
        res.status(201).json(new CustomResponse(user, 'Password changed successfully'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.editProfileById = async (req, res) => {
    try {
        const userFound = await UserModel.findById(req.user._id)
        if(!userFound) return res.status(404).json(new CustomResponse(null, 'No User found', false))


        const {email} = req.body

        let isEmailFound = await UserModel.findOne({email})
        console.log('EMAIL FOUND')
        if(isEmailFound) return res.status(400).json(new CustomResponse(null, 'Email already exists', false))
        
        let user = await UserModel.findOneAndUpdate({_id: req.user._id}, req.body, {new: true})
        res.status(201).json(new CustomResponse(user, 'User updated'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id)
        res.status(200).json(new CustomResponse(user))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}
