import React, { useEffect, useState } from 'react';
import { Database, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, FileText, Globe } from 'lucide-react';
import { apiService } from '../services/api';
import { DatasetTransparencyItem } from '../types';

export const DataSourcesPage: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetTransparencyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    apiService.getDatasets().then((data) => {
      setDatasets(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fade-in text-left">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold shadow-sm">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>OPEN GOVERNMENT DATA &amp; REGISTRY INTEGRITY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-white">
          Data Sources &amp; Benchmark Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          JanNiti AI adheres to strict Digital Public Good principles. We transparently declare all live pipelines, open government benchmarks, and simulated demonstration datasets to maintain complete governance integrity.
        </p>
      </div>

      {/* Trust & Classification Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            BENCHMARK / OPEN GOV
          </span>
          <h4 className="text-sm font-bold text-white mt-1">Open Government Benchmarks</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Official baseline indicators published on data.gov.in, Census India, and ministry open registries for cross-validation.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            LIVE CONNECTED
          </span>
          <h4 className="text-sm font-bold text-white mt-1">Real-time Telemetry</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct citizen submissions ingested via the multilingual portal and processed through Google Gemini AI intelligence.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            DEMO DATASET
          </span>
          <h4 className="text-sm font-bold text-white mt-1">Representative Sample Cohorts</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Synthetic datasets structured on real Indian administrative geography for demonstration and deterministic testing.
          </p>
        </div>
      </div>

      {/* Declared Dataset Inventory */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 voice-signal-node" />
            <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
              Declared Dataset Inventory
            </h3>
          </div>
          <span className="text-xs text-cyan-300 font-mono font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
            {datasets.length} Registered Sources
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5">Dataset Name</th>
                <th className="py-4 px-5">Origin / Ministry Source</th>
                <th className="py-4 px-5">Analytical Purpose</th>
                <th className="py-4 px-5">Coverage</th>
                <th className="py-4 px-5">Classification</th>
                <th className="py-4 px-5">Cadence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {datasets.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/50 transition">
                  <td className="py-4 px-5 font-bold text-white">
                    {d.name}
                  </td>
                  <td className="py-4 px-5 text-cyan-300 font-medium">
                    {d.source}
                  </td>
                  <td className="py-4 px-5 text-slate-300 max-w-xs">
                    {d.purpose}
                  </td>
                  <td className="py-4 px-5 font-semibold text-white">
                    {d.coverage}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      (d.dataType || d.status || '').includes('Live')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : (d.dataType || d.status || '').includes('Benchmark')
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {d.dataType || d.status || 'Verified Public Data'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-mono">
                    {d.updateFrequency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
