//Kizdarodino database hostings
const express = require("express")


const router = express.Router()
const imageController = require("../../Scontroller/image.controller")

router.post("/",imageController)

module.exports = router