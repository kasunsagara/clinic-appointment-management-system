import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();

const mongoUrl = "mongodb+srv://kasunsagara689:20010924@cluster0.iuoj1m7.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoUrl, {})

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database connected");
})

app.use(bodyParser.json())

app.get ("/",
    (req, res) => {
        console.log("this is a get request");
        console.log(req);

        res.json({
            message: "hello get request"
        })
    }
)

app.post ("/", 
    (req, res) => {
        console.log("this is a post request");
        console.log(req.body);

        const hour = new Date().getHours();

        let well;

        if (hour < 12) {
            well = "good morning";
        } else if (hour < 16) {
            well = "good afternoon";
        } else if (hour < 18) {
            well = "good evening";
        } else {
            well = "good night";
        }

        res.json({
            message: well + " " + req.body.name
        })
    }
)

app.listen (
    5000, 
    () => {
        console.log("Server is running on port 5000");
    }
)