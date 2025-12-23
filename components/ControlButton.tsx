
import React from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';

interface ControlButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({ isListening, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white
                  border-2 rounded-full transition-all duration-300 ease-in-out overflow-hidden
                  focus:outline-none focus:ring-4
                  ${isListening 
                    ? 'bg-red-600 border-red-500 hover:bg-red-700 focus:ring-red-500/50' 
                    : 'bg-green-600 border-green-500 hover:bg-green-700 focus:ring-green-500/50'
                  }
                  shadow-lg shadow-black/40 transform hover:scale-105
      `}
    >
      <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white/20 rounded-full group-hover:w-32 group-hover:h-32"></span>
      <span className="relative flex items-center gap-3">
        {isListening ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </span>
    </button>
  );
};

export default ControlButton;
