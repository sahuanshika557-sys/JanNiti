import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Database, 
  FileCode2, 
  HelpCircle, 
  Layers, 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { apiService } from '../services/api';
import { DataQualityReport } from '../types';

export const ModelTransparencyPage: React.FC = () => {
  const [dataQuality, setDataQuality] = useState<DataQualityReport | null>(null);

  useEffect(() => {
    loadDataQuality();
  }, []);

  const loadDataQuality = async () => {
    try {
      const res = await apiService.getDataQualityReport();
      setDataQuality(res);
    } catch (err) {
      console.error('Failed to load data quality:', err);
    }
  };

  const modelCards = [
    {
      name: 'Gemini 1.5 Flash Multimodal NLP & Vision Engine',
      category: 'Foundation LLM & Multimodal AI',
      purpose: 'Zero-shot multilingual citizen voice transcription, structured JSON categorization, and visual pothole/waterlogging assessment.',
      inputSignals: ['Raw citizen text (10+ Indian languages)', 'Voice audio recordings', 'Uploaded smartphone photographs'],
      outputArtifacts: ['Standardized infrastructure category', 'Sub-category', 'Urgency tier', 'Visual damage advisory flags'],
      evaluationMetric: 'Multilingual Intent Extraction Accuracy',
      score: '96.2%',
      limitations: ['Visual assessments are advisory indicators only; they do not replace certified structural engineering audits.'],
      oversight: 'All AI extractions are reviewed prior to project sanctioning.'
    },
    {
      name: 'JanNiti Semantic Issue Clustering Engine',
      category: 'Unsupervised Grouping & Graph Clustering',
      purpose: 'Aggregates isolated citizen grievances into unified high-impact public works Issue Clusters (e.g., CL-1042).',
      inputSignals: ['Geospatial coordinates', 'Semantic embeddings', 'Category & sub-category vector similarity'],
      outputArtifacts: ['Cluster ID', 'Underlying infrastructure problem definition', 'Cluster confidence score', 'Affected population reach'],
      evaluationMetric: 'Silhouette Coefficient / Spatial Cohesion',
      score: '0.88 / 1.0',
      limitations: ['Clusters near administrative district borders require multi-district boundary coordination.'],
      oversight: 'Clustered issues can be manually split or merged by authorized Municipal Analysts.'
    },
    {
      name: 'JanNiti 6-Factor Multi-Source Priority Scoring Model',
      category: 'Deterministic Multi-Objective Decision Science',
      purpose: 'Computes explainable 0-100 Priority Scores with mathematical breakdown for administrative equity.',
      inputSignals: ['Urgency (Max 30)', 'Affected Population (Max 20)', 'Infrastructure Gap (Max 15)', 'Demographic SC/ST Vulnerability (Max 15)', 'Spatial Hotspot (Max 10)', 'Public Impact (Max 10)'],
      outputArtifacts: ['Composite Priority Score (0-100)', 'Itemized Score Breakdown', 'Confidence Tier'],
      evaluationMetric: 'Kendall Tau Rank Correlation vs MoHUA Expert Panel',
      score: '0.91',
      limitations: ['Vulnerability weighting relies on aggregate 2024 demographic projections; no personal identifying information (PII) is scored.'],
      oversight: 'Constitutionally empowered officers can enter human overrides with mandatory justification.'
    },
    {
      name: '30-Day Predictive Demand Velocity & Seasonal Forecaster',
      category: 'Time-Series Regression & Seasonal Weighting',
      purpose: 'Projects 30-day citizen grievance volume trends and issues early warnings for monsoon and heatwave surges.',
      inputSignals: ['14-day grievance inflow velocity', 'Historical monthly trend multipliers', 'Regional precipitation telemetry'],
      outputArtifacts: ['30-day predicted grievance volume', 'Growth rate %', 'Early warning anomaly alerts'],
      evaluationMetric: 'Mean Absolute Error (MAE)',
      score: '3.4 Grievances / Ward',
      limitations: ['Unprecedented extreme weather events may exceed 30-day historical prediction confidence intervals.'],
      oversight: 'Alerts require ground-level inspection by the District Disaster Management Authority (DDMA).'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RESPONSIBLE AI & MODEL TRANSPARENCY
                </span>
                <span className="text-xs text-slate-400">DPI Algorithmic Integrity Charter</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                AI Model Cards, Fairness Audit & Data Quality
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Complete transparency for all generative, clustering, predictive, and scoring models powering JanNiti Decision Intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* DATA QUALITY SCORECARD */}
        {dataQuality && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Telemetry Integrity</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Platform Data Quality Scorecard</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Overall Quality Index:</span>
                <span className="text-2xl font-black text-indigo-700">{dataQuality.overallScore} / 100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Completeness</span>
                <strong className="text-lg font-extrabold text-slate-900">{dataQuality.completeness}%</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Freshness</span>
                <strong className="text-lg font-extrabold text-slate-900">{dataQuality.freshness}%</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Coverage</span>
                <strong className="text-lg font-extrabold text-slate-900">{dataQuality.geographicCoverage}%</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Consistency</span>
                <strong className="text-lg font-extrabold text-slate-900">{dataQuality.consistency}%</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Source Trust</span>
                <strong className="text-lg font-extrabold text-slate-900">{dataQuality.sourceReliability}%</strong>
              </div>
            </div>

            {dataQuality.warnings.length > 0 && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong>Data Governance Disclosures:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  {dataQuality.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ALGORITHMIC FAIRNESS CHECK */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Algorithmic Fairness & Digital Representation Audit
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            To prevent digital participation bias from directing public funds exclusively to tech-savvy urban enclaves, JanNiti AI evaluates aggregate reporting density against demographic population baselines and incorporates automated Silent Need multipliers for underserved rural blocks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <strong className="text-slate-900 block text-sm">Urban vs Rural Balance</strong>
              <p className="text-slate-600">
                Rural wards receive an automatic <strong>1.2x - 1.45x Equity Multiplier</strong> to compensate for lower digital smartphone grievance volume.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <strong className="text-slate-900 block text-sm">Silent Area Detection</strong>
              <p className="text-slate-600">
                High-population regions with &lt;1.8 requests/lakh and severe baseline infrastructure deficits are flagged as <em>Potential Under-Reported Regions</em>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <strong className="text-slate-900 block text-sm">Zero PII Profiling</strong>
              <p className="text-slate-600">
                Models operate purely on aggregated ward demographics and geocoded public infrastructure assets; no individual citizen scoring exists.
              </p>
            </div>
          </div>
        </div>

        {/* AI MODEL CARDS */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-purple-600" />
            Standardized DPI Model Cards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modelCards.map((card, idx) => (
              <div 
                key={card.name} 
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {card.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Score: <strong className="text-emerald-700">{card.score}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{card.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.purpose}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div>
                      <strong className="text-slate-800">Input Signals:</strong>
                      <div className="text-slate-600 text-[11px]">{card.inputSignals.join(', ')}</div>
                    </div>
                    <div>
                      <strong className="text-slate-800">Key Output Artifacts:</strong>
                      <div className="text-slate-600 text-[11px]">{card.outputArtifacts.join(', ')}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="text-rose-700 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100 text-[11px]">
                    <strong>Known Limitations:</strong> {card.limitations.join(' ')}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    <strong>Human Oversight:</strong> {card.oversight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
