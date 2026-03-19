import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import doctorRouter from "./routers/doctorRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());

const mongoUrl = process.env.MONGO_DB_URI;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

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
    "email": "1@example.com",
    "password": "1111"
}

patient
{
    "email": "2@example.com",
    "password": "2222"
}

doctor
{
    "email": "3@example.com",
    "password": "33333333"
}
*/    