import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from './routes/users.js';
import { productRouter } from './routes/product.js';


const app = express()

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/product", productRouter);


mongoose.connect("mongodb+srv://arda_app:arda654.%21123@myapp.vsbgtkk.mongodb.net/ecommerce?retryWrites=true&w=majority");

app.listen(3001, () => console.log("SERVER STARTED!"));
