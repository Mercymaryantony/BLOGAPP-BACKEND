const mongoose=require("mongoose")
const schema = mongoose.Schema({
    "name":{type:String,required:true},
    "emailid":String,
    "pass":String
})
let blogmodel = mongoose.model("blogusers",schema)
module.exports={blogmodel}