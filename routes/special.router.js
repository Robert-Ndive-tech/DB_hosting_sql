const express = require("express")
const specialContoller = require("../database2/special")
const router = express.Router()



router.get("/download", specialContoller.getall)
router.post("/upload", specialContoller.send)
module.exports = router