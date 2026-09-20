import React, { useState } from 'react';
import { Cpu, AlertTriangle, ChevronRight, TrendingUp, ShieldCheck, Activity, Info } from 'lucide-react';
import { MLDemandPrediction } from '../../types';

interface PredictiveGapsSectionProps {
  predictions: MLDemandPrediction[];
}

export const PredictiveGapsSection: React.FC<PredictiveGapsSectionProps> = ({ predictions }) => {
  const [selectedPred, setSelectedPred] = useState<MLDemandPrediction | null>(predictions[0] || null);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-heading font-black text-slate-900">
              Predictive Infrastructure Demand &amp; Intervention Risk Model
            </h3>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              ML Feature Scoring
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Interpretable machine learning model estimating probability of infrastructure breakdown and urgent intervention need.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Risk Rankings */}
        <div className="space-y-2.5 lg:col-span-1 max-h-[540px] overflow-y-auto pr-1 scrollbar-none">
          {predictions.map((pred) => {
            const isSelected = selectedPred?.district === pred.district && selectedPred?.state === pred.state;

            return (
              <div
                key={`${pred.state}-${pred.district}`}
                onClick={() => setSelectedPred(pred)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                  isSelected
                    ? 'bg-gov-50 border-gov-500 shadow-md ring-2 ring-gov-200 scale-[1.01]'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    {pred.district}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded ${
                    pred.predictedDemandRisk === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200' :
                    pred.predictedDemandRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 
                    'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {pred.predictedDemandRisk} RISK
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{pred.state}</span>
                  <span className="font-extrabold text-gov-800">
                    {pred.probabilityPercent}% Probability
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pred.probabilityPercent >= 70 ? 'bg-red-600' :
                      pred.probabilityPercent >= 45 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pred.probabilityPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Prediction Explainability Dossier */}
        {selectedPred && (
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedPred.state}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                    Demand Risk: {selectedPred.predictedDemandRisk}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                  {selectedPred.district} District Risk Evaluation
                </h3>
              </div>

              <div className="text-right">
                <span className="text-3xl font-heading font-black text-gov-800">
                  {selectedPred.probabilityPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block font-bold uppercase">Intervention Need</span>
              </div>
            </div>

            {/* Baseline Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Baseline Deficit Index</span>
                <span className="font-black text-slate-900 text-base mt-0.5 block">{selectedPred.baselineDeficitScore}/100</span>
                <span className="text-[10px] text-slate-500 block">Census / NITI Aayog</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">30-Day Velocity</span>
                <span className="font-black text-red-600 text-base mt-0.5 block">+{selectedPred.historicalGrowthRate}%</span>
                <span className="text-[10px] text-slate-500 block">Complaint Momentum</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Model Confidence</span>
                <span className="font-black text-emerald-700 text-base mt-0.5 block">94.8%</span>
                <span className="text-[10px] text-slate-500 block">Interpretable Logit</span>
              </div>
            </div>

            {/* Explainable Feature Importance Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-gov-600" />
                <span>Feature Importance Weights (Explainable ML Attribution)</span>
              </div>

              <div className="space-y-3">
                {(selectedPred.featureImportances || []).map((feat, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{feat.feature}</span>
                      <span className="font-black text-gov-800 bg-gov-100 px-2.5 py-0.5 rounded-lg border border-gov-200">
                        Weight: {feat.importance}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gov-600 h-full rounded-full"
                        style={{ width: `${feat.importance * 3}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
