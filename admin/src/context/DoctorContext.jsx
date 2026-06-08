<<<<<<< HEAD
import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import socket from '../socket'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(
        localStorage.getItem('dToken')
            ? localStorage.getItem('dToken')
            : ''
    )

    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
=======
import { createContext } from "react";
import { useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorContext=createContext()

const DoctorContextProvider=(props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData,setProfileData]=useState(false)


>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {

<<<<<<< HEAD
            const { data } = await axios.get(
                backendUrl + '/api/doctor/appointments',
                { headers: { dToken } }
            )

            if (data.success) {
                setAppointments(data.appointments)
=======
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

<<<<<<< HEAD
=======

>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {

        try {

<<<<<<< HEAD
            const { data } = await axios.post(
                backendUrl + '/api/doctor/complete-appointment',
                { appointmentId },
                { headers: { dToken } }
            )
=======
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

            if (data.success) {
                toast.success(data.message)
                getAppointments()
<<<<<<< HEAD
=======
                // Later after creating getDashData Function
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

<<<<<<< HEAD
    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                backendUrl + '/api/doctor/cancel-appointment',
                { appointmentId },
                { headers: { dToken } }
            )
=======
     // Function to cancel doctor appointment using API
     const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

            if (data.success) {
                toast.success(data.message)
                getAppointments()
<<<<<<< HEAD
=======
                // after creating dashboard
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

<<<<<<< HEAD
    // Getting Doctor dashboard data using API
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

    // Getting Doctor profile data from Database using API
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

    // Join Doctor Room
    useEffect(() => {

        if (profileData?._id) {

            socket.emit(
                "joinDoctorRoom",
                profileData._id
            )

            console.log(
                "Joined Doctor Room:",
                profileData._id
            )

        }

    }, [profileData])

    // Listen for new appointments
    useEffect(() => {

        socket.on("appointmentBooked", () => {

            console.log("New Appointment Booked")

            getAppointments()
            getDashData()

        })

        return () => {

            socket.off("appointmentBooked")

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
        setProfileData
    }

=======

// Getting Doctor dashboard data using API
const getDashData = async () => {
    try {

        const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })

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


 // Getting Doctor profile data from Database using API
 const getProfileData = async () => {
    try {

        const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
        console.log(data.profileData)
        setProfileData(data.profileData)

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}


    const value={
dToken,setDToken,
backendUrl,getAppointments,
appointments,
setAppointments,
completeAppointment,
cancelAppointment,
dashData,setDashData,getDashData,getProfileData,profileData,setProfileData
    }
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider