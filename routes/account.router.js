
//Kizdarodino database hostings
const express = require("express")
const router = express.Router()

const accountController = require("../controller/account.controller ")

router.get("/", accountController.getAll)
router.post("/", accountController.create)
router.put("/:id", accountController.update)
router.get("/:id", accountController.getById)
router.delete("/:id", accountController.delete)
router.get("/",accountController.login)
router.post("/",accountController.register)

module.exports = router