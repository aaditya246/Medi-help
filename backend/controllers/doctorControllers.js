import doctorModel from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import { io } from '../server.js'

const changeAvailability = async (req, res) => {

  try {

    const { docId } = req.body

    const doctorData = await doctorModel.findById(docId)

    await doctorModel.findByIdAndUpdate(
      docId,
      { available: !doctorData.available }
    )

    io.emit("doctorAvailabilityChanged")
    io.emit("admindoctorAvailabilityChanged")


    res.json({
      success: true,
      message: "Availability Changed"
    })

  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body
    const appointments = await appointmentModel.find({ docId })
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to cancel appointment (by doctor)

const appointmentCancel = async (req, res) => {

  try {

    const { appointmentId } = req.body

    const appointmentData =
      await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found"
      })
    }

    // IMPORTANT
    if (appointmentData.status === "Completed") {
      return res.json({
        success: false,
        message: "Completed appointments cannot be cancelled"
      })
    }

    if (appointmentData.status === "Cancelled") {
      return res.json({
        success: false,
        message: "Appointment already cancelled"
      })
    }

    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        status: "Cancelled",
        cancelledBy: "doctor"
      }
    )

    // release doctor slot
    const { docId, slotDate, slotTime } = appointmentData

    const doctorData =
      await doctorModel.findById(docId)

    let slots_booked =
      doctorData.slots_booked

    slots_booked[slotDate] =
      slots_booked[slotDate].filter(
        e => e !== slotTime
      )

    await doctorModel.findByIdAndUpdate(
      docId,
      { slots_booked }
    )

    // notify user
    io.to(`user_${appointmentData.userId}`)
      .emit("appointmentCancelled")

    // notify doctor
    io.to(`doctor_${docId}`)
      .emit("appointmentCancelled")

    // refresh admin pages
    io.emit("adminAppointmentUpdated")

    res.json({
      success: true,
      message: "Appointment Cancelled"
    })

  } catch (error) {

    console.log(error)

    res.json({
      success: false,
      message: error.message
    })

  }
}

// API to confirm appointment 

const appointmentConfirm = async (req, res) => {

  try {

    const { docId, appointmentId } = req.body

    const appointmentData =
      await appointmentModel.findById(appointmentId)

    if (!appointmentData ||
      appointmentData.docId !== docId) {

      return res.json({
        success: false,
        message: 'Unauthorized action'
      })
    }

    if (appointmentData.status !== "Pending") {
      return res.json({
        success: false,
        message: 'Appointment already processed'
      })
    }

    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        status: "Confirmed"
      }
    )

    io.to(`user_${appointmentData.userId}`)
      .emit('appointmentConfirmed')

    io.emit('adminAppointmentUpdated')

    res.json({
      success: true,
      message: 'Appointment Confirmed'
    })

  } catch (error) {

    console.log(error)

    res.json({
      success: false,
      message: error.message
    })

  }
}

// API to mark appointment completed (by doctor)
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.docId !== docId) {
      return res.json({ success: false, message: 'Unauthorized action' })
    }

    if (appointmentData.status !== "Confirmed") {
      return res.json({
        success: false,
        message: "Only confirmed appointments can be completed"
      })
    }

    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "Completed" }
    )

    // Notify the user's room that appointment was completed
    io.to(`user_${appointmentData.userId}`).emit('appointmentCompleted')
    io.emit("adminAppointmentUpdated")
    console.log(`Emitted appointmentCompleted to room: user_${appointmentData.userId}`)

    res.json({ success: true, message: 'Appointment Completed' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body
    const appointments = await appointmentModel.find({ docId })

    let earnings = 0
    appointments.forEach(item => {
      if (item.status === "Completed" || item.payment) {
        earnings += item.amount
      }
    })

    let patients = []
    appointments.forEach(item => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body
    const profileData = await doctorModel.findById(docId).select('-password')
    res.json({ success: true, profileData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const updateDoctorProfile = async (req, res) => {
  try {

    const { docId, fees, address, available } = req.body

    await doctorModel.findByIdAndUpdate(
      docId,
      { fees, address, available }
    )

    // Notify all connected clients
    io.emit("doctorAvailabilityChanged")
    io.emit("admindoctorAvailabilityChanged")

    res.json({
      success: true,
      message: 'Profile Updated'
    })

  } catch (error) {

    console.log(error)

    res.json({
      success: false,
      message: error.message
    })

  }
}

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  appointmentConfirm,
}
