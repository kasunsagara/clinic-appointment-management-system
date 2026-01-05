import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter.js";
import doctorRouter from "./routers/doctorRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";

dotenv.config();

const app = express();

const mongoUrl = process.env.MONGO_DB_URI;

mongoose.connect(mongoUrl, {})

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database connected");
})

app.use(bodyParser.json())

app.use(
    (req, res, next) => {
        const token = req.header("authorization")?.replace("Bearer ", "");

        if(token != null) {
            jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {

                if(!error) {
                    req.user = decoded.user
                }
            })
        }
        next()
    }
)

app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointments", appointmentRouter);

app.listen (
    5000, 
    () => {
        console.log("Server is running on port 5000");
    }
)


/*
admin
{
    "email": "1@gmail.com",
    "password": "1111"
}

doctor
{
    "email": "2@gmail.com",
    "password": "2222"
}

patient
{
    "email": "3@gmail.com",
    "password": "3333"
}
*/    