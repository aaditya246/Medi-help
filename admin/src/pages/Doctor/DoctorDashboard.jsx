import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment, confirmAppointment } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])





  return dashData && (


    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency}{dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p></div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {
                item.status === "Cancelled" ? (
                  <div className="flex flex-col items-end">
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
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmAppointment(item._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
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

    </div>

  )
}

export default DoctorDashboard