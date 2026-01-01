import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import studentRouter from './routers/studentRouter.js';
import productRouter from './routers/productRouter.js';

const app = express();

const mongoUrl = "mongodb+srv://kasunsagara689:20010924@cluster0.iuoj1m7.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoUrl, {})

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database connected");
})

app.use(bodyParser.json())

app.use("/api/students", studentRouter);
app.use("/api/products", productRouter);

app.listen (
    5000, 
    () => {
        console.log("Server is running on port 5000");
    }
)