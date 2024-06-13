const express =require("express")
const mongoose=require("mongoose")
const cors =require("cors")
const app =express()
const bcrypt = require("bcryptjs") //import encryption package
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://mercy1112:mercy1112@cluster0.8x8j3ya.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedpswd = async(pswd)=>{
    const salt = await bcrypt.genSalt(10)//salt is a cost factor
    return bcrypt.hash(pswd,salt)
}



const {blogmodel} = require("./model/blog")

app.post("/signup",async(req,res)=>{
    let input = req.body
    let hashedpswd=await generateHashedpswd(input.pass)
    console.log(hashedpswd)
    input.pass=hashedpswd//this is for getting hashed password in db
    let blogusers = new blogmodel(input)
    blogusers.save()
    res.json({"status":"SIGNUP"})
})

app.listen(8004,()=>{
    console.log("server started")
})