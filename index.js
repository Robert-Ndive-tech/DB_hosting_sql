const express = require("express")
const app = express()

//Kizdarodino database hostings
require('dotenv').config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

const postsRouter = require('./routes/posts.router')
const authRouter = require('./routes/auth.router')

app.use("/api/v1/posts", postsRouter)
app.use("/api/v1/auth", authRouter)

const PORT = process.env.PORT || 1000

app.listen(PORT, () => {
    console.log("Server is running....")
})