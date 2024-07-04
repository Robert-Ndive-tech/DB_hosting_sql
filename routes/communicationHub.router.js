//Kizdarodino database hostings
const express = require("express")
const router = express.Router()


const communicationController = require("../controller/communicationHub.contolller")

router.post("/create",communicationController.create)
router.post("/list", communicationController.getAll)
router.post("/remove", communicationController.delete)
router.post("/change",communicationController.update)
router.post("/find", communicationController.getById)

module.exports = router