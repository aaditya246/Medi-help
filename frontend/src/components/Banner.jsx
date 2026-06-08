<<<<<<< HEAD
import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
=======
import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

const Banner = () => {

    const navigate = useNavigate()
<<<<<<< HEAD
    const { token } = useContext(AppContext)

    // Hide banner if user is logged in
    if (token) return null

    return (
        <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
            {/* Left Side */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    <p>Book Appointment</p>
                    <p className='mt-4'>With 100+ Trusted Doctors</p>
                </div>
                <button
                    onClick={() => {
                        navigate('/login')
                        scrollTo(0, 0)
                    }}
                    className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'
                >
                    Create account
                </button>
            </div>

            {/* Right Side */}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <img
                    className='w-full absolute bottom-0 right-0 max-w-md'
                    src={assets.appointment_img}
                    alt=""
                />
            </div>
        </div>
    )
=======

  return (
    <div className = 'flex bg-primary rounded-1g px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/*----------Left Side--------- */}
        <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
            <div className='text-x1 sm:text-2x1 md:text-3x1 lg:text-5x1 font-semibold text-white'>
                <p>Book Appointment</p>
                <p className='mt-4'>With 100+ Truted Doctors</p>
            </div>
            <button onClick={() => {navigate('/login');scrollTo(0,0)}} className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>Create account</button>
        </div>
        {/*----------Right Side--------- */}
        <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
            <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
        </div>
    </div>
  )
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
}

export default Banner