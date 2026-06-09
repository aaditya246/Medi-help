import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import socket from '../socket'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(
        localStorage.getItem('token') ? localStorage.getItem('token') : false
    )
    const [userData, setUserData] = useState(false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/user/get-profile',
                { headers: { token } }
            )
            if (data.success) {
                setUserData(data.userData)
                // Join the user's socket room so doctor-side events reach this client
                socket.emit('joinUserRoom', data.userData._id)
                console.log('Joined user room:', data.userData._id)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Re-join user room on socket reconnect (handles refresh / network drop)
    useEffect(() => {
        if (!userData?._id) return

        const rejoinRoom = () => {
            socket.emit('joinUserRoom', userData._id)
            console.log('Re-joined user room after reconnect:', userData._id)
        }

        socket.on('connect', rejoinRoom)

        return () => {
            socket.off('connect', rejoinRoom)
        }
    }, [userData])

    useEffect(() => {

        socket.on("doctorAvailabilityChanged", () => {

            console.log("Doctor availability updated")

            getDoctorsData()

        })

        return () => {

            socket.off("doctorAvailabilityChanged")

        }

    }, [])

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
