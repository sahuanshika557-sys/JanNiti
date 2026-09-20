import React, { useState } from 'react';
import { Sparkles, Building2, Download, CheckCircle2, ChevronRight, MapPin, Users, Coins, HelpCircle } from 'lucide-react';
import { ProjectRecommendation } from '../../types';

interface RecommendationsListProps {
  recommendations: ProjectRecommendation[];
  onSelectProject?: (rec: ProjectRecommendation) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  onSelectProject
}) => {
  const [selectedRec, setSelectedRec] = useState<ProjectRecommendation | null>(recommendations[0] || null);

  const handleExportBrief = (rec: ProjectRecommendation) => {
    const content = `===============================================================
JANNITI AI — DIGITAL PUBLIC GOOD FOR INFRASTRUCTURE PLANNING
EXECUTIVE POLICY BRIEF & PROJECT SANCTION DOSSIER
Generated: ${new Date().toLocaleString('en-IN')}
===============================================================

PROJECT TITLE:
${rec.title}

TARGET GEOGRAPHY:
District: ${rec.location.district}, State: ${rec.location.state}
Coordinates: ${rec.location.coordinates[0]}, ${rec.location.coordinates[1]}

PRIORITY DEMAND SCORE: ${rec.priorityScore} / 100
ESTIMATED BUDGET TIER: ${rec.budgetTier}
ESTIMATED CITIZEN BENEFICIARIES: ~${rec.evidence.affectedPopulation.toLocaleString('en-IN')}

CORE PROBLEM STATEMENT:
${rec.problem}

RECOMMENDED PUBLIC WORKS INTERVENTION:
${rec.suggestedIntervention}

EXPECTED PUBLIC IMPACT:
${rec.expectedImpact}

SUPPORTING CITIZEN EVIDENCE & AUDIT TRAIL:
- Total Citizen Submissions in Hotspot: ${rec.evidence.requestCount}
- Average Citizen Priority Score: ${rec.evidence.averagePriority}/100
- Key Indicator Flags:
  * ${rec.evidence.keyIndicators.join('\n  * ')}

SAMPLE CITIZEN SUBMISSIONS:
- ${rec.evidence.topCitizenQuotes.join('\n- ')}

NATIONAL MISSION & SCHEME ALIGNMENT:
${(rec.nationalMissionAlignment || []).map(m => `* ${m.mission || 'National Scheme'} [Scheme Code: ${m.schemeCode || 'N/A'}] - ${m.description || m.reason || 'Infrastructure Alignment'}`).join('\n')}

AI REASONING & EXPLANATION:
${rec.aiExplanation || 'Composite multi-factor prioritization recommendation.'}

===============================================================
DISCLAIMER: Advisory decision support powered by JanNiti AI.
Final sanction rests with designated administrative and financial authorities.
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JanNiti_Project_Brief_${rec.location.district.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 voice-signal-node" />
            <h3 className="text-lg font-heading font-black text-white">
              AI Project Proposals & Policy Interventions
            </h3>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Evidence Dossiers
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Synthesizing citizen demand clusters, baseline deficit indicators, and national missions into actionable proposals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Recommended Projects */}
        <div className="space-y-3 lg:col-span-1 max-h-[600px] overflow-y-auto pr-1 scrollbar-none">
          {recommendations.map((rec) => {
            const isSelected = selectedRec?.id === rec.id;

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRec(rec)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {rec.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rec.priorityScore >= 80 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    Priority: {rec.priorityScore}/100
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  {rec.title}
                </h4>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {rec.location.district}, {rec.location.state}
                  </span>
                  <span className="font-bold text-amber-300">
                    {rec.budgetTier}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Dossier Inspection */}
        {selectedRec && (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedRec.id}
                  </span>
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedRec.location.district}, {selectedRec.location.state}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {selectedRec.title}
                </h3>
              </div>

              <button
                onClick={() => handleExportBrief(selectedRec)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Policy Brief</span>
              </button>
            </div>

            {/* Core Problem & Intervention */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  CORE PROBLEM STATEMENT
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedRec.problem}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  RECOMMENDED INTERVENTION
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedRec.suggestedIntervention}
                </p>
              </div>
            </div>

            {/* Supporting Citizen Evidence & Quotes */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                SUPPORTING CITIZEN EVIDENCE &amp; GROUND VOICES
              </span>
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-2.5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pb-2 border-b border-slate-800">
                  <span>Reports Ingested: <strong className="text-white">{selectedRec.evidence.requestCount}</strong></span>
                  <span>Avg Priority: <strong className="text-amber-400">{selectedRec.evidence.averagePriority}/100</strong></span>
                  <span>Est Beneficiaries: <strong className="text-emerald-300">~{selectedRec.evidence.affectedPopulation.toLocaleString()}</strong></span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {selectedRec.evidence.topCitizenQuotes.map((q, idx) => (
                    <div key={idx} className="text-xs text-slate-300 italic flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">“</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* National Mission Alignment */}
            {selectedRec.nationalMissionAlignment && selectedRec.nationalMissionAlignment.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  NATIONAL SCHEME &amp; MISSION ALIGNMENT
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedRec.nationalMissionAlignment.map((mission, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">{mission.mission}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{mission.description || mission.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
