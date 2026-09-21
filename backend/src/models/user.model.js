const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")


const userSchema = new mongoose.Schema({
   
    name:{
        type:String,
        required:[true,"name is required to create and user account"],

    },
    email:{
        type:String,
        required:[true,"email is required to create and user"],
        unique:true,
        lowercase:true,
        trim:true,
        validate:{
            validator:validator.isEmail,
            message:"please enter and valid email"
        }
    },
    
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password must be atleast 6 characters long"],
        select:false
},
systemUser:{
    type:Boolean,
    default:false,
    immutable:true,
    select:false
}


},{
    timestamps:true
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }

    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

const userModel = mongoose.model("user",userSchema)


module.exports=userModel;









