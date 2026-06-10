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
        localStorage.getItem('token')
            ? localStorage.getItem('token')
            : false
    )

    const [userData, setUserData] = useState(false)

    // Get all doctors
    const getDoctorsData = async () => {

        try {

            const { data } = await axios.get(
                backendUrl + '/api/doctor/list'
            )

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

    // Load user profile
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(
                backendUrl + '/api/user/get-profile',
                {
                    headers: { token }
                }
            )

            if (data.success) {

                setUserData(data.userData)

                // Join user room
                socket.emit(
                    'joinUserRoom',
                    data.userData._id
                )

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            console.log(error)
            toast.error(error.message)

        }
    }

    // Rejoin user room after reconnect
    useEffect(() => {

        if (!userData?._id) return

        const rejoinRoom = () => {

            socket.emit(
                'joinUserRoom',
                userData._id
            )

        }

        socket.on('connect', rejoinRoom)

        return () => {

            socket.off('connect', rejoinRoom)

        }

    }, [userData])

    // Load doctors initially + listen for updates
    useEffect(() => {

        // Initial fetch
        getDoctorsData()

        const refreshDoctors = () => {

            getDoctorsData()

        }

        const handleDoctorAdded = () => {

            getDoctorsData()

            // toast.info(
            //     "A new doctor has been added"
            // )

        }

        socket.on(
            "doctorAvailabilityChanged",
            refreshDoctors
        )

        socket.on(
            "doctorAdded",
            handleDoctorAdded
        )

        return () => {

            socket.off(
                "doctorAvailabilityChanged",
                refreshDoctors
            )

            socket.off(
                "doctorAdded",
                handleDoctorAdded
            )

        }

    }, [])

    // Load profile when token changes
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