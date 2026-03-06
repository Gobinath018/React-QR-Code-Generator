import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';


const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: 50000, label: 'QR Codes Generated', suffix: '+' },
    { value: 10000, label: 'Active Users', suffix: '+' },
    { value: 30000, label: 'Total Downloads', suffix: '+' },
    { value: 4.9, label: 'User Rating', suffix: '/5' },
  ];

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphism rounded-2xl p-6 text-center hover:shadow-2xl transition-shadow"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {isInView && (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                    separator=","
                  />
                )}
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;