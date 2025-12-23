
import React from 'react';
import { InfoIcon } from './icons/InfoIcon';

const InfoCard: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto bg-slate-800/30 text-slate-400 p-4 rounded-lg border border-slate-700 text-left text-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-cyan-400">
           <InfoIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-200 mb-1">How it works</h3>
          <p>
            This tool uses your device's microphone to analyze incoming sound. It performs a Fast Fourier Transform (FFT) to determine the most prominent frequency and displays it in real-time. For best results, place your microphone close to the sound source (e.g., a running motor) in a quiet environment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
