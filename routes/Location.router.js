//Kizdarodino database hostings
const express = require("express")
const LocationController = require("../controller/LocationDetails")
const router = express.Router()


router.post("/",LocationController.create)
router.post("/create",LocationController.update)
router.post("/find",LocationController.getById)
router.post("/list",LocationController.getAll)

module.exports = router