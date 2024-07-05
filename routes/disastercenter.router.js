//Kizdarodino database hostings
const express = require("express")
const router = express.Router()
const multer = require("multer");
var fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../client/src/Assets"); // Change 'uploads/' to your desired directory path
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage });


const disasterController = require("../controller/disastercenter.controller")

router.post("/create", disasterController.create)
router.get("/list", disasterController.getAll)
router.post("/send", disasterController.sendimage)
router.put("/change", disasterController.update)
router.get("/find", disasterController.getById)
router.delete("/delete", disasterController.delete)
router.get("/get", disasterController.recieve)
router.post("/upload",upload.single('photo'), disasterController.send)

module.exports = router