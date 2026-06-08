import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'



// // app config
const app=express()
const port =process.env.PORT|| 4000
connectDB()
connectCloudinary()

// // middlewares
app.use(express.json())  // any request parse 
app.use(cors())   

// // api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
// localhost:4000/api/admin/add-doctor

app.get('/',(req,res)=>{
    res.send("API WORKING fine")
})
<<<<<<< HEAD
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("joinDoctorRoom", (doctorId) => {
    socket.join(`doctor_${doctorId}`);
  });

  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
  });
});

server.listen(port, () => {
  console.log("Server Started", port);
});
=======

app.listen(port,()=>{
    console.log("server started",port)
})

>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41



