//Kizdarodino database hostings
const express = require("express")
const emergencyController = require("../controller/emergency.controller")
const router = express.Router()




router.post("/register",emergencyController.register)
router.get("/",emergencyController.getAll)
router.get("/find",emergencyController.getById)
router.post("/login",emergencyController.login)


module.exports = router