
import React from 'react';

interface FrequencyDisplayProps {
  frequency: number;
  isListening: boolean;
}

const FrequencyDisplay: React.FC<FrequencyDisplayProps> = ({ frequency, isListening }) => {
  const displayFrequency = frequency.toFixed(1);

  return (
    <div className="bg-black/30 p-6 text-center border-b border-slate-700">
      <p className="text-sm font-medium text-cyan-400 uppercase tracking-widest mb-2">
        Dominant Frequency
      </p>
      <div className="relative">
        <p 
          className={`text-7xl md:text-8xl font-bold text-white transition-opacity duration-300 ${isListening ? 'opacity-100' : 'opacity-50'}`}
        >
          {isListening ? displayFrequency : '---'}
          <span className="text-4xl md:text-5xl text-slate-400 ml-2">Hz</span>
        </p>
      </div>
    </div>
  );
};

export default FrequencyDisplay;
