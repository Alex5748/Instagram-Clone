import express,{urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from './routes/user.route.js'
import messageRoute from './routes/message.route.js';
import postRoute from "./routes/post.route.js";
import { app, server } from "./socket/socket.js";


dotenv.config({});


const PORT = process.env.PORT || 3000;





app.get('/', (req, res)=>{
    return res.status(200).json({
        message:"I am comming from backend"
    })
})

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, // 
  };
  app.use(cors(corsOptions));


// api here


app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);
app.use('/api/v1/post', postRoute);




server.listen(PORT, () => {

    console.log(`server is listening at ${PORT}`)
    connectDB();
    
})