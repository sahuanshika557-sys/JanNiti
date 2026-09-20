import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Globe2, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Maximize,
  Minimize,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { LANGUAGES } from '../../i18n/translations';
import { SupportedLanguage } from '../../types';
import { CINEMATIC_STORY_SCENES, CinematicSceneData } from './storyData';
import { CinematicCanvasEngine } from './cinematicCanvasEngine';
import { soundSynthesizer } from './soundSynthesizer';

interface ProjectStoryProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const ProjectStory: React.FC<ProjectStoryProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange
}) => {
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0); // 0 to 100
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(currentLanguage);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [simChoice, setSimChoice] = useState<'A' | 'C'>('C');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<CinematicCanvasEngine | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideControlsTimerRef = useRef<any>(null);

  const activeScene: CinematicSceneData = CINEMATIC_STORY_SCENES[activeSceneIdx] || CINEMATIC_STORY_SCENES[0];
  const totalScenes = CINEMATIC_STORY_SCENES.length;

  // Sync language with parent prop
  useEffect(() => {
    setSelectedLang(currentLanguage);
  }, [currentLanguage, isOpen]);

  // Initialize Canvas Engine & Web Audio
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    soundSynthesizer.init();
    soundSynthesizer.setMuted(isMuted);
    soundSynthesizer.startAmbience();

    const engine = new CinematicCanvasEngine(canvasRef.current);
    engineRef.current = engine;

    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      engine.resize(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    engine.start();

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
      soundSynthesizer.stopAll();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  // Trigger Sound Cues on Scene Change
  useEffect(() => {
    if (!isOpen || isMuted) return;

    if (activeScene.id === 1) {
      soundSynthesizer.playMicClick();
    } else if (activeScene.soundCue === 'rain') {
      soundSynthesizer.startRain();
    } else {
      soundSynthesizer.stopRain();
    }

    if (activeScene.soundCue === 'whoosh') {
      soundSynthesizer.playWhoosh();
    } else if (activeScene.soundCue === 'chime') {
      soundSynthesizer.playChime();
    } else if (activeScene.soundCue === 'data') {
      soundSynthesizer.playDataPulse();
    } else if (activeScene.soundCue === 'success') {
      soundSynthesizer.playSuccessChord();
    }
  }, [isOpen, activeSceneIdx, isMuted, activeScene.soundCue, activeScene.id]);

  // Synchronized Speech Synthesis Voiceover
  useEffect(() => {
    if (!isOpen) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (!isMuted && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.cancel();
      const textToNarrate = activeScene.narration[selectedLang] || activeScene.narration.en;
      const utterance = new SpeechSynthesisUtterance(textToNarrate);

      const langInfo = LANGUAGES.find(l => l.code === selectedLang);
      utterance.lang = langInfo ? langInfo.speechCode : 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen, activeSceneIdx, selectedLang, isMuted, isPlaying]);

  // 60 FPS Continuous Timeline Progression
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalMs = 50;
    const stepIncrement = (intervalMs / (activeScene.duration * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        const normalized = Math.min(1, Math.max(0, next / 100));

        if (engineRef.current) {
          engineRef.current.setSceneState(activeScene.id, normalized);
        }

        if (next >= 100) {
          if (activeSceneIdx < totalScenes - 1) {
            setActiveSceneIdx((idx) => idx + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, activeSceneIdx, activeScene.duration, activeScene.id, totalScenes]);

  // Auto-hide controls on mouse inactivity (2.5s timeout)
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2500);
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        handleNextScene();
      } else if (e.key === 'ArrowLeft') {
        handlePrevScene();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeSceneIdx]);

  if (!isOpen) return null;

  const handleNextScene = () => {
    if (activeSceneIdx < totalScenes - 1) {
      setActiveSceneIdx((i) => i + 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handlePrevScene = () => {
    if (activeSceneIdx > 0) {
      setActiveSceneIdx((i) => i - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    setActiveSceneIdx(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundSynthesizer.setMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
    setProgress(0);
  };

  const handleScrubTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetScene = Math.min(totalScenes - 1, Math.floor(ratio * totalScenes));
    setActiveSceneIdx(targetScene);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleSelectSimOption = (choice: 'A' | 'C') => {
    setSimChoice(choice);
    if (engineRef.current) {
      engineRef.current.setSimulationOption(choice);
    }
    soundSynthesizer.playDataPulse();
  };

  const currentSceneSecs = Math.floor((progress / 100) * activeScene.duration);
  const totalElapsedSecs = CINEMATIC_STORY_SCENES.slice(0, activeSceneIdx).reduce((acc, s) => acc + s.duration, 0) + currentSceneSecs;
  const totalDurationSecs = CINEMATIC_STORY_SCENES.reduce((acc, s) => acc + s.duration, 0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center select-none overflow-hidden"
    >
      {/* 1. Tricolor Ambient Edge Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38] z-30" />

      {/* 2. 60 FPS HTML5 Cinematic Living Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
      />

      {/* 3. CINEMATIC CONCEPT WORD OVERLAY (Minimalist & Powerful) */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none transition-all duration-700">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-heading font-black text-xl sm:text-2xl tracking-widest text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] uppercase">
            {activeScene.conceptWord}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-300 tracking-wider uppercase mt-0.5">
          {activeScene.title[selectedLang] || activeScene.title.en}
        </p>
      </div>

      {/* 4. INTERACTIVE WHAT-IF SIMULATOR CHOICES (Scene 14 Only) */}
      {activeScene.id === 14 && (
        <div className="absolute top-20 right-8 z-30 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">Test Scenario:</span>
          <button
            onClick={() => handleSelectSimOption('A')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              simChoice === 'A'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Option A: Patch Only
          </button>
          <button
            onClick={() => handleSelectSimOption('C')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              simChoice === 'C'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Option C: Integrated Corridor
          </button>
        </div>
      )}

      {/* 5. SUBTITLES OVERLAY BAR (Matches spoken dialect in real-time) */}
      {showSubtitles && (
        <div className="absolute bottom-20 left-6 right-6 sm:left-16 sm:right-16 z-20 pointer-events-none flex justify-center">
          <div className="bg-slate-950/85 border border-slate-700/80 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-3xl text-center">
            <p className="text-sm sm:text-base font-semibold text-white tracking-wide leading-relaxed drop-shadow-md">
              {activeScene.subtitles[selectedLang] || activeScene.subtitles.en}
            </p>
          </div>
        </div>
      )}

      {/* 6. AUTO-HIDING CINEMATIC VIDEO CONTROLS BAR */}
      <div className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-4 sm:p-6 transition-all duration-300 ${
        controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {/* Timeline Scrubber */}
        <div 
          onClick={handleScrubTimeline}
          className="group relative w-full h-2 bg-slate-800/90 rounded-full cursor-pointer overflow-hidden flex items-center mb-3"
          title="Click to seek scenes"
        >
          {/* 16 Scene Segment Markers */}
          <div className="absolute inset-0 flex">
            {CINEMATIC_STORY_SCENES.map((s, idx) => (
              <div
                key={s.id}
                className={`flex-1 border-r border-slate-950/80 transition-colors ${
                  idx < activeSceneIdx
                    ? 'bg-gradient-to-r from-amber-400 to-cyan-400'
                    : idx === activeSceneIdx
                    ? 'bg-slate-800'
                    : 'bg-slate-900'
                }`}
              >
                {idx === activeSceneIdx && (
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-cyan-400 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls Layout */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:scale-105 text-slate-950 flex items-center justify-center shadow-lg transition-transform"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            {/* Previous Scene */}
            <button
              onClick={handlePrevScene}
              disabled={activeSceneIdx === 0}
              className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous Scene (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Scene */}
            <button
              onClick={handleNextScene}
              disabled={activeSceneIdx === totalScenes - 1}
              className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next Scene (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Replay */}
            <button
              onClick={handleReplay}
              className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Replay Story"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Time Stamp */}
            <span className="text-xs font-mono text-slate-300 font-bold hidden sm:inline">
              {formatTime(totalElapsedSecs)} / {formatTime(totalDurationSecs)}
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* In-Film Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs shadow-inner">
              <Globe2 className="w-4 h-4 text-cyan-300" />
              <select
                value={selectedLang}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </select>
            </div>

            {/* CC Subtitles Toggle */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all ${
                showSubtitles
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle Closed Captions (CC)"
            >
              CC
            </button>

            {/* Audio Mute / Unmute */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg border transition-all ${
                !isMuted
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={isMuted ? 'Unmute Audio & Voice' : 'Mute Audio & Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors hidden sm:block"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Story (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
