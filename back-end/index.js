import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from './routes/userRoute.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api',userRoute);


mongoose.connect(process.env.mongoUrl).then(() => {
  console.log("Connected to database");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}).catch(error => {
  console.error("Database connection error:", error);
});
