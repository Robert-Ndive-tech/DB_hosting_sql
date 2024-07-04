//Kizdarodino database hostings
const express = require("express")
const emergencyController = require("../controller/emergency.controller")
const router = express.Router()




router.post("/register",emergencyController.register)
router.post("/list",emergencyController.getAll)
router.post("/find",emergencyController.getById)
router.post("/login",emergencyController.login)


module.exports = router