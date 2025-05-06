const express = require("express")
const Router = express.Router()
const fileController = require("../controller/file")

// upload the file
Router.post("/upload", fileController.fileUpload)

// fetch the file

Router.get("/:filename", fileController.fetchFile)

module.exports = Router