const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + uuidv4()
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage })

module.exports = upload