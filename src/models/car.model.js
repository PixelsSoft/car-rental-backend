const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const CarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
    },
    capacity: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        default: ''
    },
    registrationNo: {
        type: String,
        required: true
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    features: [
        {
            iconImg: String,
            text: String
        }
    ],
    price: {
        type: Object,
        perDay: {
            type: Number,
            default: 0
        },
        perWeek: {
            type: Number,
            default: 0
        },
        perMonth: {
            type: Number,
            default: 0
        },
        default: {
            perDay: 0,
            perWeek: 0,
            perMonth: 0
        }
    },
    description: {
        type: String,
        default: ''
    }
})


CarSchema.pre('remove', function (next) {
    let imagesPaths = this.images.map(image => path.join(__dirname, '..', '..', 'uploads', image.filename))

    imagesPaths.forEach(imagePath => {
        fs.unlink(imagePath, err => {
            if (err) console.log(err)
        })
    })

    next()
})


const Car = mongoose.model('Car', CarSchema)

module.exports = Car