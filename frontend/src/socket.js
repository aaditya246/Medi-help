import { io } from 'socket.io-client'
 
const socket = io(import.meta.env.VITE_BACKEND_URL, {
    // Reconnect automatically so room memberships survive network drops.
    // The 'connect' event re-fires on every reconnect, which the context
    // files use to re-join rooms.
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
})
 
export default socket