import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: () => void;
  isProcessing: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  return (
    <button
      onClick={onRecordingComplete}
      disabled={isProcessing}
      className={`p-4 rounded-full transition-all ${
        isProcessing
          ? 'bg-gray-400'
          : 'bg-green-500 hover:bg-green-600'
      } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isProcessing ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  );
};

export default VoiceRecorder;