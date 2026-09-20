import React from 'react';
import { X, Sparkles, MapPin, Clock, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { CitizenRequest } from '../../types';
import { AudioReadout } from '../voice/AudioReadout';

interface RequestDetailsModalProps {
  request: CitizenRequest | null;
  onClose: () => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  onClose
}) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-gov-800 to-gov-900 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-white/20 text-amber-300 border border-white/20">
              {request.requestId}
            </span>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base">Citizen Demand Dossier</h3>
              <p className="text-[11px] text-slate-300">
                Logged on {new Date(request.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Status & Priority Highlight */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Workflow Status</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-gov-100 text-gov-800 border border-gov-200 inline-block mt-0.5">
                {request.status} (Demo Workflow)
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Urgency Level</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded inline-block mt-0.5 ${
                request.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                request.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {request.urgency}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Transparent Priority</span>
              <span className="text-xl font-heading font-extrabold text-gov-800">
                {request.priorityScore}/100
              </span>
            </div>
          </div>

          {/* Original Text & Translation */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Original Citizen Statement ({request.language}):</span>
                <AudioReadout text={request.originalText} language={request.language} size="sm" />
              </div>
              <p className="text-sm font-medium text-slate-900 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{request.originalText}"
              </p>
            </div>

            {request.translatedText && request.translatedText !== request.originalText && (
              <div className="p-4 rounded-xl bg-gov-50/70 border border-gov-200 space-y-1">
                <span className="text-xs font-bold text-gov-900 block">Standardized English Normalization:</span>
                <p className="text-xs text-slate-800 font-medium">
                  {request.translatedText}
                </p>
              </div>
            )}
          </div>

          {/* Location & Taxonomy Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Category</span>
              <span className="font-bold text-slate-800">{request.category}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Sub-Category</span>
              <span className="font-bold text-slate-800">{request.subCategory}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Location</span>
              <span className="font-bold text-slate-800">{request.location.district}, {request.location.state}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Est. Population</span>
              <span className="font-bold text-slate-800">~{request.affectedPopulationEstimate.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* AI Recommended Action */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>AI Recommended Public Action</span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              {request.recommendedAction}
            </p>
          </div>

          {/* Priority Score Explanation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gov-700" />
              <span>Why is this rated {request.priorityScore}/100?</span>
            </h4>

            <div className="grid grid-cols-3 gap-2 text-[11px] p-2.5 bg-white rounded-lg border border-slate-200 font-medium">
              <div>Urgency: <strong className="text-gov-700">{request.scoreBreakdown.urgency}/30</strong></div>
              <div>Affected Pop: <strong className="text-gov-700">{request.scoreBreakdown.affectedPopulation}/20</strong></div>
              <div>Infra Gap: <strong className="text-gov-700">{request.scoreBreakdown.infrastructureGap}/15</strong></div>
              <div>Demographics: <strong className="text-gov-700">{request.scoreBreakdown.demographicVulnerability}/15</strong></div>
              <div>Geo Density: <strong className="text-gov-700">{request.scoreBreakdown.geographicConcentration}/10</strong></div>
              <div>Public Impact: <strong className="text-gov-700">{request.scoreBreakdown.publicImpact}/10</strong></div>
            </div>

            <ul className="space-y-1 pt-1">
              {request.scoreBreakdown.reasons.map((r, idx) => (
                <li key={idx} className="text-emerald-800 font-medium text-[11px]">• {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
