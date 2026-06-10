import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import socket from '../socket'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/appointments',
        { headers: { token } }
      )
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Keep a ref so socket handlers always call the latest version of
  // getUserAppointments without stale closures and without re-registering.
  const getUserAppointmentsRef = useRef(getUserAppointments)
  useEffect(() => {
    getUserAppointmentsRef.current = getUserAppointments
  })

  // Initial load
  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  // Real-time listeners: doctor cancels or completes → refresh the list
  useEffect(() => {
    const handleCancelled = () => {
      toast.info('An appointment was cancelled by the doctor.')
      getUserAppointmentsRef.current()
    }
    const handleConfirmed = () => {
      toast.success('Your appointment has been confirmed by the doctor.')
      getUserAppointmentsRef.current()
    }

    const handleCompleted = () => {
      toast.success('Your appointment has been marked as completed.')
      getUserAppointmentsRef.current()
    }


    socket.on('appointmentCancelled', handleCancelled)
    socket.on('appointmentConfirmed', handleConfirmed)
    socket.on('appointmentCompleted', handleCompleted)

    return () => {
      socket.off('appointmentCancelled', handleCancelled)
      socket.off('appointmentConfirmed', handleConfirmed)
      socket.off('appointmentCompleted', handleCompleted)
    }
  }, [])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div
            className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'
            key={index}
          >
            <div>
              <img
                className='w-32 bg-indigo-50'
                src={item.docData.image}
                alt=''
              />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>
                  Date & Time:
                </span>{' '}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div></div>
            <div className='flex flex-col gap-2 justify-end'>

              {/* Pending */}
              {item.status === "Pending" && (
                <>
                  <div className='sm:min-w-48 py-2 border border-yellow-500 rounded text-yellow-600 text-center font-medium'>
                    Status: Pending
                  </div>

                  <button
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300'
                  >
                    Pay Online
                  </button>

                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'
                  >
                    Cancel Appointment
                  </button>
                </>
              )}

              {/* Confirmed */}
              {item.status === "Confirmed" && (
                <>
                  <div className='sm:min-w-48 py-2 border border-blue-500 rounded text-blue-500 text-center font-medium'>
                    Status: Confirmed
                  </div>

                  <button
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300'
                  >
                    Pay Online
                  </button>
                </>
              )}

              {/* Completed */}
              {item.status === "Completed" && (
                <div className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 text-center font-medium'>
                  Status: Completed
                </div>
              )}

              {/* Cancelled by User */}
              {item.status === "Cancelled" &&
                item.cancelledBy === "user" && (
                  <div className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 text-center font-medium'>
                    Status: Cancelled
                  </div>
                )
              }

              {/* Cancelled by Doctor/Admin */}
              {item.status === "Cancelled" &&
                (item.cancelledBy === "doctor" ||
                  item.cancelledBy === "admin") && (
                  <div className='sm:min-w-48 py-2 border border-orange-500 rounded text-orange-500 text-center font-medium px-2'>
                    Cancelled by Doctor . 
                  </div>
                )
              }

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
