import { createContext, useEffect, useState } from "react";
import socket from '../socket'

import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL



    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)









    const getDoctorsData = async () => {
        console.log("Doctors refreshed") ;

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
                socket.emit("joinDoctorRoom",doctorData._id)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }


    const loadUserProfileData = async () => {

        console.log("Profile refreshed")

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {

                setUserData(data.userData)
                socket.emit( "joinUserRoom",data.userData._id)

            }
            else {
                toast.error(data.message)
            }

        } catch (error) {


            console.log(error)
            toast.error(error.message)


        }





    }




    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    }






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





    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider