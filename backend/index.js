import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter.js";
import doctorRouter from "./routers/doctorRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

const mongoUrl = process.env.MONGO_DB_URI;

mongoose.connect(mongoUrl, {})

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database connected");
})

app.use(bodyParser.json())

app.use(authMiddleware);

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

patient
{
    "email": "2@gmail.com",
    "password": "2222"
}

doctor
{
    "email": "3@gmail.com",
    "password": "3333"
}
*/    