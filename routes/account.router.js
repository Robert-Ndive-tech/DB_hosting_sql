
//Kizdarodino database hostings
const express = require("express")
const router = express.Router()

const accountController = require("../controller/account.controller")

router.get("/", accountController.getAll)
router.post("/", accountController.create)
router.put("/:id", accountController.update)


module.exports = router