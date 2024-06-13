const express =require("express")
const mongoose=require("mongoose")
const cors =require("cors")
const app =express()
const bcrypt = require("bcryptjs") //import encryption package
const jwt =require("jsonwebtoken")//importing token library
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

//login api - here we need async as the password is encrypted
app.post("/login",(req,res)=>{
let input =req.body
//we are checking with mail id
blogmodel.find({"emailid":req.body.emailid}).then(
    (response)=>{
        if(response.length>0)
            {
                let dbpass =response[0].pass
                console.log(dbpass)
                bcrypt.compare(input.pass,dbpass,(error,isMatch)=>{
                    if (isMatch) {
                        //if login success generate token
                        jwt.sign({email:input.emailid},"blog-app",{expiresIn:"1d"},
                            (error,token)=>{
                            if (error) {
                                res.json({"status":"unable to create token"})
                            } else {
                                res.json({"status":"success","userid":response[0]._id,"token":token})
                            }
                        })//blog-app is the name of the token
                    } else {
                        res.json({"status":"incorrect password"})
                    }
                })
            }
        else{
            res.json({"status":"user not found"})
        }
    }
)
})

app.post("/viewusers",(req,res)=>{
    let token = req.headers["token"]
    jwt.verify(token,"blog-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorized access"})
        } else {
            if(decoded)
                {
                    blogmodel.find().then(
                        (response)=>{
                            res.json(response)
                        }
                    ).catch()
                }
        }
    })
    
})

app.listen(8004,()=>{
    console.log("server started")
})