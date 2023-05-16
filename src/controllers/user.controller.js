const UserModel = require('../models/user.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')
const path = require('path')
const fs = require('fs')
// Create user
exports.createUser = async (req, res, next) => {
    try {
        const { email } = req.body

        let alreadyExists = await UserModel.findOne({ email })
        if (alreadyExists) {
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
        console.log(req.body)
        req.user.password = req.body.password
        await req.user.save()
        res.status(201).json(new CustomResponse(null, 'Password changed successfully'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.editProfileById = async (req, res) => {
    console.log(req.file)
    try {
        const userFound = await UserModel.findById(req.user._id)
        if (!userFound) return res.status(404).json(new CustomResponse(null, 'No User found', false))

        const foundUserWithSameEmail = await UserModel.findOne({ email: req.body.email })

        if (foundUserWithSameEmail && foundUserWithSameEmail.email !== req.user.email) {
            return res.status(400).json(new CustomResponse(null, 'Email already exists', false))
        } else {
            if (req.body.email) req.user.email = req.body.email
        }

        if (req.body.fullName) req.user.fullName = req.body.fullName
        if (req.file) {
            if (req.user.profilePicture.filename) {
                let imagePath = path.join(__dirname, '..', '..', 'uploads', req.user.profilePicture.filename)
                fs.unlink(imagePath, err => {
                    if (err) console.log(err)
                })
            }
            req.user.profilePicture.filename = req.file.filename
            req.user.profilePicture.url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        }

        await req.user.save()

        res.status(200).json(new CustomResponse(null, 'Update successfully'))
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
