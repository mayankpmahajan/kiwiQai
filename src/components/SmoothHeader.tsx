// src/components/SmoothHeader.tsx
"use client";

import { useState, useEffect } from 'react';

const SmoothHeader = () => {
  const [isMoving, setIsMoving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setScrollPosition(window.scrollY);
  }, []);

  const startTransition = () => {
    setIsMoving(true);
    setTimeout(() => {
      setIsComplete(true);
    }, 5000);
  };

  return (
    <main className="min-h-screen relative">
      {/* Original header */}
      <h1 
        className={`
          text-3xl font-bold p-4
          transition-all duration-[5000ms] ease-in-out
          ${isMoving ? 'opacity-0 -translate-y-[-32px]' : 'opacity-100 translate-y-0 mt-2'}
        `}
      >
        Your Title Here
      </h1>

      {/* Animated moving header */}
      {isMoving && !isComplete && (
        <h1 
          className={`
            text-3xl font-bold p-4 absolute left-0 w-full
            bg-white shadow-lg
          `}
          style={{
            animation: `slide-to-top 5s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            transform: `translateY(0px)`
          }}
        >
          Your Title Here
        </h1>
      )}

      {/* Final fixed header */}
      {isComplete && (
        <h1 
          className="
            text-3xl font-bold p-4 fixed top-12 left-0 w-full
            bg-white shadow-lg z-50
          "
          style={{
            animation: `slide 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`
          }}
        >
          Your Title Here
        </h1>
      )}

      {/* Control button */}
      <button
        onClick={startTransition}
        className={`
          px-4 py-2 bg-blue-500 text-white rounded
          hover:bg-blue-600
          transition-all duration-[5000ms] ease-in-out
          ${isMoving ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'}
        `}
        disabled={isMoving}
      >
        Move to Top
      </button>

      {/* Content section */}
      <div className="p-4 mt-20">
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i} className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    </main>
  );
};

export default SmoothHeader;