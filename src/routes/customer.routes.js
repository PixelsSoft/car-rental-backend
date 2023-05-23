const express = require("express");
const {
  getAllCustomers,
  createCustomer,
  getCustomerProfile,
  deleteCustomerProfile,
  deactivateProfile
} = require("../controllers/customer.controller");

const router = express.Router();

router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomerProfile);

router.post('/deactivate-customer/:id', deactivateProfile)

router.post("/customers/create", createCustomer);
router.delete("/customers/:id", deleteCustomerProfile);

module.exports = router;
