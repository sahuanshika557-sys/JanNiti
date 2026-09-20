import React, { useState } from 'react';
import { 
  Building2, Globe2, Sparkles, Layers, FileText, 
  Activity, Compass, Sliders, CheckCircle2, History,
  FileCode2, Menu, X, Play, ShieldCheck, Radio
} from 'lucide-react';
import { LANGUAGES } from '../../i18n/translations';
import { SupportedLanguage } from '../../types';

export type NavTab = 
  | 'citizen' 
  | 'intelligence' 
  | 'policymaker' 
  | 'areaintelligence' 
  | 'simulator' 
  | 'impact' 
  | 'governance' 
  | 'transparency' 
  | 'datasources' 
  | 'responsibleai';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isAiConnected?: boolean;
  onOpenVideoTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  currentTab,
  onTabChange,
  isAiConnected = true,
  onOpenVideoTour
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Grouped Navigation Structure
  const isCitizenMode = currentTab === 'citizen';

  const intelligenceTabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'intelligence', label: 'Intelligence Center', icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />, badge: 'LIVE' },
    { id: 'policymaker', label: 'National Map & Hotspots', icon: <Layers className="w-3.5 h-3.5 text-sky-300" /> },
    { id: 'areaintelligence', label: 'Area Intelligence', icon: <Compass className="w-3.5 h-3.5 text-emerald-300" /> },
    { id: 'simulator', label: 'Policy Simulator', icon: <Sliders className="w-3.5 h-3.5 text-purple-300" /> },
    { id: 'impact', label: 'Impact & Verification', icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" /> },
    { id: 'governance', label: 'Governance & Audit', icon: <History className="w-3.5 h-3.5 text-rose-300" /> },
    { id: 'transparency', label: 'Model Transparency', icon: <FileCode2 className="w-3.5 h-3.5 text-indigo-300" /> },
    { id: 'datasources', label: 'Data Registry', icon: <FileText className="w-3.5 h-3.5 text-slate-300" /> },
    { id: 'responsibleai', label: 'Responsible AI', icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" /> }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md text-white shadow-2xl border-b border-slate-800/80">
      {/* Indian National Tricolor Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38]"></div>

      {/* TOP TIER: Brand Logo, Persistent Voice Status & Global Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none" 
            onClick={() => onTabChange('intelligence')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-slate-900 to-cyan-700 flex items-center justify-center text-white border border-cyan-400/30 shadow-md group-hover:scale-105 transition-all">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg sm:text-xl text-white tracking-tight">
                  JanNiti<span className="text-cyan-400"> AI</span>
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 tracking-wider">
                  DPI INDIA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Digital Public Infrastructure for Decision Intelligence
              </span>
            </div>
          </div>

          {/* Persistent Live Voice Status Element */}
          <div 
            onClick={() => onTabChange('intelligence')}
            className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/60 shadow-inner cursor-pointer transition-all group"
            title="Live telemetry: 2,420 citizen voices synthesized into 211 active clusters"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 voice-signal-node shrink-0" />
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                2,420 VOICES
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300 font-medium">
                211 CLUSTERS
              </span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 uppercase tracking-widest">
              Live
            </span>
          </div>

          {/* Center Primary Segmented Switch */}
          <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onTabChange('citizen')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isCitizenMode
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-300" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => onTabChange(isCitizenMode ? 'intelligence' : currentTab)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isCitizenMode
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Decision Hub</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Our Story Button */}
            {onOpenVideoTour && (
              <button
                onClick={onOpenVideoTour}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:scale-105 active:scale-95 text-slate-950 shadow-md shadow-amber-500/20 transition-all group cursor-pointer"
                title="Discover Our Story (A 90-Second Animated Human Film)"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950 group-hover:scale-110 transition-transform" />
                <span>Our Story</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs shadow-inner">
              <Globe2 className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* SECOND TIER: DECISION HUB SUB-NAV BAR (Smooth scroll, refined active indicator) */}
      {!isCitizenMode && (
        <div className="bg-slate-900/90 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar scroll-smooth">
              {intelligenceTabs.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm ring-1 ring-cyan-400/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FULLSCREEN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-2">
          {/* Mobile Live Voice Status */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 voice-signal-node" />
              <span className="text-xs font-mono font-bold text-slate-200">2,420 Connected Voices</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">LIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                onTabChange('citizen');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                isCitizenMode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Citizen Portal
            </button>
            <button
              onClick={() => {
                onTabChange('intelligence');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${
                !isCitizenMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Decision Hub
            </button>
          </div>

          <div className="space-y-1">
            {intelligenceTabs.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold ${
                  currentTab === item.id ? 'bg-indigo-600 text-white ring-1 ring-cyan-400/40' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
