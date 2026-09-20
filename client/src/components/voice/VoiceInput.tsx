import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { LANGUAGES } from '../../i18n/translations';
import { SupportedLanguage } from '../../types';

interface VoiceInputProps {
  currentLanguage: SupportedLanguage;
  onTranscriptChange: (transcript: string) => void;
  onAutoSubmit?: (transcript: string) => void;
  disabled?: boolean;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  currentLanguage,
  onTranscriptChange,
  onAutoSubmit,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const recognitionRef = useRef<any>(null);
  const animIntervalRef = useRef<any>(null);

  const langConfig = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = langConfig.speechCode;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onTranscriptChange(finalTranscript);
          setInterimText('');
        } else if (currentInterim) {
          setInterimText(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
          clearInterval(animIntervalRef.current);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        clearInterval(animIntervalRef.current);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition init error:', e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      clearInterval(animIntervalRef.current);
    };
  }, [currentLanguage, langConfig.speechCode, onTranscriptChange]);

  const toggleListening = () => {
    if (disabled) return;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      clearInterval(animIntervalRef.current);
    } else {
      if (!isSupported) {
        // Fallback simulation for unsupported browsers/environments
        simulateVoiceInput();
        return;
      }

      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = langConfig.speechCode;
          recognitionRef.current.start();
          setIsListening(true);

          // Simulate visual audio level modulation
          animIntervalRef.current = setInterval(() => {
            setAudioLevel(Math.floor(Math.random() * 80) + 20);
          }, 120);
        }
      } catch (err) {
        console.warn('Failed to start recognition, using sample:', err);
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    const samples: Record<SupportedLanguage, string> = {
      hi: 'हमारे गांव में बारिश के समय सड़क पूरी तरह खराब हो जाती है और पानी भर जाता है।',
      en: 'Our village road becomes completely damaged during monsoon and severe waterlogging happens.',
      bn: 'আমাদের গ্রামে বৃষ্টির সময় রাস্তা পুরোপুরি ভেঙে যায় এবং জল জমে থাকে।',
      mr: 'आमच्या गावात पावसाळ्यात रस्ता चिखलमय होतो आणि पाणी साचते.',
      ta: 'எங்கள் கிராமத்தில் மழைக்காலத்தில் சாலை சேதமடைந்து தண்ணீர் தேங்குகிறது.',
      te: 'వర్షాల సమయంలో మా ఊరి రోడ్డు పాడై నీరు నిలిచిపోతోంది.',
      gu: 'ચોમાસામાં રસ્તો તૂટી જાય છે અને પાણી ભરાય છે.',
      kn: 'ಮಳೆಗಾಲದಲ್ಲಿ ನಮ್ಮ ರಸ್ತೆ ಹಾಳಾಗುತ್ತದೆ ಮತ್ತು ನೀರು ನಿಲ್ಲುತ್ತದೆ.',
      ml: 'മഴക്കാലത്ത് ഞങ്ങളുടെ റോഡ് തകരുകയും വെള്ളക്കെട്ട് ഉണ്ടാവുകയും ചെയ്യുന്നു.',
      pa: 'ਸਾਡੇ ਪਿੰਡ ਵਿੱਚ ਮੀਂਹ ਸਮੇਂ ਸੜਕ ਖਰਾਬ ਹੋ ਜਾਂਦੀ ਹੈ ਅਤੇ ਪਾਣੀ ਭਰ ਜਾਂਦਾ ਹੈ।'
    };

    const targetText = samples[currentLanguage] || samples.hi;
    let i = 0;
    const interval = setInterval(() => {
      i += 4;
      setInterimText(targetText.slice(0, i));
      if (i >= targetText.length) {
        clearInterval(interval);
        setTimeout(() => {
          onTranscriptChange(targetText);
          setInterimText('');
          setIsListening(false);
        }, 400);
      }
    }, 50);
  };

  const insertSample = (text: string) => {
    onTranscriptChange(text);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-gov-50 via-white to-gov-50 border border-gov-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-md ${
              isListening
                ? 'bg-red-600 text-white shadow-red-300 scale-105 pulse-hotspot ring-4 ring-red-200'
                : 'bg-gov-600 hover:bg-gov-700 text-white shadow-gov-300 hover:scale-105 active:scale-95'
            }`}
            title={isListening ? 'Click to stop recording' : 'Click to speak'}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 animate-pulse" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm">
                {isListening ? (
                  <span className="text-red-600 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                    Listening in {langConfig.nativeLabel} ({langConfig.label})...
                  </span>
                ) : (
                  <span>Voice Input ({langConfig.nativeLabel})</span>
                )}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gov-100 text-gov-800 border border-gov-200">
                Google STT Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isListening
                ? 'Speak naturally about your infrastructure grievance.'
                : `Click microphone to speak in ${langConfig.label} or Indian dialect.`}
            </p>
          </div>
        </div>

        {/* Audio Visualizer Waveform */}
        {isListening && (
          <div className="flex items-center gap-1 h-8 px-3 py-1 bg-white/90 border border-red-200 rounded-lg shadow-inner">
            {[40, 75, 95, 60, 85, 45, 90, 65, 35].map((h, idx) => (
              <span
                key={idx}
                className="w-1 bg-red-500 rounded-full transition-all duration-150"
                style={{
                  height: `${Math.max(4, Math.min(28, (h * audioLevel) / 100))}px`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Interim live preview text */}
      {interimText && (
        <div className="mt-2 p-2.5 rounded-lg bg-red-50/80 border border-red-200 text-xs text-red-900 animate-pulse flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
          <span>"{interimText}"</span>
        </div>
      )}

      {/* Quick Click Prompts */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Quick Test Prompts:</span>
        <button
          type="button"
          onClick={() => insertSample('हमारे गांव में बारिश के समय सड़क पूरी तरह खराब हो जाती है और पानी भर जाता है।')}
          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-gov-400 hover:text-gov-700 transition text-[11px]"
        >
          🌧️ सड़क और जलभराव (Hindi)
        </button>
        <button
          type="button"
          onClick={() => insertSample('Heavy dark spots on arterial road; street lights are broken creating women safety risks.')}
          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-gov-400 hover:text-gov-700 transition text-[11px]"
        >
          💡 Street Lights & Safety (English)
        </button>
        <button
          type="button"
          onClick={() => insertSample('குடிநீர் பைப்லைன் உடைந்து 3 வாரங்களாக குடிநீர் தட்டுப்பாடு ஏற்பட்டுள்ளது.')}
          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-gov-400 hover:text-gov-700 transition text-[11px]"
        >
          🚰 Drinking Water Pipe (Tamil)
        </button>
      </div>
    </div>
  );
};
