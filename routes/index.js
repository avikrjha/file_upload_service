const express = require("express")
const Router = express.Router()

const file = require("./file")

Router.use("/file", file)

module.exports = Router