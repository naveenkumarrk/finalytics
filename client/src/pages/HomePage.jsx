import React from 'react'
import NavBar from './../components/NavBar';
import Home from './../components/homepage/Home';
import HeroSection from '../components/homepage/HeroSection';


const HomePage = () => {    
  return (
    <>
    <div className="h-min-screen">
    <HeroSection/>
    <Home/>
    </div>
    </>
  )
}

export default HomePage