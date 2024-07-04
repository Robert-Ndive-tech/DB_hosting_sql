//Kizdarodino database hostings
const express = require("express")
const router = express.Router()

const adminController = require("../controller/admin.controller")

router.get("/load", adminController.getAll)
router.post("/login", adminController.login)

module.exports = router