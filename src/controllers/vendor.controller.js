const Vendor = require('../models/vendor.model')
const ErrorResponse = require('../utils/error-response.util')
const CustomResponse = require('../utils/custom-response.util')
exports.createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body)
    res.status(201).json(new CustomResponse(vendor))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({})
    res.status(200).json(new CustomResponse(vendors))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}

exports.deleteVendorById = async (req, res) => {
  try {
    const id = req.params.id

    const vendor = await Vendor.findById({ _id: id })

    if (!vendor)
      return res.status(404).json(new CustomResponse(null, 'Not found', false))

    await vendor.deleteOne()

    res.status(201).json(new CustomResponse(null, 'Vendor deleted'))
  } catch (err) {
    res.status(500).json(new ErrorResponse(err))
  }
}
