const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
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
    address: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: "user",
    },
    contact: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    previouslyRented: {
        type: Array,
        default: []
    },
    currentlyRented: {
        type: Array,
        default: []
    },
    cardDetails: {
        type: Object,
        cardType: String,
        cardNumber: String,
        expDate: String,
        cvv: String,
        cardHolderName: String,
        default: {
            cardType: '',
            cardNumber: '',
            expDate: '',
            cvv: '',
            cardHolderName: '',
        }
    }
})

UserSchema.pre('save', async function (next) {

    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.generateJwtToken = function () {
    return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model('User', UserSchema)