import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
<<<<<<< HEAD
    cancelledBy: {type: String,default: ''},
=======
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }


})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)
export default appointmentModel