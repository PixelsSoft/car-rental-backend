const express = require('express')
const router = express.Router()

const {addUser, deleteRegisteredUser, getAllRegisteredUsers, getDetailsOfSingleUser, editRegisteredUser} = require('../controllers/registered-users.controller')


router.get('/registered-users', getAllRegisteredUsers)
router.get('/registered-users/:id', getDetailsOfSingleUser)

router.post('/registered-users/add', addUser)

router.put('/registered-users/:id', editRegisteredUser)

router.delete('/registered-users/delete', deleteRegisteredUser)


module.exports = router