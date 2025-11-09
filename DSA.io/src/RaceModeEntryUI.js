import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useRef, useEffect, useState } from 'react';

const RaceEntryUI = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Custom racing track with curves
  const RacingTrack = () => {
    const trackPoints = [
      { x: -100, y: 20 },
      { x: 20, y: 30 },
      { x: 40, y: 50 },
      { x: 60, y: 30 },
      { x: 80, y: 60 },
      { x: 120, y: 40 },
      { x: 160, y: 70 },
      { x: 200, y: 30 },
      { x: 240, y: 50 },
      { x: 280, y: 20 },
      { x: 320, y: 60 },
      { x: 360, y: 40 },
      { x: 400, y: 80 },
      { x: 440, y: 30 },
    ];

    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Track lines */}
        {[...Array(8)].map((_, lane) => (
          <motion.div
            key={lane}
            className="absolute h-1 bg-linear-to-r from-transparent via-cyan-400/40 to-transparent"
            style={{
              top: `${25 + lane * 8}%`,
              width: '120%',
              left: '-10%',
            }}
            animate={{
              x: ['0%', '-20%'],
            }}
            transition={{
              duration: 2 + lane * 0.3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Racing cars with unique paths */}
        {[
          { color: 'from-red-500 to-orange-500', delay: 0, speed: 2.5 },
          { color: 'from-blue-500 to-cyan-500', delay: 0.3, speed: 2.8 },
          { color: 'from-green-500 to-emerald-500', delay: 0.6, speed: 2.3 },
          { color: 'from-purple-500 to-pink-500', delay: 0.9, speed: 2.6 },
        ].map((car, index) => (
          <motion.div
            key={index}
            className={`absolute w-16 h-8 bg-linear-to-r ${car.color} rounded-lg shadow-lg`}
            style={{
              top: `${28 + index * 8}%`,
            }}
            animate={{
              x: ['-10%', '110%'],
              y: [
                0, 10, -5, 8, -3, 6, -2, 4, -1, 2, 0, -8, 5, -3, 2, 0
              ],
            }}
            transition={{
              x: {
                duration: car.speed,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
              },
              y: {
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
              },
            }}
          >
            {/* Car details */}
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-black/40 rounded-full" />
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-black/40 rounded-full" />
            <div className="absolute left-4 top-1 w-6 h-2 bg-black/30 rounded" />
            <div className="absolute right-4 top-1 w-6 h-2 bg-black/30 rounded" />
          </motion.div>
        ))}
      </div>
    );
  };

  // Floating algorithm elements
  const AlgorithmElements = () => {
    const elements = [
      { char: '{ }', size: 'text-2xl', color: 'text-cyan-400' },
      { char: '[]', size: 'text-xl', color: 'text-purple-400' },
      { char: '=>', size: 'text-lg', color: 'text-green-400' },
      { char: '()', size: 'text-xl', color: 'text-yellow-400' },
      { char: '<>', size: 'text-lg', color: 'text-red-400' },
      { char: '||', size: 'text-xl', color: 'text-blue-400' },
    ];

    return (
      <div className="absolute inset-0">
        {elements.map((element, i) => (
          <motion.div
            key={i}
            className={`absolute ${element.color} ${element.size} font-mono font-bold opacity-40`}
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            {element.char}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden relative"
    >
      {/* Dynamic background with parallax */}
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-cyan-900/10 via-purple-900/10 to-gray-900"
        animate={{
          background: [
            'radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 30%, rgba(192, 38, 211, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5,
        }}
      />

      {/* Racing Track */}
      <RacingTrack />

      {/* Algorithm Elements */}
      <AlgorithmElements />

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        style={{
          x: mousePosition.x * 0.3,
          y: mousePosition.y * 0.3,
        }}
      >
        {/* Main Title */}
        <motion.div className="mb-8">
          <motion.h1
            className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="bg-linear-to-br from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ALGORITHM
            </span>
            <br />
            <motion.span
              className="text-cyan-300"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(34, 211, 238, 0.5)',
                  '0 0 30px rgba(34, 211, 238, 0.8)',
                  '0 0 20px rgba(34, 211, 238, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              RACE
            </motion.span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 font-light mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Where code meets velocity
            <br />
            <span className="text-cyan-400 font-medium">Compete. Compare. Conquer.</span>
          </motion.p>
        </motion.div>

        {/* Get Started Button */}
        <motion.button
          onClick={() => navigate('/RaceMode')}
          className="group relative px-12 py-4 bg-gray-800 border-2 border-cyan-400 rounded-xl text-xl font-bold text-cyan-400 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{
            scale: 1.05,
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-3">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              ⚡
            </motion.span>
            START RACING
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              🚀
            </motion.span>
          </span>
          
          {/* Button shine effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-br from-transparent via-cyan-400/20 to-transparent skew-x-12"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.8 }}
          />
        </motion.button>

        {/* Stats bar */}
        <motion.div
          className="mt-12 flex justify-center gap-8 text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="text-center">
            <div className="text-cyan-400 font-bold text-lg">10+</div>
            <div>Algorithms</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold text-lg">∞</div>
            <div>Comparisons</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg">Real-time</div>
            <div>Visualization</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-br from-cyan-400 via-purple-400 to-cyan-400"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Custom cursor follower */}
      <motion.div
        className="fixed w-4 h-4 bg-cyan-400 rounded-full pointer-events-none z-50"
        style={{
          x: mousePosition.x * 2 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 0),
          y: mousePosition.y * 2 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 0),
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default RaceEntryUI;