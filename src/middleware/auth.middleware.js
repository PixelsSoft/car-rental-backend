const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model')

exports.isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) return res.status(401).json({
        success: false,
        error: 'Unauthorized access. Please login.'
    })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await UserModel.findById(decoded.id)
    next()
}

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role (${req.user.role}) is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};