const express = require('express')
const Router = express.Router()
const {
  createVendor,
  getAllVendors,
  deleteVendorById,
} = require('../controllers/vendor.controller')

Router.post('/vendor/create', createVendor)
Router.get('/vendors', getAllVendors)
Router.delete('/vendors/delete/:id', deleteVendorById)

module.exports = Router
