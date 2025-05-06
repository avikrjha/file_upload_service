const config = require("./config/setting_dev")
const express = require("express")
const app = express()
const index = require("./routes/index")

app.use(express.json())




app.use('/api/v1', index)
app.listen(config.port, ()=>{
    console.log(`server is listioning on port ${config.port}`)
})