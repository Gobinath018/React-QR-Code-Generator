import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QRGenerator from './components/QRGenerator';
import Stats from './components/Stats';
import Footer from './components/Footer';
import BackgroundShapes from './components/BackgroundShapes';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-600 z-50 origin-left"
        style={{ scaleX }}
      />
      
      <BackgroundShapes />
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <QRGenerator />
        <Stats />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;