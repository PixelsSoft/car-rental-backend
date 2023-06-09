const { createUser, loginUser, changePassword, editProfileById, getUserProfile } = require('../controllers/user.controller')
const express = require('express')
const {isAuthenticated} = require('../middleware/auth.middleware')
const upload = require('../config/multer.config')

const router = express.Router()

router.get('/auth/get-profile', isAuthenticated, getUserProfile)
router.post('/auth/create', createUser)
router.post('/auth/login', loginUser)
router.put('/auth/change-password', isAuthenticated, changePassword)
router.patch('/auth/edit-profile', upload.single('profileImage'), isAuthenticated, editProfileById)

module.exports = router;