//Kizdarodino database hostings
const express = require("express")
const LocationController = require("../controller/LocationDetails")
const router = express.Router()


router.post("/",LocationController.create)
router.put("/create",LocationController.update)
router.get("/find",LocationController.getById)
router.get("/list",LocationController.getAll)
router.post("/send",LocationController.send)


module.exports = router