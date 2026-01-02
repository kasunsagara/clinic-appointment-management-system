import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import studentRouter from "./routers/studentRouter.js";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";

const app = express();

const mongoUrl = "mongodb+srv://kasunsagara689:20010924@cluster0.iuoj1m7.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoUrl, {})

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database connected");
})

app.use(bodyParser.json())

app.use(
    (req, res, next) => {
        const token = req.header("authorization")?.replace("Bearer ", "")

        if(token != null) {
            jwt.verify(token, "cas-56649901", (error, decoded) => {

                if(!error) {
                    req.user = decoded
                }
            })
        }
        next()
    }
)

app.use("/api/students", studentRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.listen (
    5000, 
    () => {
        console.log("Server is running on port 5000");
    }
)