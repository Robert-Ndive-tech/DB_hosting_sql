//Kizdarodino database hostings
const express = require("express")


const router = express.Router()
const imageController = require("../../Scontroller/image.controller")

router.get("/:id",imageController.Retrive)

router.get("/",imageController.getAllImages)


module.exports = router