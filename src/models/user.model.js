const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

UserSchema.pre('save', async function (next) {
    
    if(!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.generateJwtToken = function () {
    return jwt.sign({id: this._id.toString()}, 'pixelssoft2022', {expiresIn: '24h'})
}

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model('User', UserSchema)