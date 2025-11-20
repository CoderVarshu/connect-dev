const express = require("express")
const app = express()

app.use('/', (req,res)=> {
    res.send("Hello from Server")
})


app.listen(5000, () => {
    console.log("Server is successfully listening")
})