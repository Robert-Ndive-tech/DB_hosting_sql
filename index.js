const express = require("express")
const app = express()
const cors = require('cors');

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


app.use("/api/v1/posts", postsRouter)
app.use("/api/v1/accounts", accountRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/communicate",communicationHubRouter)
app.use("/api/v1/disaster",disastercenterRouter)
app.use("/api/v1/emergency",emergencyRouter)
app.use("/api/v1/shelter",shelterRouter)
app.use("/api/v1/location",LocationRouter)


const PORT = process.env.PORT || 2000

app.listen(PORT, () => {
    console.log("Server is running....")
})