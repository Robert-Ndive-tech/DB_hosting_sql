//Kizdarodino database hostings
const express = require("express")
const imageController = require("../../Scontroller/image.controller")
const router = express.Router()



router.post("/",imageController)


module.exports = router