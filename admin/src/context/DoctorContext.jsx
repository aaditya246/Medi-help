import { createContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import socket from '../socket'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(
        localStorage.getItem('dToken') ? localStorage.getItem('dToken') : ''
    )
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Refs so socket callbacks always call the latest functions
    // without stale closures, and without re-registering listeners.
    const getAppointmentsRef = useRef(null)
    const getDashDataRef = useRef(null)
    // Stores the doctor _id independently of React state so the
    // reconnect handler can read it without needing a re-render.
    const doctorIdRef = useRef(null)

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/doctor/appointments',
                { headers: { dToken } }
            )
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/complete-appointment',
                { appointmentId },
                { headers: { dToken } }
            )
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/cancel-appointment',
                { appointmentId },
                { headers: { dToken } }
            )
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/doctor/dashboard',
                { headers: { dToken } }
            )
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/doctor/profile',
                { headers: { dToken } }
            )
            if (data.success) {
                setProfileData(data.profileData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Always keep refs pointing at the latest function instances
    useEffect(() => {
        getAppointmentsRef.current = getAppointments
        getDashDataRef.current = getDashData
    })

    // ─── FIX 1 ───────────────────────────────────────────────────────────────
    // Fetch profile data as soon as dToken exists.
    // Previously this was NEVER called from DoctorContext — only the
    // DoctorProfile PAGE called it. So on Dashboard/Appointments pages,
    // profileData was always false, joinDoctorRoom was never emitted,
    // and the doctor was never in any socket room.
    useEffect(() => {
        if (dToken) {
            getProfileData()
        } else {
            setProfileData(false)
            doctorIdRef.current = null
        }
    }, [dToken])

    // ─── FIX 2 ───────────────────────────────────────────────────────────────
    // Once profileData loads, store _id in ref AND join the room.
    useEffect(() => {
        if (!profileData?._id) return
        doctorIdRef.current = profileData._id
        socket.emit('joinDoctorRoom', profileData._id)
        console.log('Joined Doctor Room:', profileData._id)
    }, [profileData])

    // ─── FIX 3 ───────────────────────────────────────────────────────────────
    // Re-join room on every socket reconnect.
    // When the socket disconnects, the server removes it from ALL rooms.
    // The new socket ID starts with zero room memberships.
    // We re-emit joinDoctorRoom using doctorIdRef (not React state) so this
    // works even after profileData's useEffect has already run and won't
    // re-fire (deps didn't change).
    useEffect(() => {
        const rejoinRoom = () => {
            if (doctorIdRef.current) {
                socket.emit('joinDoctorRoom', doctorIdRef.current)
                console.log('Re-joined Doctor Room after reconnect:', doctorIdRef.current)
            }
        }
        socket.on('connect', rejoinRoom)
        return () => {
            socket.off('connect', rejoinRoom)
        }
    }, [])

    // ─── FIX 4 ───────────────────────────────────────────────────────────────
    // Socket event listeners registered once with named handler references.
    // Using refs means the callbacks always call the latest getAppointments/
    // getDashData even though the useEffect only runs once.
    useEffect(() => {
        const handleBooked = () => {
            console.log('Socket: appointmentBooked received')
            getAppointmentsRef.current?.()
            getDashDataRef.current?.()
        }
        const handleCancelled = () => {
            console.log('Socket: appointmentCancelled received')
            getAppointmentsRef.current?.()
            getDashDataRef.current?.()
        }
        socket.on('appointmentBooked', handleBooked)
        socket.on('appointmentCancelled', handleCancelled)
        return () => {
            socket.off('appointmentBooked', handleBooked)
            socket.off('appointmentCancelled', handleCancelled)
        }
    }, [])

    useEffect(() => {

    socket.on("doctorAvailabilityChanged", () => {

        getProfileData()

        console.log("Doctor availability refreshed")

    })

    return () => {

        socket.off("doctorAvailabilityChanged")

    }

}, [])

    const value = {
        dToken,
        setDToken,
        backendUrl,
        getAppointments,
        appointments,
        setAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        setDashData,
        getDashData,
        getProfileData,
        profileData,
        setProfileData,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider
