const Car = require('../models/car.model')
const ErrorResponse = require('../utils/error-response.util')
const CustomResponse = require('../utils/custom-response.util')

exports.addCar = async (req, res, next) => {
    console.log('hello')
    const {pricePerDay, pricePerWeek, pricePerMonth} = req.body
    try {  

        if (!req.body.name || !req.body.registrationNo) return res.status(400).json(new CustomResponse(null, 'Name & Registration No. is required', false))
        const images = req.files.map((file) => {
            return {
              url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
            };
          });
          console.log('hello2')
        let car = new Car({...req.body, images, price: {
            pricePerDay, pricePerWeek, pricePerMonth
        }})
        await car.save()
        console.log('hello3')
        res.status(201).json(new CustomResponse(car, 'New car added', true))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.fetchAllCars = async (req, res, next) => {
    try {
        let cars = await Car.find({})
        res.status(200).json(new CustomResponse(cars))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.fetchSingleCarDetails = async (req, res, next) => {
    try {
        let id = req.params.id

        let result = await Car.findById({_id: id})
        if(!result) return res.status(404).json(new CustomResponse(null, 'Not found', false))
        res.status(200).json(new CustomResponse(result))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.deleteCarById = async (req, res, next) => {
    try {
        const id = req.params.id
        const result = await Car.findById({_id: id})

        await result.deleteOne()
        res.status(200).json(new CustomResponse(null, 'Car deleted'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}


exports.editCarDetailsById = async (req, res, next) => {
    try {   
        let id = req.params.id

        let result = await Car.findById({_id: id})

        if(!result) return res.status(404).json(new CustomResponse(null, 'Not found'))
        await result.updateOne(req.body)

        res.status(201).json(new CustomResponse(result, 'Car information updated'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}
