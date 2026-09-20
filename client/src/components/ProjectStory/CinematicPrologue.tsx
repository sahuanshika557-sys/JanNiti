import React, { useState, useEffect, useRef } from 'react';
import { Play, ArrowRight, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../../types';
import { soundSynthesizer } from './soundSynthesizer';

interface CinematicPrologueProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchFullStory: () => void;
  currentLanguage: SupportedLanguage;
}

export const CinematicPrologue: React.FC<CinematicPrologueProps> = ({
  isOpen,
  onClose,
  onWatchFullStory,
  currentLanguage
}) => {
  const [phase, setPhase] = useState<number>(0); // 0: single light, 1: phone in hand, 2: environment expands & voice ribbon, 3: reveal options
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    soundSynthesizer.init();
    soundSynthesizer.setMuted(isMuted);

    // Timeline phases
    const t1 = setTimeout(() => {
      setPhase(1);
      soundSynthesizer.playMicClick();
    }, 2200);

    const t2 = setTimeout(() => {
      setPhase(2);
      soundSynthesizer.startRain();
      soundSynthesizer.playWhoosh();
    }, 4500);

    const t3 = setTimeout(() => {
      setPhase(3);
      soundSynthesizer.stopRain();
      soundSynthesizer.playChime();
    }, 7200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      soundSynthesizer.stopRain();
    };
  }, [isOpen]);

  // 60 FPS Canvas Animation for the Opening Prologue Shot
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      if (phase === 0) {
        // Phase 0: Tiny solitary light pulsating in the pitch dark void
        const pulse = 8 + Math.sin(elapsed * 5) * 4;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulse * 8);
        grad.addColorStop(0, 'rgba(56, 189, 248, 1)');
        grad.addColorStop(0.3, 'rgba(99, 102, 241, 0.6)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, pulse * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
        ctx.fill();
      } else if (phase === 1) {
        // Phase 1: Hand holding phone screen in dark room
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        grad.addColorStop(0.6, 'rgba(99, 102, 241, 0.15)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.fill();

        // Phone silhouette
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - 70, cy - 110, 140, 220);
        ctx.fillRect(cx - 70, cy - 110, 140, 220);

        // Screen glowing prompt
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('JanNiti AI • Citizen Voice', cx, cy - 70);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('"हमारे इलाके में सड़क टूटी है..."', cx, cy - 40);

        // Pulsing Mic Icon
        const micP = Math.sin(elapsed * 8) * 3;
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(cx, cy + 20, 24 + micP, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText('🎙', cx, cy + 26);
      } else if (phase >= 2) {
        // Phase 2 & 3: Environment expands & Glowing voice stream shoots across screen
        // Background village hill silhouette
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(0, cy + 80);
        ctx.bezierCurveTo(w * 0.3, cy + 40, w * 0.6, cy + 70, w, cy + 50);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();

        // Road Asphalt
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, cy + 90, w, h - cy - 90);

        // Glowing Voice Light Ribbon shooting into distance
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 15) {
          const y = cy + 20 + Math.sin(elapsed * 8 + x * 0.015) * 35;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Radiating particles along the path
        for (let i = 0; i < 20; i++) {
          const px = ((elapsed * 250 + i * 70) % w);
          const py = cy + 20 + Math.sin(elapsed * 8 + px * 0.015) * 35 + (Math.sin(i * 9) * 15);
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#fbbf24';
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isOpen, phase]);

  if (!isOpen) return null;

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundSynthesizer.setMuted(nextMuted);
  };

  const quotes = [
    {
      hi: "एक आवाज़... क्या वो कहीं पहुँचती भी है?",
      en: "A single voice... does it ever reach anywhere?"
    },
    {
      hi: "कभी-कभी समस्या यह नहीं होती कि लोग बोलते नहीं...",
      en: "Sometimes the problem isn't that people don't speak..."
    },
    {
      hi: "...बल्कि उनकी आवाज़ सही जगह तक नहीं पहुँचती।",
      en: "...it's that their voice never reaches the right place at the right time."
    },
    {
      hi: "JanNiti AI — हर आवाज़ को एक सामूहिक दिशा में बदलना।",
      en: "JanNiti AI — Turning every citizen voice into public direction."
    }
  ];

  const currentQuote = quotes[Math.min(phase, quotes.length - 1)];

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950 flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-700">
      {/* 1. Indian Tricolor Ambient Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38] z-30" />

      {/* 2. Fullscreen Living Cinematic Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />

      {/* 3. Top Controls (Mute & Skip) */}
      <div className="relative z-20 w-full flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">
            PROLOGUE • {phase === 0 ? 'THE SOLITARY LIGHT' : phase === 1 ? 'CITIZEN INPUT' : phase === 2 ? 'SIGNAL JOURNEY' : 'EMERGENCE'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>Skip to Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Cinematic Emotional Voiceover Subtitle Line */}
      <div className="relative z-20 text-center max-w-3xl my-auto px-4">
        <div className="inline-block mb-3 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest">
            {phase === 3 ? 'JAN NITI AI' : 'CINEMATIC OPENING'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-relaxed drop-shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all duration-700">
          {currentLanguage === 'hi' ? currentQuote.hi : currentQuote.en}
        </h2>
        {currentLanguage !== 'hi' && (
          <p className="text-sm sm:text-base font-medium text-slate-400 mt-2 italic">
            "{currentQuote.hi}"
          </p>
        )}
      </div>

      {/* 5. Bottom Interactive Actions (Appears on Phase 3 or available immediately) */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center gap-4 max-w-md w-full">
        <button
          onClick={onWatchFullStory}
          className="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 hover:scale-[1.02] text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>हमारी 90s कहानी देखें (Play Film)</span>
        </button>

        <button
          onClick={onClose}
          className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Explore Platform</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
