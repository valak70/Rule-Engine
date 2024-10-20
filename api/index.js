import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import ruleRoutes from "./routes/ruleRoutes.js"

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log(error.message);
  }
}


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all necessary methods
  credentials: true, // Allow credentials (cookies) to be sent and received
}));
app.use(express.json())
app.use('/api/rules', ruleRoutes)


app.listen(process.env.PORT, async () => {
  await connect()
  console.log(`Server is running on port.`);
});