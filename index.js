import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./route/userRoute.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";


const app = express();
app.use(bodyParser.json());
dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGOURL;

console.log("Mongourl: ",MONGOURL);
// Allow requests from specific origins
const allowedOrigins = ['http://localhost:3000','http://localhost:5173' ,'http://localhost:5174']; // Add your frontend ports here

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
const connect = () => {
    mongoose.connect(MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected successfully");

        // Start the server after database connection is established
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Database connection failed");
        console.error(error);
        process.exit(1); // Exit the process if DB connection fails
    });
};

// Call the connect function to establish DB connection and start the server
connect();

app.use("/api/user", route);
app.get("/", (req, res) => {
    res.send(`<h1>This is HOMEPAGE</h1>`)
});
