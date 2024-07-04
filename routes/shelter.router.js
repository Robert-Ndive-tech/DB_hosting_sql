//Kizdarodino database hostings
const express = require("express")
const LocationController = require("../controller/LocationDetails")

const router = express.Router()



router.post("/register",LocationController.create)
router.get("/register",LocationController.getAll)
router.put("/register",LocationController.update)
router.get("/register",LocationController.getById)

module.exports = router