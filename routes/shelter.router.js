//Kizdarodino database hostings
const express = require("express")
const LocationController = require("../controller/LocationDetails")

const router = express.Router()



router.post("/create",LocationController.create)
router.get("/list",LocationController.getAll)
router.put("/change",LocationController.update)
router.get("/find",LocationController.getById)

module.exports = router