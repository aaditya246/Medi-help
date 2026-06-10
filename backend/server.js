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

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://medi-help-mu.vercel.app',
    'https://medi-helpadmin.vercel.app',
]

app.options('*', cors({ origin: allowedOrigins, credentials: true }))
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('API WORKING fine')
})

const server = createServer(app)

export const io = new Server(server, {
    cors: { origin: allowedOrigins, credentials: true },
})

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)
    socket.on('joinDoctorRoom', (doctorId) => socket.join(`doctor_${doctorId}`))
    socket.on('joinUserRoom', (userId) => socket.join(`user_${userId}`))
    socket.on('disconnect', () => console.log('Socket disconnected:', socket.id))
})

// ✅ Wait for DB before accepting requests
const startServer = async () => {
    await connectDB()
    connectCloudinary()
    server.listen(process.env.PORT || 4000, () => {
        console.log('Server Started on port', process.env.PORT || 4000)
    })
}

startServer()