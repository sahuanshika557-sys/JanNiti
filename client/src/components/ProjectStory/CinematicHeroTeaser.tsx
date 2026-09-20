import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, ArrowRight, Activity, ShieldCheck, Globe2, HelpCircle } from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface CinematicHeroTeaserProps {
  onOpenStory: () => void;
  onExplorePlatform?: () => void;
  currentLanguage: SupportedLanguage;
}

export const CinematicHeroTeaser: React.FC<CinematicHeroTeaserProps> = ({
  onOpenStory,
  onExplorePlatform,
  currentLanguage
}) => {
  const [lineIndex, setLineIndex] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Rotating emotional storytelling lines
  const rotatingLines = [
    {
      hi: "हर आवाज़ एक संकेत है।",
      en: "Every voice is a signal."
    },
    {
      hi: "एक सड़क की समस्या... एक गाँव की आवाज़...",
      en: "A broken road... a village's voice..."
    },
    {
      hi: "सैकड़ों संकेत... एक बड़ा पैटर्न।",
      en: "Hundreds of signals... one interconnected pattern."
    },
    {
      hi: "जहाँ आवाज़ें कम हैं, क्या वहाँ ज़रूरत सच में कम है?",
      en: "Where voices are quiet, is the need truly less?"
    },
    {
      hi: "AI समझता है। इंसान निर्णय लेते हैं।",
      en: "AI discovers patterns. Humans make decisions."
    }
  ];

  // Rotate lines every 4.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % rotatingLines.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [rotatingLines.length]);

  // 60 FPS Continuous Miniature Story Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();

    const render = () => {
      const t = (Date.now() - startTime) / 1000;
      const w = canvas.width = canvas.offsetWidth || 560;
      const h = canvas.height = canvas.offsetHeight || 320;

      ctx.clearRect(0, 0, w, h);

      // Dark cinematic backdrop with subtle radial glow
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.8, '#020617');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 1. Parallax Distant Hill Line
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      ctx.bezierCurveTo(w * 0.25, h * 0.55, w * 0.7, h * 0.7, w, h * 0.6);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // 2. Road Asphalt
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, h * 0.72, w, h * 0.28);

      // Road dash line
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(0, h * 0.86);
      ctx.lineTo(w, h * 0.86);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Citizen Character Rig (Walking & Gesturing)
      const walkCycle = Math.sin(t * 5) * 4;
      const citizenX = 70 + (Math.sin(t * 0.8) * 20);
      const citizenY = h * 0.68;

      // Body (Blue Kurta)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(citizenX - 6, citizenY - 18, 12, 22, 3);
      ctx.fill();

      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(citizenX, citizenY - 25, 7, 0, Math.PI * 2);
      ctx.fill();

      // Legs walking
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(citizenX - 3, citizenY + 4);
      ctx.lineTo(citizenX - 5 + walkCycle, citizenY + 18);
      ctx.moveTo(citizenX + 3, citizenY + 4);
      ctx.lineTo(citizenX + 5 - walkCycle, citizenY + 18);
      ctx.stroke();

      // Phone in hand
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(citizenX + 8, citizenY - 16, 4, 7);

      // 4. Glowing Flowing Voice Light Ribbon
      const streamStart = citizenX + 10;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(streamStart, citizenY - 14);

      const targetClusterX = w * 0.78;
      const targetClusterY = h * 0.38;

      ctx.bezierCurveTo(
        streamStart + 80,
        citizenY - 60 + Math.sin(t * 6) * 15,
        targetClusterX - 90,
        targetClusterY + 40 + Math.cos(t * 5) * 15,
        targetClusterX,
        targetClusterY
      );
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Additional citizen voice nodes joining the stream
      const extraNodes = [
        { x: w * 0.28, y: h * 0.62, color: '#34d399' },
        { x: w * 0.44, y: h * 0.78, color: '#fbbf24' },
        { x: w * 0.58, y: h * 0.58, color: '#f43f5e' }
      ];

      for (let i = 0; i < extraNodes.length; i++) {
        const node = extraNodes[i];
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Minor ribbon into cluster
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(targetClusterX, targetClusterY);
        ctx.stroke();
      }

      // 6. Fused Cluster Core (Pattern Detected)
      const clusterPulse = 18 + Math.sin(t * 4) * 5;
      const clusterGrad = ctx.createRadialGradient(targetClusterX, targetClusterY, 0, targetClusterX, targetClusterY, clusterPulse * 2.2);
      clusterGrad.addColorStop(0, '#ffffff');
      clusterGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.9)');
      clusterGrad.addColorStop(0.7, 'rgba(99, 102, 241, 0.4)');
      clusterGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = clusterGrad;
      ctx.beginPath();
      ctx.arc(targetClusterX, targetClusterY, clusterPulse * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Cluster Tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PATTERN DETECTED: CL-1041', targetClusterX, targetClusterY + clusterPulse + 16);

      // 7. Ambient Floating Particle Constellation (India Map Grid)
      for (let i = 0; i < 28; i++) {
        const px = (w * 0.5) + Math.cos(i * 1.3 + t * 0.3) * (60 + (i % 5) * 16);
        const py = (h * 0.32) + Math.sin(i * 1.3 + t * 0.3) * (40 + (i % 4) * 12);
        ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : '#818cf8';
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const activeQuote = rotatingLines[lineIndex];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 text-white p-6 sm:p-10 shadow-2xl">
      {/* Background Decorative Ambient Radial Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* LEFT COLUMN: Emotional Storyteller Copy & Curiosity Hooks */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>DIGITAL PUBLIC GOOD • DPI INDIA</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Canonical Narrative Engine</span>
          </div>

          {/* Rotating Headline with Smooth Crossfade */}
          <div className="min-h-[72px] sm:min-h-[84px] flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white leading-tight transition-all duration-500 drop-shadow-sm">
              {currentLanguage === 'hi' ? activeQuote.hi : activeQuote.en}
            </h1>
            {currentLanguage !== 'hi' && (
              <p className="text-sm sm:text-base text-cyan-300/80 font-medium italic mt-1">
                "{activeQuote.hi}"
              </p>
            )}
          </div>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            {currentLanguage === 'hi'
              ? 'JanNiti AI नागरिकों की व्यक्तिगत शिकायतों को एकत्रित करके, भौगोलिक डेटा के साथ जोड़ता है और नीति-निर्माताओं को साक्ष्य-आधारित निर्णय लेने में सक्षम बनाता है।'
              : 'JanNiti AI synthesizes thousands of citizen voices into clustered, evidence-backed public infrastructure decisions with transparent AI intelligence.'}
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenStory}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:scale-105 active:scale-95 text-slate-950 font-heading font-black text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2.5 transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Play className="w-3.5 h-3.5 fill-amber-400 ml-0.5" />
              </div>
              <span>हमारी कहानी देखें (90s Film)</span>
            </button>

            {onExplorePlatform && (
              <button
                onClick={onExplorePlatform}
                className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Curiosity Micro-Hook */}
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-800/80">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="italic">
              {currentLanguage === 'hi'
                ? 'क्या शांत इलाके सच में कम ज़रूरतमंद होते हैं? हमारी कहानी में देखिए कैसे मॉडल छिपी ज़रूरतों को पहचानता है।'
                : 'Do quiet areas truly have less demand? Watch our short film to see how spatial intelligence uncovers hidden need.'}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Continuously Moving Miniature Story World Canvas */}
        <div className="lg:col-span-5 relative">
          <div 
            onClick={onOpenStory}
            className="group relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-950/80 shadow-2xl p-2 cursor-pointer hover:border-cyan-500/50 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            title="Click to expand full-screen animated film"
          >
            {/* Tricolor Mini Top Trim */}
            <div className="h-1 w-full bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38] rounded-t" />

            {/* Living 60 FPS Miniature Canvas */}
            <canvas 
              ref={canvasRef} 
              className="w-full h-56 sm:h-64 object-cover rounded-2xl" 
            />

            {/* Hover Floating Overlay Badge */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] rounded-3xl">
              <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-400/60 text-cyan-300 font-bold text-xs flex items-center gap-2 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
                <Play className="w-4 h-4 fill-cyan-400" />
                <span>Click to Watch Full Screen Film</span>
              </div>
            </div>

            {/* Bottom Mini Ticker */}
            <div className="p-3 bg-slate-900/90 flex items-center justify-between text-[11px] rounded-b-2xl border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-300 font-semibold uppercase tracking-wider">
                  Live Flow: Voice → Light → Pattern
                </span>
              </div>
              <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Expand Film <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
