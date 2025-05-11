import React, { useEffect } from 'react'
import GridBackground from './components/GridBackground'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import { initAnimations } from './utils/animations'
import Footer from './components/Footer'
import TextSection from './components/TextSection'
import AboutSection from './components/AboutSection'
import SkillsSection from './components/SkillsSection'

const App = () => {

  useEffect(() => {
    initAnimations();
  }, []);


  return (
    <div className="relative w-full min-h-screen">
      <div className="noise-bg"></div>
      <GridBackground />
      <CustomCursor />
      <div className=" mx-auto ">
        {/* <Navbar /> */}
        <main>
          <HeroSection />
          <AboutSection />
          {/* <TextSection /> */}
          <SkillsSection />
        
          {/* <Skills />
                        <AboutSection /> */}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App