
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
<<<<<<< HEAD
import { io } from '../server.js'
=======
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
import razorpay from 'razorpay'

const registerUser = async (req, res) => {


    try {

        const { name, email, password } = req.body


        if (!name || !password || !email) {

            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter Valid email" })


        }

        if (password.length < 8) {

            return res.json({ success: false, message: "enter strong password" })

        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)


        const userData = {

            name,
            email,
            password: hashedPassword


        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })



    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
<<<<<<< HEAD
=======


>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
    }

}

// API for user login


const loginUser = async (req, res) => {


    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })


        if (!user) {
            return res.json({ success: false, message: 'user does not exist' })

        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
<<<<<<< HEAD
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}


=======




    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })



    }







}



>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
//API to get user profile data

const getProfile = async (req, res) => {

    try {

        const { userId } = req.body


        const userData = await userModel.findById(userId).select('-password')


        res.json({ success: true, userData })

    } catch (error) {

<<<<<<< HEAD
=======

>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
        console.log(error)
        res.json({ success: false, message: error.message })

    }

<<<<<<< HEAD
=======

>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
}

//API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
<<<<<<< HEAD
        const imageFile = req.file
=======
        const imageFile = req.imageFile
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })

        }

<<<<<<< HEAD
        console.log("imageFile:", imageFile);

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
=======


        await userModel.findByIdAndUpdate(userId, { name, address: JSON.parse(address), dob, gender })
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

        if (imageFile) {

            // upload img to cloudinary

            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })

            const imageURL = imageUpload.secure_url
<<<<<<< HEAD
            await userModel.findByIdAndUpdate(userId, { image: imageURL })
=======

            await userModel.findByIdAndUpdate(userId, { image: imageURL })


>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41
        }

        res.json({ success: true, message: "Profile Updated" })


    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })


    }


}

//API  to book appointment


const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })

        }

        let slots_booked = docData.slots_booked


        //checking slots availability

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {

                return res.json({ success: false, message: 'Slot not available' })

            } else {

                slots_booked[slotDate].push(slotTime)



            }
        }
        else {


            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }


        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {

            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()


        }

        const newAppointment = new appointmentModel(appointmentData)

        await newAppointment.save()

<<<<<<< HEAD
        io.to(`doctor_${docId}`).emit("appointmentBooked");

=======
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment booked' })


    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {

    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
<<<<<<< HEAD
        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true,cancelledBy: 'user' })
        

=======
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

        //releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
<<<<<<< HEAD
        io.to(`doctor_${docId}`).emit("appointmentCancelled");

=======
>>>>>>> 8769766902ec2bd8a92f4490317a21a12fd03d41

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// const razorpayInstance = new razorpay({
//     key_id:process.env.RAZORPAY_KEY_ID,
//     key_secret:process.env.RAZORPAY_KEY_SECRET
// })

// API to make payment of appointment using razorpay
// const paymentRazorpay = async (req,res) => {

// }


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }