import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authMiddleware from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import doctorRouter from "./routers/doctorRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";

dotenv.config();

const app = express();

app.use(cors());

connectDB();

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


 