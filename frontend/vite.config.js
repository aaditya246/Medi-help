import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    
    tailwindcss()
  ],
<<<<<<< HEAD
  base: "/",
=======
  base: "/Doctor-Appointment-Booking/",
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
  server:{port:5173}
})
