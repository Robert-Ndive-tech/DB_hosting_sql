const express = require("express")
const app = express()

const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for file uploads


//Kizdarodino database hostings
require('dotenv').config()

app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())

const accountRouter = require('./routes/account.router')
const postsRouter = require('./routes/posts.router')
const adminRouter = require('./routes/admin.router')
const communicationHubRouter = require('./routes/communicationHub.router')
const disastercenterRouter = require('./routes/disastercenter.router')
const emergencyRouter = require('./routes/emergency.router')
const shelterRouter = require('./routes/shelter.router')
const LocationRouter = require('./routes/Location.router')
const imageRouter = require('./routes/router/image.router')
const specialRouter = require('./routes/special.router')



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
  





app.use("/api/v1/posts", postsRouter)
app.use("/api/v1/accounts", accountRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/communicate",communicationHubRouter)
app.use("/api/v1/disaster",upload.single("photo"),disastercenterRouter)
app.use("/api/v1/emergency",emergencyRouter)
app.use("/api/v1/shelter",shelterRouter)
app.use("/api/v1/location",LocationRouter)
app.use("/api/v1/pic",upload.single("photo"),specialRouter)



const PORT = process.env.PORT || 2000

app.listen(PORT, () => {
    console.log("Server is running....")
})

