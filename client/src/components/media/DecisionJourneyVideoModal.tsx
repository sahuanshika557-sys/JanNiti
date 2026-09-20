import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Sparkles, 
  Radio, 
  Activity, 
  Layers, 
  Compass, 
  Sliders, 
  CheckCircle2, 
  MapPin,
  TrendingUp,
  Volume2,
  VolumeX,
  Building2,
  Cpu
} from 'lucide-react';

interface DecisionJourneyVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
}

interface Chapter {
  id: number;
  title: string;
  badge: string;
  duration: number; // in seconds
  description: string;
  visualType: 'voice_ingestion' | 'clustering' | 'evidence_fusion' | 'simulation_budget';
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Chapter 1: Multimodal Citizen Voice Ingestion',
    badge: '10+ INDIAN LANGUAGES & GEMINI 1.5 FLASH',
    duration: 6,
    description: 'A citizen speaks in Hindi describing severe monsoon waterlogging and road craters. Gemini 1.5 Flash transcribes dialectal audio, performs structured JSON taxonomy categorization, and evaluates multimodal road damage photography.',
    visualType: 'voice_ingestion'
  },
  {
    id: 2,
    title: 'Chapter 2: Semantic Clustering & Duplicate Detection',
    badge: 'ISSUE CLUSTER CL-1042 • 94% CONFIDENCE',
    duration: 6,
    description: 'Rather than treating 127 citizen grievances as isolated complaints, JanNiti AI detects spatial and semantic convergence, grouping them into Issue Cluster CL-1042 and inferring the underlying drainage root cause.',
    visualType: 'clustering'
  },
  {
    id: 3,
    title: 'Chapter 3: 10-Layer Evidence Fusion & Gap Engine',
    badge: 'MULTI-SOURCE CPHEEO / MoHUA BENCHMARKS',
    duration: 6,
    description: 'Citizen demand (92%) is fused with Census demographics (18,400 beneficiaries), PM GatiShakti infrastructure deficit (88%), and pre-monsoon precipitation risks (+34% velocity).',
    visualType: 'evidence_fusion'
  },
  {
    id: 4,
    title: 'Chapter 4: What-If Policy Simulation & Budget Portfolio',
    badge: 'HUMAN-IN-THE-LOOP & VERIFIED OUTCOMES',
    duration: 6,
    description: 'Policymakers simulate Option A vs Option C, allocate ₹10 Cr capital budget, sanction project in the tamper-evident audit log, and verify 52% grievance reduction with citizen feedback.',
    visualType: 'simulation_budget'
  }
];

export const DecisionJourneyVideoModal: React.FC<DecisionJourneyVideoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0); // 0 to 100

  const activeChapter = CHAPTERS[activeChapterIdx];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalTime = 100; // ms
    const stepIncrement = (intervalTime / (activeChapter.duration * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next chapter
          if (activeChapterIdx < CHAPTERS.length - 1) {
            setActiveChapterIdx((c) => c + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, activeChapterIdx, activeChapter.duration]);

  if (!isOpen) return null;

  const handleSelectChapter = (idx: number) => {
    setActiveChapterIdx(idx);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">JanNiti AI Decision Tour Video Walkthrough</h3>
              <span className="text-[11px] text-slate-400">Interactive DPI Architecture Animation</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas / Animation Stage */}
        <div className="relative bg-slate-950 p-6 sm:p-8 flex-1 min-h-[300px] flex flex-col justify-center items-center overflow-hidden">
          {/* Animated Matrix Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf815_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* CHAPTER 1 VISUAL: VOICE & MULTIMODAL INGESTION */}
          {activeChapter.visualType === 'voice_ingestion' && (
            <div className="relative z-10 w-full max-w-xl space-y-4 text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Audio Waveform Dialect Telemetry (Hindi - 96% Acc)</span>
              </div>

              {/* Dynamic Waveform Graphic */}
              <div className="flex items-center justify-center gap-1.5 py-4">
                {[40, 65, 85, 30, 95, 75, 45, 90, 60, 80, 50, 70, 95, 40, 85, 60].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full bg-gradient-to-t from-cyan-500 to-indigo-500 animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 80}ms`,
                      animationDuration: '1.2s'
                    }}
                  />
                ))}
              </div>

              {/* Transcript Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl text-left space-y-2">
                <div className="text-xs text-slate-400 font-medium">Citizen Voice Input (Lucknow):</div>
                <div className="text-sm font-semibold text-white">
                  "हमारे इलाके में बारिश के समय सड़क पर बहुत पानी भर जाता है और सड़क खराब हो जाती है।"
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-cyan-300">
                  <span>Gemini Tag: <strong>Roads + Stormwater Drainage</strong></span>
                  <span className="text-rose-400 font-bold">Urgency: Critical</span>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 2 VISUAL: ISSUE CLUSTERING */}
          {activeChapter.visualType === 'clustering' && (
            <div className="relative z-10 w-full max-w-xl space-y-4 text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Semantic Issue Clustering Algorithm • Cluster ID: CL-1042</span>
              </div>

              <div className="grid grid-cols-3 gap-3 py-2 text-left">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 opacity-60">
                  <div className="text-[10px] text-slate-500">Report #101</div>
                  "Potholes on road"
                </div>
                <div className="p-3 bg-indigo-900/40 rounded-xl border border-indigo-500/60 text-xs text-white ring-2 ring-indigo-400 shadow-lg col-span-1">
                  <div className="text-[10px] text-amber-400 font-bold">Cluster Synthesized</div>
                  <strong className="text-sm text-cyan-300">127 Reports</strong>
                  <div className="text-[10px] text-slate-300 mt-1">94% Confidence</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 opacity-60">
                  <div className="text-[10px] text-slate-500">Report #103</div>
                  "Drain overflowing"
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 text-left">
                <strong className="text-amber-300">AI Root Cause Inference:</strong> Blocked culverts preventing runoff, deteriorating asphalt sub-base.
              </div>
            </div>
          )}

          {/* CHAPTER 3 VISUAL: EVIDENCE FUSION */}
          {activeChapter.visualType === 'evidence_fusion' && (
            <div className="relative z-10 w-full max-w-xl space-y-3 animate-in zoom-in-95 duration-300">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold">
                  <Layers className="w-3.5 h-3.5 text-cyan-300" />
                  <span>10-Layer Multi-Source Evidence Fusion Panel</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                    <span>Citizen Demand Density</span>
                    <strong className="text-cyan-300">92%</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                    <span>Infrastructure Deficit Gap</span>
                    <strong className="text-rose-400">88%</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                    <span>Population Impact Reach</span>
                    <strong className="text-sky-300">81% (~18,400 Citizens)</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: '81%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 4 VISUAL: SIMULATION & OUTCOMES */}
          {activeChapter.visualType === 'simulation_budget' && (
            <div className="relative z-10 w-full max-w-xl space-y-3 animate-in zoom-in-95 duration-300 text-left">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Option C Sanctioned • Budget ₹3.2 Cr • 52% Demand Reduction</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Before Intervention</span>
                  <div className="text-xl font-bold text-rose-400">820 Grievances/mo</div>
                  <div className="text-[11px] text-slate-400">Gap Score: 86/100</div>
                </div>

                <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-500/50 text-xs space-y-1">
                  <span className="text-emerald-400 text-[10px] uppercase font-bold">After DPI Upgrade</span>
                  <div className="text-xl font-bold text-emerald-300">410 Grievances/mo</div>
                  <div className="text-[11px] text-emerald-400">88% Citizen Satisfaction</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chapter Details & Progress */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase block">{activeChapter.badge}</span>
              <h4 className="text-base font-extrabold text-white mt-0.5">{activeChapter.title}</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">{activeChapter.description}</p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => {
                  if (activeChapterIdx < CHAPTERS.length - 1) {
                    handleSelectChapter(activeChapterIdx + 1);
                  } else {
                    handleSelectChapter(0);
                  }
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                title="Skip to next chapter"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timeline Bar with 4 Chapters */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {CHAPTERS.map((ch, idx) => (
              <div
                key={ch.id}
                onClick={() => handleSelectChapter(idx)}
                className="cursor-pointer group space-y-1"
              >
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-100"
                    style={{
                      width: idx < activeChapterIdx ? '100%' : (idx === activeChapterIdx ? `${progress}%` : '0%')
                    }}
                  />
                </div>
                <div className="text-[10px] font-semibold text-slate-400 group-hover:text-white transition-colors truncate">
                  {idx + 1}. {ch.title.split(':')[1] || ch.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
