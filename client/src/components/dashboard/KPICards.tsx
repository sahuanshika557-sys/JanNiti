import React from 'react';
import { Users, AlertTriangle, Flame, TrendingUp, Sparkles, Activity, ShieldAlert } from 'lucide-react';
import { PlatformStats } from '../../types';

interface KPICardsProps {
  stats: PlatformStats | null;
  selectedState?: string;
  selectedDistrict?: string;
}

export const KPICards: React.FC<KPICardsProps> = ({
  stats,
  selectedState,
  selectedDistrict
}) => {
  if (!stats) return null;

  return (
    <div className="w-full bg-slate-900 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 voice-signal-node" />
          <span className="font-mono font-bold tracking-widest text-cyan-300 uppercase">
            PUBLIC DECISION INTELLIGENCE TELEMETRY
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          {selectedDistrict !== 'All' ? `Jurisdiction: ${selectedDistrict}, ${selectedState}` : 'Scope: Pan-India Ingestion'}
        </span>
      </div>

      {/* Structured Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Metric 1: Total Citizen Voices */}
        <div className="flex flex-col justify-between pt-2 lg:pt-0 lg:px-3 first:pl-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Citizen Voices
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              +24%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight mt-0.5">
            {stats.totalRequests.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
            Ingested across 20 districts
          </p>
        </div>

        {/* Metric 2: Active Demand Clusters */}
        <div className="flex flex-col justify-between pt-2 lg:pt-0 lg:px-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Active Patterns
            </span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
              94% Conf.
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-heading tracking-tight mt-0.5">
            {stats.activeHotspotsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
            Synthesized issue clusters
          </p>
        </div>

        {/* Metric 3: Critical Priority Zones */}
        <div className="flex flex-col justify-between pt-2 lg:pt-0 lg:px-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Priority Zones
            </span>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
              Score ≥ 75
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-heading tracking-tight mt-0.5">
            {stats.highPriorityCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
            Urgent infrastructure risk
          </p>
        </div>

        {/* Metric 4: Population Impact Exposure */}
        <div className="flex flex-col justify-between pt-2 lg:pt-0 lg:px-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Est. Beneficiaries
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              Catchment
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-heading tracking-tight mt-0.5">
            ~{stats.estimatedCitizensAffected.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
            Directly impacted residents
          </p>
        </div>

        {/* Metric 5: Actionable Project Dossiers */}
        <div className="flex flex-col justify-between pt-2 lg:pt-0 lg:px-3 last:pr-0 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Project Proposals
            </span>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
              Sanction Ready
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-300 font-heading tracking-tight mt-0.5">
            {stats.recommendedProjectsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
            Evidence-backed public briefs
          </p>
        </div>
      </div>
    </div>
  );
};
