import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, completeAppointment,confirmAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {
          appointments.reverse().map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>
                  {item.payment ? 'Online' : 'CASH'}
                </p>
              </div>

              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>{currency}{item.amount}</p>
              {
                  item.status === "Cancelled" ? (
                    <div>
                      <p className="text-red-500 text-xs font-medium">
                        Cancelled
                      </p>
                      <p className="text-[10px] text-gray-500">
                        By {item.cancelledBy}
                      </p>
                    </div>
                  ) : item.status === "Completed" ? (
                    <p className="text-green-500 text-xs font-medium">
                      Completed
                    </p>
                  ) : item.status === "Confirmed" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => completeAppointment(item._id)}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmAppointment(item._id)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  )
              }
            </div>
          ))}
      </div>

    </div>
  )
}

export default DoctorAppointments