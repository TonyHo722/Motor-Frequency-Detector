
import React from 'react';

interface VisualizerProps {
  dataArray: Uint8Array | null;
  isListening: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ dataArray, isListening }) => {
  const barCount = 64; // Display a subset of the data for better visualization
  const filteredData = dataArray ? Array.from(dataArray).slice(0, barCount) : new Array(barCount).fill(0);

  return (
    <div className={`h-32 w-full flex items-end justify-center gap-1 p-2 bg-slate-900/70 rounded-lg border border-slate-700 transition-opacity duration-500 ${isListening ? 'opacity-100' : 'opacity-20'}`}>
      {filteredData.map((value, index) => {
        const height = (value / 255) * 100;
        const hue = Math.round((index / barCount) * 120 + 180); // a cyan-to-green-to-yellow range
        return (
          <div
            key={index}
            className="w-full rounded-t-full transition-all duration-75"
            style={{ 
              height: `${height}%`, 
              backgroundColor: `hsl(${hue}, 80%, 50%)`,
              boxShadow: `0 0 10px hsla(${hue}, 80%, 50%, 0.5)`
            }}
          />
        );
      })}
    </div>
  );
};

export default Visualizer;
