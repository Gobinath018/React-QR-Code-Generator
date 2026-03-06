import React from 'react';
import { motion } from 'framer-motion';

const BackgroundShapes = () => {
  const shapes = [
    { size: 300, color: 'from-purple-500/20 to-pink-500/20', delay: 0, duration: 20, x: '10%', y: '20%' },
    { size: 400, color: 'from-blue-500/20 to-cyan-500/20', delay: 5, duration: 25, x: '70%', y: '60%' },
    { size: 250, color: 'from-green-500/20 to-teal-500/20', delay: 10, duration: 22, x: '30%', y: '80%' },
    { size: 350, color: 'from-yellow-500/20 to-orange-500/20', delay: 15, duration: 28, x: '80%', y: '30%' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${shape.color} blur-3xl`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundShapes;