import React from 'react'
import { Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import About from './pages/About';
import Navbar from './components/Navbar';
import Myprofile from './pages/MyProfile';
import Login  from './pages/Login'; // Named import
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';

import MyAppointments from './pages/MyAppointments'
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';



const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
    <Navbar />
     <Routes>
     <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path ='/doctors/:speciality' element={<Doctors/>}/>
        <Route path='/login' element = {<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<Myprofile />} />
        <Route path ='/my-appointments' element = {<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />

     </Routes>
     <Footer />
    </div>
  )
}

export default App

