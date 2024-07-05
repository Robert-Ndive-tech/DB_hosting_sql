//Kizdarodino database hostings
const express = require("express")
const LocationController = require("../controller/LocationDetails")
const router = express.Router()
const bodyParser = require("body-parser");
const multer = require("multer");
var fs = require("fs");

const Upload = multer({ dest: 'uploads/' });

router.post("/",LocationController.create)
router.put("/create",LocationController.update)
router.get("/find",LocationController.getById)
router.get("/list",LocationController.getAll)
router.post("/send",Upload.single('image'),LocationController.send)
router.get("/fetch/:id",LocationController.fetch)

module.exports = router