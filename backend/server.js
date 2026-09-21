require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/db/db")


async function startServer(){

    try {

        app.listen(3000,()=>{
            console.log("server started at port 3000")
            
        })

        connectDB();

        
    } catch (error) {
        console.log("cannot start the server",error)
    }
}

startServer();