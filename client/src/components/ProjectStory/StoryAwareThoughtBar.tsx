import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Quote, ArrowRight, Lightbulb } from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface StoryAwareThoughtBarProps {
  onOpenStory: () => void;
  currentLanguage: SupportedLanguage;
}

export const StoryAwareThoughtBar: React.FC<StoryAwareThoughtBarProps> = ({
  onOpenStory,
  currentLanguage
}) => {
  const [quoteIdx, setQuoteIdx] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const quotes = [
    {
      hi: "एक आवाज़ छोटी हो सकती है। लेकिन कई आवाज़ें मिलकर एक दिशा दिखा सकती हैं।",
      en: "A single voice may be quiet. But thousands together illuminate direction."
    },
    {
      hi: "Data बताता है कि क्या हो रहा है। आवाज़ें समझाती हैं कि क्यों।",
      en: "Data reveals WHAT is occurring. Voices help us comprehend WHY."
    },
    {
      hi: "हर map और बिंदु के पीछे एक मानवीय जीवन और संघर्ष होता है।",
      en: "Behind every coordinate and heatmap point lies a human reality."
    },
    {
      hi: "जहाँ data कम दिखाई देता है, वहाँ सवाल और भी ज़रूरी हो जाते हैं।",
      en: "Where data appears sparse, inquiries become even more critical."
    },
    {
      hi: "सुनी गई आवाज़ केवल शिकायत नहीं—वह नीतिगत समाधान का पहला संकेत है।",
      en: "A heard voice is not mere grievance—it is the first signal of policy reform."
    },
    {
      hi: "AI पैटर्न पहचान सकता है; इंसान ही उनका वास्तविक अर्थ समझता है।",
      en: "AI identifies patterns; human governance understands their true purpose."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  // Subtle animated background canvas for the story entry
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = canvas.width = canvas.offsetWidth || 300;
      const h = canvas.height = canvas.offsetHeight || 90;

      ctx.clearRect(0, 0, w, h);

      // Faint India outline nodes
      for (let i = 0; i < 14; i++) {
        const x = (w * 0.7) + Math.cos(i * 1.5 + t * 0.5) * (20 + (i % 3) * 10);
        const y = (h * 0.5) + Math.sin(i * 1.5 + t * 0.5) * (15 + (i % 2) * 8);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(251, 191, 36, 0.35)';
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Moving light ribbon
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.4, h * 0.5);
      ctx.bezierCurveTo(w * 0.55, h * 0.2 + Math.sin(t) * 8, w * 0.7, h * 0.8 + Math.cos(t) * 8, w * 0.85, h * 0.5);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, []);

  const activeQuote = quotes[quoteIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Story Thought / Voice of the Day */}
        <div className="md:col-span-8 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/80 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 shadow-md backdrop-blur-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Lightbulb className="w-4 h-4 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                VOICE OF THE DAY • STORY THOUGHT
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 tracking-wide truncate sm:whitespace-normal">
              "{currentLanguage === 'hi' ? activeQuote.hi : activeQuote.en}"
            </p>
          </div>
        </div>

        {/* Dashboard Story Entry Banner */}
        <div 
          onClick={onOpenStory}
          className="md:col-span-4 group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-3.5 shadow-md cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] flex items-center justify-between"
          title="Watch the JanNiti AI Animated Human Story"
        >
          {/* Faint Canvas Atmosphere */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-60" />

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span className="text-[10px] font-black text-cyan-300 tracking-wider uppercase">
                ✦ ONE VOICE
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-300">
              When thousands of voices become one picture.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md group-hover:scale-105 transition-transform shrink-0 ml-2">
            <Play className="w-3 h-3 fill-slate-950" />
            <span>Story →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
