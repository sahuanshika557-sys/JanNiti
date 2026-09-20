import React from 'react';
import { Clock, MapPin, Sparkles, CheckCircle, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { CitizenRequest, SupportedLanguage } from '../../types';
import { AudioReadout } from '../voice/AudioReadout';

interface MyRequestsListProps {
  requests: CitizenRequest[];
  currentLanguage: SupportedLanguage;
  onSelectRequest?: (req: CitizenRequest) => void;
}

const STATUS_STEPS = [
  'Submitted',
  'AI Analysed',
  'Clustered',
  'Under Review',
  'Prioritized',
  'Recommended',
  'Human Decision',
  'Assigned',
  'In Progress',
  'Completed',
  'Impact Verified'
];

export const MyRequestsList: React.FC<MyRequestsListProps> = ({
  requests,
  currentLanguage,
  onSelectRequest
}) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60">
        <Activity className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-700">No requests submitted in this session yet</h4>
        <p className="text-xs text-slate-500 mt-1">
          Submit your first development demand above using voice or text.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span>My Registered Submissions</span>
          <span className="px-2.5 py-0.5 rounded-full bg-gov-100 text-gov-800 text-xs font-black">
            {requests.length}
          </span>
        </h3>
        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          Demo Tracking
        </span>
      </div>

      <div className="space-y-3">
        {requests.map((req) => {
          const currentStepIdx = STATUS_STEPS.indexOf(req.status);

          return (
            <div
              key={req.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-gov-400 shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold bg-gov-50 text-gov-800 px-2.5 py-0.5 rounded-lg border border-gov-200">
                    {req.requestId}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{req.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    req.urgency === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                    req.urgency === 'High' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 
                    'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    {req.urgency}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(req.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Original & Translated text */}
              <div className="space-y-1.5 mb-3 text-xs">
                <p className="text-slate-800 font-medium">"{req.text}"</p>
                {req.problemSummary && req.problemSummary !== req.text && (
                  <div className="flex items-start gap-1.5 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-gov-600 shrink-0 mt-0.5" />
                    <span><strong className="text-gov-800">AI Summary:</strong> {req.problemSummary}</span>
                  </div>
                )}
              </div>

              {/* Location & Priority */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="font-medium">{req.location.cityOrVillage || req.location.subDistrict}, {req.location.district}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 font-medium">Priority:</span>
                    <span className="font-black text-gov-800 bg-gov-50 px-2 py-0.5 rounded border border-gov-200">
                      {req.priorityScore}/100
                    </span>
                  </div>
                  <AudioReadout
                    text={`Request ID ${req.requestId}. ${req.problemSummary}. Priority score is ${req.priorityScore} out of 100.`}
                    language={currentLanguage}
                    size="sm"
                    label="Audio"
                  />
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                  <span className="text-gov-800">Status: {req.status}</span>
                  <span>Step {Math.max(1, currentStepIdx + 1)} / 7</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  {STATUS_STEPS.map((step, idx) => (
                    <div
                      key={step}
                      className={`h-full flex-1 border-r border-white ${
                        idx <= currentStepIdx
                          ? idx === currentStepIdx
                            ? 'bg-gov-600'
                            : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                      title={step}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
