//Kizdarodino database hostings
const express = require("express")
const router = express.Router()

const authController = require("../controller/auth.controller")
const disasterController = require("../controller/disastercenter.controller")

router.post("/create", disasterController.create)
router.post("/list", disasterController.getAll)
router.post("/change", disasterController.update)
router.post("/find", disasterController.getById)
router.post("/delete", disasterController.delete)

module.exports = router