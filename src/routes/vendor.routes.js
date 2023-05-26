const express = require('express')
const Router = express.Router()
const {
  createVendor,
  getAllVendors,
} = require('../controllers/vendor.controller')

Router.post('/vendor/create', createVendor)
Router.get('/vendors', getAllVendors)

module.exports = Router
