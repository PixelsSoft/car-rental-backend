const { createUser, loginUser, changePassword } = require('../controllers/user.controller')
const express = require('express')
const {isAuthenticated} = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/auth/create', createUser)
router.post('/auth/login', loginUser)
router.put('/auth/change-password', isAuthenticated, changePassword)

module.exports = router;