const express = require("express")
const app = express()
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const hbs = require("hbs")
const port = process.env.PORT || 8000;
const http = require("http")
const nodemailer = require("nodemailer")

mongoose.connect("mongodb+srv://ansar:ansar123@cluster0.qr4tj.mongodb.net/MyBlogDB?retryWrites=true&w=majority", {

}).then(() => {
    console.log("Connection Successful")
}).catch((err) => {
    console.log("Connection Error")
})

const picSchema = new mongoose.Schema({
    file: String,
    link: String,
    projectName: String,
    bImage: String,
    bTopic: String,
    bDate: String,
    bText: String,
})

const picModel = new mongoose.model("mywork", picSchema)
const bModel = new mongoose.model("myblog", picSchema)

const findModel = picModel.find({})
const findBModel = bModel.find({})

app.use(express.static(path.join(__dirname, "../")))
app.set('view engine', 'hbs')
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req,file,cb) => {
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

let upload = multer({
    storage:storage,
})

// var mulImages = upload.fields([{name: 'file'},{name: 'bImage'}])

app.get("/", (req,res,next) => {
    // findModel.exec((err,data) => {
    //     res.render("index", {
    //         title: "Image Uplaoder",
    //         images: data
    //     })
    // })
    const getDocs = async() => {
        const all_images = await picModel.find()
        res.render("index", {images: all_images})
    }
    getDocs()
    
})

app.get("/blog", (req,res,next) => {
    const getBlogs = async() => {
        const all_blogs = await bModel.find()
        res.render("blog", {blogsData: all_blogs})
    }
    getBlogs()
    
})

app.post("/", upload.single('file'), async(req,res,next) => {
    const picDetails = new picModel({
        file: req.file.filename,
        link: req.body.link,
        projectName: req.body.projectName
    })
    picDetails.save();

    const getDocs = async() => {
        const all_images = await picModel.find()
        res.render("index", {images: all_images})
    }
    getDocs()
})

app.post("/blog", upload.single('bImage'), async(req,res,next) => {
    const bDetails = new bModel({
        bImage: req.file.filename,
        bTopic: req.body.bTopic,
        bDate: req.body.bDate,
        bText: req.body.bText
    })
    await bDetails.save();
    
    const getBlogs = async() => {
        const all_blogs = await bModel.find()
        res.render("blog", {blogsData: all_blogs})
    }
    getBlogs()
})

app.get("/delete/:id", (req,res,next) => {
    var id = req.params.id
    var del = picModel.findByIdAndDelete(id)

    del.exec(function(err,data){
        if(err) throw err;
        res.redirect("/")
    })

})

app.get("/deleteblog/:id", (req,res,next) => {
    var id = req.params.id
    var del = bModel.findByIdAndDelete(id)

    del.exec(function(err,data){
        if(err) throw err;
        res.redirect("/blog")
    })

})

app.post("/send", (req,res) => {
    let output = `
        <p>You have new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.fname}</li>
            <li>Email: ${req.body.email}</li>
            <li>Subject: ${req.body.subjet}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.textArea}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "ansarsaeed988@gmail.com",
            pass: "@Ansar988"
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    let mailOptions={
        form: "ansarsaeed988@gmail.com",
        to: "ansarsial695@gmail.com",
        subject: "Email Contact Request",
        Text: "Hello World",
        html: output
    }
    
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err)
        }else{
            console.log("email has been sent", info.response)
            res.render("index", {msg: "Email Sent Successfully."})
            res.redirect("/")
        }
    })
})

app.listen(port, () => {
    console.log(`Listening to the port no ${port}`)
})