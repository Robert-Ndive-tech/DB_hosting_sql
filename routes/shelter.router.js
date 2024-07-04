//Kizdarodino database hostings
const express = require("express")
const LocationController = require("../controller/LocationDetails")

const router = express.Router()



router.post("/register",LocationController.create)
router.post("/register",LocationController.getAll)
router.post("/register",LocationController.update)
router.post("/register",LocationController.getById)

module.exports = router