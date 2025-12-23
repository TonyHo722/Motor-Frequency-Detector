
import React, { useState, useRef, useCallback } from 'react';
import FrequencyDisplay from './components/FrequencyDisplay';
import Visualizer from './components/Visualizer';
import ControlButton from './components/ControlButton';
import InfoCard from './components/InfoCard';
import { MicrophoneIcon } from './components/icons/MicrophoneIcon';

const App: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(0);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to start');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number>(0);

  const analysisLoop = useCallback(() => {
    if (analyserRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const data = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(data);
      setDataArray(data);

      let maxVal = -1;
      let maxIndex = -1;

      for (let i = 0; i < bufferLength; i++) {
        if (data[i] > maxVal) {
          maxVal = data[i];
          maxIndex = i;
        }
      }

      if (audioContextRef.current && maxIndex !== -1) {
        const nyquist = audioContextRef.current.sampleRate / 2;
        const dominantFrequency = (maxIndex * nyquist) / bufferLength;
        setFrequency(dominantFrequency);
      }
    }
    animationFrameIdRef.current = requestAnimationFrame(analysisLoop);
  }, []);

  const stopAnalysis = useCallback(() => {
    cancelAnimationFrame(animationFrameIdRef.current);
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsListening(false);
    setFrequency(0);
    setDataArray(null);
    setStatusMessage('Stopped. Press Start to begin again.');
  }, []);

  const startAnalysis = async () => {
    setErrorMessage(null);
    setStatusMessage('Initializing audio...');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;
        
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;

        const source = context.createMediaStreamSource(stream);
        sourceRef.current = source;

        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;

        source.connect(analyser);

        setIsListening(true);
        setStatusMessage('Listening...');
        analysisLoop();
      } else {
        throw new Error('getUserMedia not supported on your browser!');
      }
    } catch (err) {
      console.error('Error accessing microphone:', err);
      let message = 'Could not access microphone.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          message = 'Microphone permission denied. Please allow access in your browser settings.';
        }
      }
      setErrorMessage(message);
      setStatusMessage('Error');
      stopAnalysis();
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopAnalysis();
    } else {
      startAnalysis();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">Motor Frequency Detector</h1>
          <p className="text-slate-400 text-lg">Real-time audio frequency analysis</p>
        </header>

        <main className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-sm border border-slate-700 overflow-hidden">
          <FrequencyDisplay frequency={frequency} isListening={isListening} />
          
          <div className="p-6">
            <Visualizer dataArray={dataArray} isListening={isListening}/>
            
            <div className="mt-8 text-center">
              <ControlButton isListening={isListening} onClick={handleToggleListening} />
              <p className={`mt-4 text-sm transition-colors duration-300 ${isListening ? 'text-green-400' : 'text-slate-400'}`}>
                Status: {statusMessage}
              </p>
              {errorMessage && (
                <p className="mt-2 text-sm text-red-400 bg-red-900/50 px-3 py-2 rounded-md">{errorMessage}</p>
              )}
            </div>
          </div>
        </main>

        <footer className="mt-8 text-center">
          <InfoCard />
        </footer>
      </div>
    </div>
  );
};

export default App;
