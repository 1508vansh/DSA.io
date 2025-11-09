import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const useDraggable = (onDrag) => {
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    onDrag(dx, dy);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return { handleMouseDown };
};

const GraphVisualizer = () => {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isEdgeMode, setIsEdgeMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false); // New state
  const [traversalPath, setTraversalPath] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [startNode, setStartNode] = useState('');

  // Node Management
  const addNode = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth: w, clientHeight: h } = containerRef.current;
    
    setNodes(prev => [
      ...prev,
      {
        id: nodeIdCounter,
        x: Math.random() * (w - 48),
        y: Math.random() * (h - 48),
        connections: []
      }
    ]);
    setNodeIdCounter(prev => prev + 1);
  }, [nodeIdCounter]);

  // Edge Management
  const handleNodeClick = useCallback((id) => {
    if (!isEdgeMode) return;

    setSelectedNodes(prev => {
      const newSelected = [...prev, id];
      if (newSelected.length === 2) {
        const [a, b] = newSelected;
        const [from, to] = [Math.min(a, b), Math.max(a, b)];
        
        if (from !== to && !edges.some(e => e.from === from && e.to === to)) {
          setEdges(prev => [...prev, { from, to }]);
          setNodes(prev => prev.map(n => {
            if (n.id === from && !n.connections.includes(to)) {
              return { ...n, connections: [...n.connections, to] };
            }
            if (n.id === to && !n.connections.includes(from)) {
              return { ...n, connections: [...n.connections, from] };
            }
            return n;
          }));
        }
        
        setIsEdgeMode(false);
        return [];
      }
      return newSelected;
    });
  }, [isEdgeMode, edges]);

  // Delete Node Functionality
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
  }, []);

  // Clear All Functionality
  const clearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodes([]);
    setTraversalPath([]);
    setStartNode('');
    setNodeIdCounter(1);
  }, []);

  // Visualization Algorithms
  const traverse = useCallback(async () => {
    if (!startNode) return alert('Select a start node!');
    
    const visited = new Set();
    const queueStack = [Number(startNode)];
    const path = [];
    setTraversalPath([]);

    while (queueStack.length > 0) {
      const current = algorithm === 'bfs' ? queueStack.shift() : queueStack.pop();
      
      if (!visited.has(current)) {
        visited.add(current);
        path.push(current);
        setTraversalPath([...path]);

        const node = nodes.find(n => n.id === current);
        const neighbors = algorithm === 'bfs' ? node.connections : [...node.connections].reverse();
        queueStack.push(...neighbors.filter(n => !visited.has(n)));
        
        await new Promise(resolve => setTimeout(resolve, 1000 / animationSpeed));
      }
    }
  }, [startNode, nodes, algorithm, animationSpeed]);

  // Node Component
  const Node = ({ node }) => {
    const onDrag = useCallback((dx, dy) => {
      setNodes(prev => prev.map(n => n.id === node.id ? {
        ...n,
        x: Math.max(0, Math.min(containerRef.current.clientWidth - 48, n.x + dx)),
        y: Math.max(0, Math.min(containerRef.current.clientHeight - 48, n.y + dy))
      } : n));
    }, [node.id]);

    const { handleMouseDown } = useDraggable(onDrag);

    return (
      <motion.div
        className={`absolute w-12 h-12 rounded-full flex items-center justify-center cursor-move
          ${darkMode ? 'bg-blue-500 text-white' : 'bg-blue-300 text-gray-800'}
          ${traversalPath.includes(node.id) ? 'bg-linear-to-br from-purple-500 to-pink-500' : ''}
          ${selectedNodes.includes(node.id) ? 'ring-4 ring-green-400' : ''}`}
        style={{ left: node.x, top: node.y }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onMouseDown={!isEdgeMode && !isDeleteMode ? handleMouseDown : undefined}
        onClick={() => {
          if (isDeleteMode) {
            handleDeleteNode(node.id);
          } else {
            handleNodeClick(node.id);
          }
        }}
      >
        {isDeleteMode && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
            ×
          </div>
        )}
        {node.id}
      </motion.div>
    );
  };

  // Edge Component
  const Edge = ({ edge }) => {
    const from = nodes.find(n => n.id === edge.from);
    const to = nodes.find(n => n.id === edge.to);
    
    if (!from || !to || from.id === to.id) return null;

    const x1 = from.x + 24;
    const y1 = from.y + 24;
    const x2 = to.x + 24;
    const y2 = to.y + 24;
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: x1,
          top: y1,
          width: length,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '0 50%',
          height: '2px',
        }}
      >
        <div className={`absolute h-full w-full ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-inherit rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className={`p-4 mb-6 rounded-xl shadow-lg flex flex-wrap gap-4 items-center
          ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          
          <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 rounded-lg
            ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
            {darkMode ? '🌞 Light' : '🌙 Dark'}
          </button>

          <button onClick={addNode} className={`px-4 py-2 rounded-lg text-white
            ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
            Add Node
          </button>

          <button onClick={() => {
            setIsEdgeMode(!isEdgeMode);
            setIsDeleteMode(false);
          }} className={`px-4 py-2 rounded-lg
            ${isEdgeMode ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
            {isEdgeMode ? 'Connecting... (Click two nodes)' : 'Add Edge'}
          </button>

          <button onClick={() => {
            setIsDeleteMode(!isDeleteMode);
            setIsEdgeMode(false);
          }} className={`px-4 py-2 rounded-lg
            ${isDeleteMode ? 'bg-red-600 text-white' : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
            {isDeleteMode ? 'Deleting... (Click nodes)' : 'Delete Node'}
          </button>

          <button onClick={clearAll} className={`px-4 py-2 rounded-lg text-white
            ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}>
            Clear All
          </button>

          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} 
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
          </select>

          <select value={startNode} onChange={(e) => setStartNode(e.target.value)}
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
            <option value="">Select Start Node</option>
            {nodes.map(n => <option key={n.id} value={n.id}>Node {n.id}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Speed:</span>
            <input type="range" min="0.5" max="5" step="0.5" value={animationSpeed}
              onChange={(e) => setAnimationSpeed(e.target.value)} className="w-32" />
          </div>

          <button onClick={traverse} className={`px-4 py-2 rounded-lg text-white
            ${darkMode ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-500 hover:bg-pink-600'}`}>
            Visualize {algorithm.toUpperCase()}
          </button>
        </div>

        {/* Visualization Area */}
        <div ref={containerRef} className={`relative h-[600px] rounded-xl border-2 overflow-visible
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          
          {/* Grid */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, ${darkMode ? '#4a5568' : '#cbd5e1'} 1px, transparent 1px),
                linear-gradient(to bottom, ${darkMode ? '#4a5568' : '#cbd5e1'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          
          {edges.map((edge) => (
            <Edge key={`${edge.from}-${edge.to}`} edge={edge} />
          ))}
          
          <AnimatePresence>
            {nodes.map(node => <Node key={node.id} node={node} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;