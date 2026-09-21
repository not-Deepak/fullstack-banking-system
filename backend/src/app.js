const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("../src/routes/auth.routes")
const accountRoutes = require("../src/routes/account.routes")
const transactionRoutes = require("../src/routes/transaction.routes")


const app = express();

app.use(cors({
    origin: true, // Allow requests from any origin or Vite dev server
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
app.use(cookieParser())

// auth api 
app.use("/api/auth", authRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/transactions", transactionRoutes)









module.exports=app;