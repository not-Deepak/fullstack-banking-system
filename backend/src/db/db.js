// const mongoose = require("mongoose")


// async function connectDB(){

//     try {

//         await mongoose.connect(process.env.MONGO_URI)

//         console.log("database connected successfully")
        
//     } catch (error) {
//        console.log("can not connect to the database with error",error) 
//     }

// }


// module.exports=connectDB;

















const mongoose = require("mongoose")


async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("server connect successfully")

    } catch (error) {
        console.log("cannot start the server",error)
    }
}

module.exports=connectDB;