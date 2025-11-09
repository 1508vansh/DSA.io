import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FibonacciVisualizer = () => {
  const [n, setN] = useState(10); // Maximum index to compute
  const [fib, setFib] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [method, setMethod] = useState('dp'); // 'dp' or 'recursion'
  const [recursionTime, setRecursionTime] = useState(0);
  const [dpTime, setDpTime] = useState(0);

  // Fibonacci using recursion
  const fibonacciRecursion = (num) => {
    if (num <= 1) return num;
    return fibonacciRecursion(num - 1) + fibonacciRecursion(num - 2);
  };

  // Fibonacci using dynamic programming
  const fibonacciDP = (num) => {
    const fibArr = Array(num + 1).fill(null);
    fibArr[0] = 0;
    if (num > 0) fibArr[1] = 1;
    for (let i = 2; i <= num; i++) {
      fibArr[i] = fibArr[i - 1] + fibArr[i - 2];
    }
    return fibArr;
  };

  const startVisualization = () => {
    setIsVisualizing(true);
    setFib(Array(n + 1).fill(null));
    setCurrent(0);

    if (method === 'dp') {
      const startTime = performance.now();
      const fibArr = Array(n + 1).fill(null);
      fibArr[0] = 0;
      if (n > 0) fibArr[1] = 1;
      setFib([...fibArr]);

      let i = 2;
      const interval = setInterval(() => {
        if (i > n) {
          clearInterval(interval);
          setIsVisualizing(false);
          setDpTime(performance.now() - startTime); // Measure DP time
        } else {
          fibArr[i] = fibArr[i - 1] + fibArr[i - 2];
          setFib([...fibArr]);
          setCurrent(i);
          i++;
        }
      }, 100); // Adjust delay for pacing
    } else {
      const startTime = performance.now();
      const fibArr = Array(n + 1).fill(null);
      let i = 0;
      const interval = setInterval(() => {
        if (i > n) {
          clearInterval(interval);
          setIsVisualizing(false);
          setRecursionTime(performance.now() - startTime); // Measure recursion time
        } else {
          fibArr[i] = fibonacciRecursion(i);
          setFib([...fibArr]);
          setCurrent(i);
          i++;
        }
      }, 500); // Adjust delay for pacing
    }
  };

  // Framer Motion variants for cell animation
  const cellVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Fibonacci Visualization</h1>
      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="numberInput" className="text-lg font-medium">
            Enter n:
          </label>
          <input
            id="numberInput"
            type="number"
            min="0"
            max="50"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-md w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="methodSelect" className="text-lg font-medium">
            Method:
          </label>
          <select
            id="methodSelect"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="dp">Dynamic Programming</option>
            <option value="recursion">Recursion</option>
          </select>
        </div>
        <button
          onClick={startVisualization}
          disabled={isVisualizing}
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isVisualizing ? 'Visualizing...' : 'Visualize'}
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-4xl">
        {fib.map((num, index) => (
          <motion.div
            key={index}
            className={`w-20 h-20 border rounded-lg flex items-center justify-center shadow-md ${
              index === current ? 'bg-blue-200' : 'bg-white'
            }`}
            initial="hidden"
            animate="visible"
            variants={cellVariants}
            transition={{ duration: 0.4 }}
          >
            <span className="text-lg font-semibold">{num !== null ? num : '?'}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Performance Comparison</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Recursion</h3>
            <p className="text-gray-600">Time: {recursionTime.toFixed(2)} ms</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Dynamic Programming</h3>
            <p className="text-gray-600">Time: {dpTime.toFixed(2)} ms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FibonacciVisualizer;