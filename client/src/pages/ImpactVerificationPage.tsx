import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  Camera, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  HelpCircle, 
  ImageIcon, 
  Layers, 
  MapPin, 
  RefreshCw, 
  Sparkles, 
  ThumbsDown, 
  ThumbsUp, 
  TrendingDown, 
  Users,
  Check
} from 'lucide-react';
import { apiService } from '../services/api';
import { ImpactVerificationRecord } from '../types';

export const ImpactVerificationPage: React.FC = () => {
  const [records, setRecords] = useState<ImpactVerificationRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await apiService.getImpactVerificationRecords();
      setRecords(data);
      if (data.length > 0) {
        setSelectedRecordId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load impact verification records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (recordId: string, type: 'improved' | 'partiallyImproved' | 'notImproved') => {
    try {
      const updated = await apiService.recordCitizenImpactFeedback(recordId, type);
      setRecords(prev => prev.map(r => r.id === recordId ? updated : r));
      setFeedbackSuccess(recordId);
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to record citizen feedback:', err);
    }
  };

  const activeRecord = records.find(r => r.id === selectedRecordId) || records[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CLOSED-LOOP IMPACT VERIFICATION
                </span>
                <span className="text-xs text-slate-400">Post-Execution Telemetry & Citizen Feedback</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Impact Verification & Outcome Tracking
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Measuring real before-vs-after civic improvement, sensor feedback, and ground-level citizen satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Verification Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-extrabold text-lg">
              {records.length}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Completed DPI Interventions</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">Verified Public Works</div>
              <div className="text-[11px] text-teal-700">100% field audit completion</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg">
              63%
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Average Demand Reduction</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">Fewer Recurring Grievances</div>
              <div className="text-[11px] text-emerald-700">Measured 60 days post-launch</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-lg">
              87%
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Citizen Satisfaction</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">Positive Citizen Rating</div>
              <div className="text-[11px] text-indigo-700">1,022 total verified responses</div>
            </div>
          </div>
        </div>

        {/* VERIFICATION DEEP-DIVE CARD */}
        {activeRecord && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-white">
                    {activeRecord.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    {activeRecord.verificationStatus}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {activeRecord.district}, {activeRecord.state}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">{activeRecord.title}</h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">{activeRecord.interventionDescription}</p>
              </div>

              {/* District Switcher for Records */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Select Project:</span>
                <select
                  value={selectedRecordId}
                  onChange={(e) => setSelectedRecordId(e.target.value)}
                  className="bg-slate-50 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none"
                >
                  {records.map(r => (
                    <option key={r.id} value={r.id}>{r.title} ({r.district})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BEFORE VS AFTER KPI COMPARISON */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Before */}
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">Before Intervention</span>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Monthly Complaints:</span>
                    <strong className="text-rose-700 font-bold">{activeRecord.beforeMetrics.citizenRequestsPerMonth}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Infra Gap Score:</span>
                    <strong className="text-rose-700 font-bold">{activeRecord.beforeMetrics.infrastructureGapScore}/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Severity:</span>
                    <strong className="text-rose-700 font-bold">{activeRecord.beforeMetrics.reportedSeverity}</strong>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">After Completion</span>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Monthly Complaints:</span>
                    <strong className="text-emerald-700 font-bold">{activeRecord.afterMetrics.citizenRequestsPerMonth}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Infra Gap Score:</span>
                    <strong className="text-emerald-700 font-bold">{activeRecord.afterMetrics.infrastructureGapScore}/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Severity:</span>
                    <strong className="text-emerald-700 font-bold">{activeRecord.afterMetrics.reportedSeverity}</strong>
                  </div>
                </div>
              </div>

              {/* Net Variance */}
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2 flex flex-col justify-between">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">Net Civic Impact</span>
                <div>
                  <div className="text-2xl font-black text-indigo-900">
                    +{activeRecord.observedImprovementPercent}%
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Direct reduction in citizen distress calls and stormwater inundation frequency.
                  </p>
                </div>
              </div>
            </div>

            {/* VISUAL EVIDENCE COMPARISON (BEFORE / AFTER PHOTOS) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  Visual Photographic Evidence Comparison
                </h3>
                <span className="text-[11px] text-slate-400">AI-assisted visual feature verification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Initial Reported Condition (Before)</span>
                    <span className="text-[10px] text-rose-600 font-semibold">Potholes & Waterlogging</span>
                  </div>
                  <div className="h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                    <img 
                      src={activeRecord.visualEvidenceBeforeUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'} 
                      alt="Before" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-semibold">
                      Citizen Upload Signal
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Remediated Infrastructure (After)</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Resurfaced + RCC Drain</span>
                  </div>
                  <div className="h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                    <img 
                      src={activeRecord.visualEvidenceAfterUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'} 
                      alt="After" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-900/80 text-white text-[10px] font-semibold">
                      Department Completion Audit
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CITIZEN OUTCOME FEEDBACK LOOP */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Citizen Satisfaction Feedback Loop</h4>
                  <p className="text-xs text-slate-500">
                    Did this completed project resolve the ground-level infrastructure defect?
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Current Rating:</span>
                  <div className="text-lg font-extrabold text-emerald-700">
                    {activeRecord.citizenFeedback.citizenSatisfactionPercent}% Satisfaction
                  </div>
                  <span className="text-[10px] text-slate-500">{activeRecord.citizenFeedback.totalResponses} verified reviews</span>
                </div>
              </div>

              {/* Feedback Interactive Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleFeedback(activeRecord.id, 'improved')}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Significantly Improved ({activeRecord.citizenFeedback.improved})
                </button>

                <button
                  onClick={() => handleFeedback(activeRecord.id, 'partiallyImproved')}
                  className="px-4 py-2 text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition-all"
                >
                  Partially Improved ({activeRecord.citizenFeedback.partiallyImproved})
                </button>

                <button
                  onClick={() => handleFeedback(activeRecord.id, 'notImproved')}
                  className="px-4 py-2 text-xs font-semibold bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl transition-all"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Not Improved ({activeRecord.citizenFeedback.notImproved})
                </button>
              </div>

              {feedbackSuccess === activeRecord.id && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  Thank you! Your feedback has updated the real-time DPI outcome score.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
