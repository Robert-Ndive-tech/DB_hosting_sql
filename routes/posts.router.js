
//Kizdarodino database hostings
const express = require("express")
const router = express.Router()
multer = require("multer");

bodyParser = require("body-parser"),
path = require("path"),
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({storage:multer.memoryStorage()});

const postsController = require("../controller/posts.controller")

router.get("/", postsController.getAll)
router.get("/:id", postsController.getById)
router.post("/", postsController.create)
router.put("/:id", postsController.update)
router.delete("/:id", postsController.delete)
router.post("/send",upload.single("Photo"),postsController.storeimage)
router.get("/get",postsController.getImage);

module.exports = router