import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiGrid, FiList, FiSliders, FiPlay, FiStopCircle, 
  FiAlertCircle, FiStar
} from 'react-icons/fi';

// ======================================================================
// Theme Configuration
// ======================================================================
const themes = {
  cyberpunk: {
    name: 'Cyberpunk',
    primary: 'bg-[#00f7ff]',
    secondary: 'bg-[#fe0166]',
    accent: 'bg-[#ffd300]',
    background: 'bg-[#0a0a12]',
    text: 'text-[#f0f0f5]',
    button: 'bg-[#fe0166] hover:bg-[#ff0274] text-white'
  },
  aurora: {
    name: 'Aurora',
    primary: 'bg-[#7F5AF0]',
    secondary: 'bg-[#2CB67D]',
    accent: 'bg-[#FF8906]',
    background: 'bg-[#16161A]',
    text: 'text-[#FFFFFE]',
    button: 'bg-[#7F5AF0] hover:bg-[#6D4BDD] text-white'
  },
  coral: {
    name: 'Coral',
    primary: 'bg-[#FF6B6B]',
    secondary: 'bg-[#4ECDC4]',
    accent: 'bg-[#FFE66D]',
    background: 'bg-[#F7FFF7]',
    text: 'text-[#292F36]',
    button: 'bg-[#FF6B6B] hover:bg-[#FF5555] text-white'
  }
};

// ======================================================================
// Algorithm Implementations (Generator Functions)
// ======================================================================
const algorithmImplementations = {
  // Sorting Algorithms
  bubble: function* (arr) {
    let steps = 0;
    const totalSteps = (arr.length * (arr.length - 1)) / 2;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
        yield { progress: (++steps / totalSteps) * 100 };
      }
    }
  },
  selection: function* (arr) {
    let steps = 0;
    const totalSteps = (arr.length * (arr.length - 1)) / 2;
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIdx]) minIdx = j;
        yield { progress: (++steps / totalSteps) * 100 };
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  },
  insertion: function* (arr) {
    let steps = 0;
    const totalSteps = (arr.length * (arr.length - 1)) / 2;
    for (let i = 1; i < arr.length; i++) {
      let j = i;
      while (j > 0 && arr[j - 1] > arr[j]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        j--;
        yield { progress: (++steps / totalSteps) * 100 };
      }
    }
  },
  merge: function* (arr) {
    let totalSteps = 0;
    const countSteps = (array) => {
      if (array.length <= 1) return 0;
      const mid = Math.floor(array.length / 2);
      return array.length + countSteps(array.slice(0, mid)) + countSteps(array.slice(mid));
    };
    totalSteps = countSteps(arr);
    let steps = 0;
    
    const merge = function* (left, right) {
      let result = [];
      while (left.length && right.length) {
        result.push(left[0] < right[0] ? left.shift() : right.shift());
        steps++;
        yield { progress: (steps / totalSteps) * 100 };
      }
      return [...result, ...left, ...right];
    };

    const sort = function* (array) {
      if (array.length <= 1) return array;
      const mid = Math.floor(array.length / 2);
      const left = yield* sort(array.slice(0, mid));
      const right = yield* sort(array.slice(mid));
      return yield* merge(left, right);
    };

    yield* sort(arr);
  },
  quick: function* (arr) {
    let totalSteps = arr.length * Math.log2(arr.length);
    let steps = 0;
    
    const sort = function* (array) {
      if (array.length <= 1) return array;
      const pivot = array[0];
      const left = [];
      const right = [];
      
      for (let i = 1; i < array.length; i++) {
        array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
        steps++;
        yield { progress: (steps / totalSteps) * 100 };
      }
      return [...yield* sort(left), pivot, ...yield* sort(right)];
    };
    
    yield* sort(arr);
  },

  // Searching Algorithms
  linear: function* ({ array, target }) {
    for (let i = 0; i < array.length; i++) {
      yield { progress: (i / array.length) * 100 };
      if (array[i] === target) {
        yield { progress: 100 };
        break;
      }
    }
  },
  binary: function* ({ array, target }) {
    let low = 0, high = array.length - 1;
    let steps = 0;
    const maxSteps = Math.log2(array.length) + 1;
    
    while (low <= high) {
      steps++;
      const mid = Math.floor((low + high) / 2);
      yield { progress: (steps / maxSteps) * 100 };
      if (array[mid] === target) {
        yield { progress: 100 };
        break;
      }
      if (array[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
  },
  // Pathfinding Algorithms
  dijkstra: function* (grid) {
    const totalSteps = grid.width * grid.height;
    let steps = 0;
    for (let x = 0; x < grid.width; x++) {
      for (let y = 0; y < grid.height; y++) {
        steps++;
        yield { progress: (steps / totalSteps) * 100 };
      }
    }
  },
  astar: function* (grid) {
    const totalSteps = grid.width * grid.height;
    let steps = 0;
    for (let x = 0; x < grid.width; x++) {
      for (let y = 0; y < grid.height; y++) {
        steps++;
        yield { progress: (steps / totalSteps) * 100 };
      }
    }
  }
};

// ======================================================================
// Algorithm Configuration
// ======================================================================
const algorithmCategories = {
  sorting: {
    name: 'Sorting',
    icon: <FiSliders />,
    inputs: [
      { 
        type: 'array', 
        label: 'Numbers',
        placeholder: 'e.g., 5,3,9,1,6',
        parser: val => {
          const numbers = val.split(',').map(Number).filter(n => !isNaN(n));
          if (numbers.length < 2) throw new Error('Minimum 2 numbers required');
          return numbers;
        }
      }
    ],
    algorithms: {
      bubble: { name: 'Bubble', complexity: 'O(n²)', color: 'bg-red-400' },
      selection: { name: 'Selection', complexity: 'O(n²)', color: 'bg-blue-400' },
      insertion: { name: 'Insertion', complexity: 'O(n²)', color: 'bg-green-400' },
      merge: { name: 'Merge', complexity: 'O(n log n)', color: 'bg-purple-400' },
      quick: { name: 'Quick', complexity: 'O(n log n)', color: 'bg-pink-400' }
    }
  },
  searching: {
    name: 'Searching',
    icon: <FiSearch />,
    inputs: [
      { 
        type: 'array', 
        label: 'Sorted Array',
        placeholder: 'e.g., 1,3,5,7,9',
        parser: val => {
          const numbers = val.split(',').map(Number).filter(n => !isNaN(n));
          if (numbers.length < 1) throw new Error('Enter valid array');
          return numbers.sort((a, b) => a - b);
        }
      },
      {
        type: 'target',
        label: 'Target',
        placeholder: 'Number to find',
        parser: val => {
          const target = Number(val);
          if (isNaN(target)) throw new Error('Invalid target');
          return target;
        }
      }
    ],
    algorithms: {
      linear: { name: 'Linear', complexity: 'O(n)', color: 'bg-orange-400' },
      binary: { name: 'Binary', complexity: 'O(log n)', color: 'bg-teal-400' },
    }
  },
  pathfinding: {
    name: 'Pathfinding',
    icon: <FiGrid />,
    inputs: [
      {
        type: 'grid',
        label: 'Grid Size',
        placeholder: 'e.g., 8x8',
        parser: val => {
          const [w, h] = (val || '8x8').split('x').map(Number);
          return { width: w || 8, height: h || 8 };
        }
      }
    ],
    algorithms: {
      dijkstra: { name: 'Dijkstra', complexity: 'O(V²)', color: 'bg-cyan-400' },
      astar: { name: 'A*', complexity: 'O(E)', color: 'bg-yellow-400' }
    }
  }
};

// ======================================================================
// Main Component
// ======================================================================
const AlgorithmRace = () => {
  const [activeTheme, setActiveTheme] = useState('aurora');
  const [activeCategory, setActiveCategory] = useState('sorting');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [raceState, setRaceState] = useState('idle');
  const [results, setResults] = useState([]);
  const intervalRefs = useRef({});

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  const parseInputs = () => {
    const categoryConfig = algorithmCategories[activeCategory];
    return categoryConfig.inputs.reduce((acc, input) => {
      acc[input.type] = input.parser(inputs[input.type] || '');
      return acc;
    }, {});
  };

  const initializeResults = (parsedInputs) => {
    const initialResults = selectedAlgorithms.map(algoId => ({
      id: `${algoId}-${Date.now()}-${Math.random()}`,
      name: algorithmCategories[activeCategory].algorithms[algoId].name,
      color: algorithmCategories[activeCategory].algorithms[algoId].color,
      progress: 0,
      time: 0,
      completed: false
    }));
    setResults(initialResults);
  };

  const executeAlgorithms = (parsedInputs) => {
    selectedAlgorithms.forEach((algoId) => {
      const startTime = performance.now();
      let inputData;
      
      switch (activeCategory) {
        case 'sorting':
          inputData = [...parsedInputs.array];
          break;
        case 'searching':
          inputData = { 
            array: [...parsedInputs.array], 
            target: parsedInputs.target 
          };
          break;
        case 'pathfinding':
          inputData = parsedInputs.grid;
          break;
        default:
          inputData = parsedInputs;
      }

      const generator = algorithmImplementations[algoId](inputData);

      intervalRefs.current[algoId] = setInterval(() => {
        try {
          const { value, done } = generator.next();
          const currentTime = performance.now() - startTime;

          setResults(prev => prev.map(result => {
            if (result.id.startsWith(algoId)) {
              return {
                ...result,
                progress: Math.min(done ? 100 : value?.progress || 0, 100),
                time: currentTime,
                completed: done
              };
            }
            return result;
          }));

          if (done) {
            clearInterval(intervalRefs.current[algoId]);
            delete intervalRefs.current[algoId];
          }
        } catch (error) {
          console.error('Algorithm error:', error);
          clearInterval(intervalRefs.current[algoId]);
          delete intervalRefs.current[algoId];
        }
      }, 50);
    });
  };

  const validateInputs = () => {
    const newErrors = {};
    algorithmCategories[activeCategory].inputs.forEach(input => {
      try {
        input.parser(inputs[input.type] || '');
      } catch (error) {
        newErrors[input.type] = error.message;
      }
    });
    
    if (selectedAlgorithms.length === 0) {
      newErrors['algorithms'] = 'Select at least one algorithm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startRace = () => {
    if (!validateInputs()) return;
    
    setRaceState('running');
    const parsedInputs = parseInputs();
    initializeResults(parsedInputs);
    executeAlgorithms(parsedInputs);
  };

  const resetRace = () => {
    Object.values(intervalRefs.current).forEach(clearInterval);
    intervalRefs.current = {};
    setRaceState('idle');
    setResults([]);
    setSelectedAlgorithms([]);
  };

  return (
    <div className={`min-h-screen ${themes[activeTheme].background} ${themes[activeTheme].text}`}>
      {/* Theme Selector */}
      <div className="p-4 flex justify-center gap-4 bg-black/10">
        {Object.entries(themes).map(([key, theme]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTheme(key)}
            className={`h-10 w-10 rounded-full ${theme.primary} border-2 ${
              activeTheme === key ? 'border-white scale-110' : 'border-transparent'
            }`}
            title={theme.name}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(algorithmCategories).map(([key, category]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl cursor-pointer transition-colors ${
                activeCategory === key 
                  ? `${themes[activeTheme].secondary} shadow-xl`
                  : 'bg-white/10 backdrop-blur-sm'
              }`}
              onClick={() => {
                setActiveCategory(key);
                resetRace();
                setSelectedAlgorithms([]);
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${themes[activeTheme].accent}`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{category.name}</h2>
                  <p className="text-sm opacity-75">
                    {Object.keys(category.algorithms).length} algorithms
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-6 rounded-xl mb-8 bg-white/5 backdrop-blur-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {algorithmCategories[activeCategory].inputs.map((input) => (
              <div key={input.type} className="space-y-1">
                <label className="text-sm font-medium">{input.label}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputs[input.type] || ''}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      [input.type]: e.target.value
                    }))}
                    placeholder={input.placeholder}
                    className={`w-full p-3 rounded-lg ${
                      themes[activeTheme].background
                    } ${themes[activeTheme].text} ${
                      errors[input.type] ? 'border-2 border-red-400' : ''
                    }`}
                  />
                  {errors[input.type] && (
                    <div className="absolute right-3 top-3 text-red-400">
                      <FiAlertCircle />
                    </div>
                  )}
                </div>
                {errors[input.type] && (
                  <p className="text-red-400 text-sm">{errors[input.type]}</p>
                )}
              </div>
            ))}
          </div>
          {errors.algorithms && (
            <p className="text-red-400 text-sm mt-2">{errors.algorithms}</p>
          )}
        </div>

        {/* Algorithm Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(algorithmCategories[activeCategory].algorithms).map(([key, algo]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedAlgorithms.includes(key)
                  ? `${algo.color} text-white shadow-lg`
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              onClick={() => {
                setSelectedAlgorithms(prev =>
                  prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
                );
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${themes[activeTheme].accent}`}>
                  <FiStar className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold">{algo.name}</h3>
                  <p className="text-sm opacity-75">{algo.complexity}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Race Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={raceState === 'running' ? resetRace : startRace}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${
              themes[activeTheme].button
            } ${raceState === 'running' ? 'animate-pulse' : ''}`}
          >
            {raceState === 'running' ? (
              <>
                <FiStopCircle /> Stop Race
              </>
            ) : (
              <>
                <FiPlay /> Start Race
              </>
            )}
          </motion.button>
        </div>

        {/* Progress Visualization */}
        <div className="space-y-4 mb-8">
          {results.map(result => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-xl backdrop-blur-sm bg-white/5`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${result.color}`} />
                  <h3 className="font-bold">{result.name}</h3>
                </div>
                <span className="font-mono">
                  {result.progress}%{result.time > 0 && ` • ${result.time.toFixed(2)}ms`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full ${result.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${result.progress}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard */}
        {results.length > 0 && (
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiList className={`${themes[activeTheme].text}`} /> Leaderboard
            </h3>
            <AnimatePresence>
              {[...results]
                .sort((a, b) => a.time - b.time)
                .map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 mb-2 rounded-lg flex items-center justify-between bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-400' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-amber-600' : 'bg-white/10'
                      }`}>
                        {index + 1}
                      </span>
                      <span>{result.name}</span>
                    </div>
                    <span className="font-mono text-sm">
                      {result.completed ? 
                        `${result.time.toFixed(2)}ms` : 
                        'In progress'}
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmRace;