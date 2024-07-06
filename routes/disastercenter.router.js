//Kizdarodino database hostings
const express = require("express")
const router = express.Router()


const disasterController = require("../controller/disastercenter.controller")

router.post("/create", disasterController.create)
router.get("/list", disasterController.getAll)
router.post("/send", disasterController.sendimage)
router.put("/change", disasterController.update)
router.get("/find", disasterController.getById)
router.delete("/delete", disasterController.delete)
router.get("/get", disasterController.recieve)
router.post("/upload", disasterController.send)
router.get("/get/:id", disasterController.recievebyid)

module.exports = router