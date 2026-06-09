import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],  // ADD THIS LINE
})

export default socket