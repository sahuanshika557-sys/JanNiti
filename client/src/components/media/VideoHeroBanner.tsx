import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Eye, 
  Maximize2,
  Activity,
  Layers
} from 'lucide-react';

interface VideoHeroBannerProps {
  tagline?: string;
  onOpenVideoTour?: () => void;
  onSwitchToPolicymaker?: () => void;
}

export const VideoHeroBanner: React.FC<VideoHeroBannerProps> = ({
  tagline = 'Turning Citizen Voices into Smarter Public Infrastructure',
  onOpenVideoTour,
  onSwitchToPolicymaker
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // High-performance public CDN ambient infrastructure video loops
  // Fallback to high-definition smart city infrastructure video
  const videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-infrastructure-night-timelapse-42065-large.mp4';
  const backupVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42064-large.mp4';

  const togglePlay = () => {
    const vid = document.getElementById('hero-ambient-video') as HTMLVideoElement;
    if (vid) {
      if (isPlaying) vid.pause();
      else vid.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const vid = document.getElementById('hero-ambient-video') as HTMLVideoElement;
    if (vid) {
      vid.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-950 text-white group">
      {/* 1. Looping Animated Ambient Infrastructure Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          id="hero-ambient-video"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-90 contrast-125"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={backupVideoUrl} type="video/mp4" />
        </video>

        {/* Dynamic Dark Gradient & Mesh Light Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

        {/* High-tech animated scanning grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      {/* 2. Hero Content Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4 text-left">
          {/* Top Pill with live pulse */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-black shadow-lg backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>DIGITAL PUBLIC GOOD FOR INDIA • AI INFRASTRUCTURE DECISION ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white tracking-tight leading-tight drop-shadow-md">
            {tagline}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-medium drop-shadow">
            Submit your village or city development demands in your mother tongue. Google Gemini AI understands your voice, calculates transparent priority scores, and connects your needs to national public works missions.
          </p>

          {/* Feature Badges & Watch Video Button */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onOpenVideoTour && (
              <button
                onClick={onOpenVideoTour}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Watch Multilingual Story Video (10 Languages)</span>
              </button>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold text-slate-200">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>10 Indian Languages</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Google Gemini 1.5 Flash</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold text-slate-200">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Geospatial Hotspots</span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Widget with Live Scanning Radar Video Card */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="p-5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">Live AI Telemetry</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                2,420 Verified Signals
              </span>
            </div>

            {/* Radar scanning miniature animation */}
            <div className="relative h-28 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Radar Circles */}
              <div className="absolute w-24 h-24 rounded-full border border-cyan-500/30 animate-ping opacity-30" />
              <div className="absolute w-20 h-20 rounded-full border border-cyan-500/40" />
              <div className="absolute w-12 h-12 rounded-full border border-cyan-500/50" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />

              {/* Radar Scanning Line */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-transparent animate-spin origin-center" style={{ animationDuration: '4s' }} />

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded backdrop-blur-sm border border-slate-800">
                <span className="text-cyan-300 font-mono">Cluster: CL-1042</span>
                <span className="text-amber-300 font-semibold">Priority: 91/100</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-300 font-medium">
                Clustered across <strong>20 high-demand administrative districts</strong> in India.
              </div>
            </div>

            {onSwitchToPolicymaker && (
              <button
                onClick={onSwitchToPolicymaker}
                className="w-full py-2 px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>View Decision Intelligence Hub</span>
                <Layers className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Controls Bar */}
      <div className="absolute bottom-2.5 right-4 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-slate-400 text-[11px]">
        <button 
          onClick={togglePlay} 
          className="hover:text-white transition-colors"
          title={isPlaying ? 'Pause background video' : 'Play background video'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button 
          onClick={toggleMute} 
          className="hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-300" />}
        </button>
        <span className="text-[10px] text-slate-400 pl-1">Smart Infra Motion</span>
      </div>
    </div>
  );
};
