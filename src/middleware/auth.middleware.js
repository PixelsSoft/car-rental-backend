const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model')

exports.isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization
    if(!token) return res.status(401).json({
        success: false,
        error: 'Unauthorized access. Please login.'
    })

    const decoded = jwt.verify(token, 'pixelssoft2022')
    req.user = await UserModel.findById(decoded.id)

    next()
}