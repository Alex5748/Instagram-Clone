import express,{urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from './routes/user.route.js'
import messageRoute from './routes/message.route.js';
import postRoute from "./routes/post.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";


dotenv.config({});


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();






app.get('/', (req, res)=>{
    return res.status(200).json({
        message:"I am comming from backend please visit https://instagram-clone-whz3.onrender.com/login"
    })
})

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: process.env.URL,
    credentials: true,  
};
app.use(cors(corsOptions));



// api here


app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);
app.use('/api/v1/post', postRoute);


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})




server.listen(PORT, () => {

    console.log(`server is listening at ${PORT}`)
    connectDB();
    
})