const express = require("express")
const app = express();
const path = require("path")
const port = process.env.PORT || 8000

app.use(express.static(path.join(__dirname, "../")))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/", (req,res,next) => {
    res.render("index.hbs")
})


app.listen(port, () => {
    console.log("listening")
})