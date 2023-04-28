const RegisteredUsers = require('../models/registered-users.model')
const CustomResponse = require('../utils/custom-response.util')
const ErrorResponse = require('../utils/error-response.util')

exports.addUser = async (req, res) => {
    try {
        const { name, address, contact, emergencyContact, email, carType, paymentMethod, registrationDate, pickupDate, returnDate, status} = req.body

        if (!name || !address || !contact || !emergencyContact || !email || !carType || !paymentMethod || !pickupDate || !returnDate) {
            return res.status(400).json(new ErrorResponse(null, 'Missing required fields'))
        }

        let registerUser = await RegisteredUsers.create({ 
            name, 
            address, 
            contact, 
            registrationDate, 
            status,
            email,
            carType,
            paymentMethod,
            pickupDate,
            returnDate 
        })

        await registerUser.save()

        res.status(201).json(new CustomResponse({ registerUser }, 'New user added'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}


exports.getAllRegisteredUsers = async (req, res) => {
    try {
        const registeredUsers = await RegisteredUsers.find({})
        res.status(200).json(new CustomResponse(registeredUsers))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}

exports.editRegisteredUser = async (req, res) => {
    try {
        const {id} = req.params

        const registeredUser = await RegisteredUsers.findById({_id: id})

        if(!registeredUser) {
            return res.status(404).json(new ErrorResponse(null, 'No user found'))
        }

        await registeredUser.updateOne(req.body)
        res.status(201).json(new CustomResponse(null, 'Updated successfully'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}


exports.getDetailsOfSingleUser = async (req, res) => {
    try {
        const { id } = req.params
        let registeredUser = await RegisteredUsers.findById({ _id: id })

        if (!registeredUser) return res.status(404).json(new ErrorResponse(null, 'No user found'))

        res.status(200).json(new CustomResponse(registeredUser))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}


exports.deleteRegisteredUser = async (req, res) => {
    try {
        const { _id } = req.body
        let registeredUser = await RegisteredUsers.findById(_id)

        if (!registeredUser) {
            return res.status(404).json(new ErrorResponse(null, 'No user found'))
        }

        await registeredUser.deleteOne()

        res.status(200).json(new CustomResponse(null, 'User deleted'))
    } catch (err) {
        res.status(500).json(new ErrorResponse(err.stack))
    }
}