
import React, { useState } from 'react';

interface ThreeDViewerProps {
  progress: number;
  floors: number;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ progress, floors }) => {
  const [activeFloor, setActiveFloor] = useState<number | 'all'>('all');

  // New color mappings: Space Indigo for completed, Almond Silk for planned
  const renderFloor = (index: number) => {
    const isCompleted = progress >= ((index + 1) / floors) * 100;
    const offset = index * 40;
    const color = isCompleted ? '#22223b' : '#c9ada7';
    const sideColor = isCompleted ? '#1a1a2e' : '#b1948d';
    const darkSideColor = isCompleted ? '#0f0f1b' : '#9a817a';
    const opacity = activeFloor === 'all' || activeFloor === index ? 1 : 0.15;

    return (
      <g key={index} style={{ transform: `translateY(-${offset}px)`, transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        {/* Base of the floor */}
        <path
          d="M 200 100 L 350 175 L 200 250 L 50 175 Z"
          fill={color}
          stroke="#4a4e69"
          strokeWidth="1.5"
          opacity={opacity}
        />
        {/* Sides of the floor */}
        <path
          d="M 50 175 L 50 205 L 200 280 L 200 250 Z"
          fill={sideColor}
          stroke="#4a4e69"
          strokeWidth="1"
          opacity={opacity}
        />
        <path
          d="M 350 175 L 350 205 L 200 280 L 200 250 Z"
          fill={darkSideColor}
          stroke="#4a4e69"
          strokeWidth="1"
          opacity={opacity}
        />
        <text
          x="200"
          y="185"
          textAnchor="middle"
          fill={isCompleted ? '#f2e9e4' : '#4a4e69'}
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ opacity: opacity }}
        >
          Level {index + 1}
        </text>
      </g>
    );
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 h-[450px] flex flex-col items-center border border-dwello-lilac/20 shadow-inner">
      <div className="absolute top-6 left-6 z-10 space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-dwello-lilac tracking-widest block mb-2">View Controls</label>
          <select 
            className="bg-dwello-parchment dark:bg-slate-700 border border-dwello-lilac/30 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 ring-dwello-grape transition-all"
            onChange={(e) => setActiveFloor(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          >
            <option value="all">Entire Structure</option>
            {Array.from({ length: floors }).map((_, i) => (
              <option key={i} value={i}>Level {i + 1} Plan</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-dwello-parchment rounded-lg border border-dwello-lilac/30 hover:bg-dwello-silk transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           </button>
           <button className="p-2 bg-dwello-parchment rounded-lg border border-dwello-lilac/30 hover:bg-dwello-silk transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
           </button>
        </div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 400 400" className="mt-4 drop-shadow-2xl">
        <g transform="translate(0, 120)">
          {Array.from({ length: floors }).map((_, i) => renderFloor(i))}
        </g>
      </svg>

      <div className="absolute bottom-6 right-6 text-right">
        <div className="text-[10px] font-black uppercase text-dwello-lilac tracking-widest mb-1">Live Progress</div>
        <div className="text-4xl font-extrabold text-dwello-indigo dark:text-dwello-silk tracking-tighter">{progress}%</div>
      </div>
    </div>
  );
};

export default ThreeDViewer;
