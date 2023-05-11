const {
    addCar,
    fetchAllCars,
    fetchSingleCarDetails,
    deleteCarById,
    editCarDetailsById
} = require('../controllers/car.controller')
const upload = require('../config/multer.config')

const express = require('express')
const router = express.Router()

router.get('/cars', fetchAllCars)
router.get('/cars/:id', fetchSingleCarDetails)

router.post('/cars/add', upload.array('images'), addCar)

router.patch('/cars/:id', editCarDetailsById)
router.delete('/cars/:id', deleteCarById)

module.exports = router