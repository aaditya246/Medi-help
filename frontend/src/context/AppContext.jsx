import { createContext, useEffect, useState } from "react";
<<<<<<< HEAD
import socket from '../socket'

import axios from 'axios'
import { toast } from 'react-toastify'
=======

import axios from 'axios'
import {toast} from 'react-toastify'
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL



<<<<<<< HEAD
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)

=======
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData, setUserData] =useState(false)
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41







<<<<<<< HEAD

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

=======
    

    const getDoctorsData = async () => {

        try {

            const {data} = await axios.get(backendUrl + '/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors)
            }else{
                toast.error(data.message)
            }
            
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }


<<<<<<< HEAD
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
=======
const loadUserProfileData = async ()=>{

try{

const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
 
if(data.success){

setUserData(data.userData)

}
else{
toast.error(data.message)


}



}catch(error){


    console.log(error)
    toast.error(error.message)


}
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41





<<<<<<< HEAD
    }
=======
}
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41




    const value = {
<<<<<<< HEAD
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
=======
        doctors,getDoctorsData,
        currencySymbol,
        token,setToken,
        backendUrl,
        userData,setUserData,
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
        loadUserProfileData
    }






    useEffect(() => {
        getDoctorsData()
<<<<<<< HEAD
    }, [])

    useEffect(() => {
        if (token) {

            loadUserProfileData()

        } else {
            setUserData(false)
        }


    }, [token])
=======
    },[])

useEffect(()=>{
if(token){

loadUserProfileData()

}else{
    setUserData(false)
}


},[token])
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41





    return (
<<<<<<< HEAD
        <AppContext.Provider value={value}>
=======
        <AppContext.Provider value = {value}>
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider