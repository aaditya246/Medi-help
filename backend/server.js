import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// App config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(cors())

// API endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('API WORKING fine')
})

// HTTP + Socket.IO server
const server = createServer(app)

export const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    socket.on('joinDoctorRoom', (doctorId) => {
        socket.join(`doctor_${doctorId}`)
        console.log(`Socket ${socket.id} joined room: doctor_${doctorId}`)
    })

    socket.on('joinUserRoom', (userId) => {
        socket.join(`user_${userId}`)
        console.log(`Socket ${socket.id} joined room: user_${userId}`)
    })

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
    })
})

server.listen(port, () => {
    console.log('Server Started on port', port)
})
