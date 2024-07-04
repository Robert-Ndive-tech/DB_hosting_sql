//Kizdarodino database hostings
const express = require("express")
const router = express.Router()


const communicationController = require("../controller/communicationHub.contolller")

router.post("/create",communicationController.create)
router.get("/list", communicationController.getAll)
router.delete("/remove", communicationController.delete)
router.put("/change",communicationController.update)
router.get("/find", communicationController.getById)

module.exports = router