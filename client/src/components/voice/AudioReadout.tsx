import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { LANGUAGES } from '../../i18n/translations';

interface AudioReadoutProps {
  text: string;
  language?: SupportedLanguage | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const AudioReadout: React.FC<AudioReadoutProps> = ({
  text,
  language = 'hi',
  label = 'Read Aloud',
  size = 'md'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop existing speech

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Match language code
    const langObj = LANGUAGES.find(l => l.code === language || l.label.toLowerCase() === (language as string).toLowerCase());
    utterance.lang = langObj ? langObj.speechCode : 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-200 ${
        isPlaying
          ? 'bg-gov-600 text-white shadow-sm ring-2 ring-gov-300'
          : 'bg-gov-50 hover:bg-gov-100 text-gov-800 border border-gov-200'
      } ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'}`}
      title={isPlaying ? 'Stop reading' : 'Read aloud with AI speech synthesis'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-white animate-pulse" />
          <span>Stop Audio</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-gov-600" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
