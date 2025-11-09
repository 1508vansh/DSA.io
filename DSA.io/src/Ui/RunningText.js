import { useState, useEffect } from "react";

const phrases = [
  "Welcome to DSA Visualizer",
  "Explore Sorting Algorithms",
  "Visualize Data Structures"
];

export default function RunningText() {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Animation timing controls
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 1500;

  // Gradient colors for different phrases
  const gradients = [
    "bg-gradient-to-r from-cyan-400 to-blue-500",
    "bg-gradient-to-r from-green-400 to-emerald-500",
    "bg-gradient-to-r from-pink-400 to-rose-500"
  ];

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    const animateText = () => {
      if (!isDeleting) {
        // Typing animation
        if (charIndex < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting animation
        if (charIndex > 0) {
          setDisplayText(currentPhrase.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(animateText, speed);
    
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <div className="flex justify-center items-center h-32 sm:h-40 lg:h-48 overflow-hidden">
      <div className="relative text-center min-w-[300px]">
        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold 
          ${gradients[phraseIndex % gradients.length]}
          text-transparent bg-clip-text transition-all duration-300
          motion-reduce:transition-none`}>
          {displayText}
          <span className={`ml-1.5 ${!isDeleting ? 'animate-pulse' : 'opacity-0'}`}>|</span>
        </h1>
        
        {/* Stable positioning background */}
        <div className="absolute inset-0 -z-10 opacity-20 blur-lg 
          bg-linear-to-r from-cyan-400/30 to-blue-500/30
          transition-opacity duration-300" />
      </div>
    </div>
  );
}