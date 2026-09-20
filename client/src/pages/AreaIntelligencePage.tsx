import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  ChevronRight, 
  Columns, 
  Compass, 
  Info, 
  Layers, 
  MapPin, 
  RefreshCw, 
  TrendingUp, 
  Users,
  Activity,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { apiService } from '../services/api';
import { DemandForecast, EquityMetric, EvidenceFusionReport, InfrastructureGapReport, IssueCluster, SeasonalDemandRisk } from '../types';

interface AreaIntelligenceProps {
  initialDistrict?: string;
  onNavigateToSimulator?: (clusterId: string) => void;
}

export const AreaIntelligencePage: React.FC<AreaIntelligenceProps> = ({
  initialDistrict = 'Lucknow',
  onNavigateToSimulator
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [comparisonDistrict, setComparisonDistrict] = useState<string>('Kanpur Nagar');
  const [compareMode, setCompareMode] = useState<boolean>(false);

  const [gapReports, setGapReports] = useState<InfrastructureGapReport[]>([]);
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [equityMetrics, setEquityMetrics] = useState<EquityMetric[]>([]);
  const [seasonalRisks, setSeasonalRisks] = useState<SeasonalDemandRisk[]>([]);
  const [clusters, setClusters] = useState<IssueCluster[]>([]);
  const [evidenceReport, setEvidenceReport] = useState<EvidenceFusionReport | null>(null);

  const [selectedFactorIndex, setSelectedFactorIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAreaIntelligence();
  }, []);

  useEffect(() => {
    updateEvidenceForDistrict(selectedDistrict);
  }, [selectedDistrict, clusters]);

  const loadAreaIntelligence = async () => {
    setLoading(true);
    try {
      const [gaps, fcasts, equities, seasons, clusterList] = await Promise.all([
        apiService.getInfrastructureGaps(),
        apiService.getForecasts(),
        apiService.getEquityMetrics(),
        apiService.getSeasonalRisks(),
        apiService.getClusters()
      ]);
      setGapReports(gaps);
      setForecasts(fcasts);
      setEquityMetrics(equities);
      setSeasonalRisks(seasons);
      setClusters(clusterList);
    } catch (err) {
      console.error('Error loading area intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateEvidenceForDistrict = async (districtName: string) => {
    const matchingCluster = clusters.find(c => c.district.toLowerCase() === districtName.toLowerCase()) || clusters[0];
    if (matchingCluster) {
      try {
        const ev = await apiService.getEvidenceFusion(matchingCluster.id);
        setEvidenceReport(ev);
      } catch (e) {
        console.warn('Could not load evidence report:', e);
      }
    }
  };

  const currentReport = gapReports.find(g => g.district.toLowerCase() === selectedDistrict.toLowerCase()) || gapReports[0];
  const compareReport = gapReports.find(g => g.district.toLowerCase() === comparisonDistrict.toLowerCase()) || gapReports[1];
  const currentEquity = equityMetrics.find(e => e.district.toLowerCase() === selectedDistrict.toLowerCase());
  const compareEquity = equityMetrics.find(e => e.district.toLowerCase() === comparisonDistrict.toLowerCase());
  const currentForecast = forecasts.find(f => f.district.toLowerCase() === selectedDistrict.toLowerCase()) || forecasts[0];

  const availableDistricts = gapReports.map(g => g.district);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  360° AREA INTELLIGENCE PROFILE
                </span>
                <span className="text-xs text-slate-400">Multi-source Census & Telemetry Fusion</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Area Profile & Infrastructure Health Diagnostics
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Deep-dive diagnostic profile covering 10 vital infrastructure categories, seasonal forecasts, and silent area bias detection.
              </p>
            </div>

            {/* District Selector & Compare Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 pl-2">Select District:</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                  compareMode
                    ? 'bg-sky-600 border-sky-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                {compareMode ? 'Exit Comparison' : 'Compare Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Comparison Bar (if Compare Mode active) */}
        {compareMode && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Columns className="w-5 h-5 text-sky-700" />
              <div>
                <strong className="text-sm text-sky-950">District Side-by-Side Comparison Mode Active</strong>
                <p className="text-xs text-sky-800">Compare infrastructure health and demographic demand disparity.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-sky-900 font-medium">Compare with:</span>
              <select
                value={comparisonDistrict}
                onChange={(e) => setComparisonDistrict(e.target.value)}
                className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg border border-sky-300 focus:outline-none"
              >
                {availableDistricts.filter(d => d.toLowerCase() !== selectedDistrict.toLowerCase()).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* COMPARISON CARDS / HEALTH SCORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Selected District Diagnostic Card */}
          {currentReport && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Primary Diagnostic Profile</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{currentReport.district}</h2>
                  <span className="text-xs text-slate-500">{currentReport.state} • Pop: ~{currentReport.population.toLocaleString()}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Health Index</span>
                  <div className="text-3xl font-extrabold text-slate-900">{currentReport.overallHealthScore} <span className="text-xs text-slate-400">/ 100</span></div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentReport.status === 'Critical Gap' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {currentReport.status}
                  </span>
                </div>
              </div>

              {/* High level indicators */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Citizen Inflow</span>
                  <strong className="text-sm text-slate-900 font-bold">{currentReport.activeRequests}</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Infra Gap Score</span>
                  <strong className="text-sm text-rose-600 font-bold">{currentReport.overallGapScore}/100</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-medium">DPI Participation</span>
                  <strong className="text-sm text-indigo-600 font-bold">{currentEquity?.digitalParticipationIndex || 72}/100</strong>
                </div>
              </div>
            </div>
          )}

          {/* Comparison District Diagnostic Card (or Silent Area Spotlight) */}
          {compareMode && compareReport ? (
            <div className="bg-sky-50/40 rounded-2xl border border-sky-200 p-6 shadow-sm space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Comparison Target</span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{compareReport.district}</h2>
                  <span className="text-xs text-slate-500">{compareReport.state} • Pop: ~{compareReport.population.toLocaleString()}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Health Index</span>
                  <div className="text-3xl font-extrabold text-slate-900">{compareReport.overallHealthScore} <span className="text-xs text-slate-400">/ 100</span></div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    compareReport.status === 'Critical Gap' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {compareReport.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 bg-white rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Citizen Inflow</span>
                  <strong className="text-sm text-slate-900 font-bold">{compareReport.activeRequests}</strong>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 block font-medium">Infra Gap Score</span>
                  <strong className="text-sm text-rose-600 font-bold">{compareReport.overallGapScore}/100</strong>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 block font-medium">DPI Participation</span>
                  <strong className="text-sm text-indigo-600 font-bold">{compareEquity?.digitalParticipationIndex || 68}/100</strong>
                </div>
              </div>
            </div>
          ) : (
            /* Silent Area & Under-reporting Spotlight */
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  Equity & Silent Need Intelligence
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {currentEquity?.isSilentNeedArea ? '⚠️ Potential Under-Reported Region' : 'Balanced Digital Coverage'}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {currentEquity?.equityExplanation || 'Digital participation matches expected demographic baseline for urban centers.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Equity Priority Multiplier:</span>
                <strong className="text-amber-400 text-sm">{currentEquity?.equityImpactMultiplier || 1.0}x Boost</strong>
              </div>
            </div>
          )}
        </div>

        {/* WHY THIS AREA? CLICKABLE EVIDENCE PANEL */}
        {evidenceReport && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Explainable AI Evidence</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Why is this Area Prioritized?</h2>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Composite Confidence: {evidenceReport.confidenceScore}% ({evidenceReport.confidenceTier})
              </span>
            </div>

            {/* Evidence Fusion Horizontal Bar Chart */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Citizen Demand Intensity</span>
                  <span>{evidenceReport.citizenDemandWeight}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${evidenceReport.citizenDemandWeight}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Infrastructure Deficit Gap</span>
                  <span>{evidenceReport.infrastructureGapWeight}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full" style={{ width: `${evidenceReport.infrastructureGapWeight}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Demographic Population Reach</span>
                  <span>{evidenceReport.populationImpactWeight}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: `${evidenceReport.populationImpactWeight}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Demand Growth Velocity</span>
                  <span>{evidenceReport.demandGrowthWeight}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${evidenceReport.demandGrowthWeight}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Socio-Economic Vulnerability</span>
                  <span>{evidenceReport.vulnerabilityWeight}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${evidenceReport.vulnerabilityWeight}%` }}></div>
                </div>
              </div>
            </div>

            {/* Clickable Factor Deep-Dive Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {evidenceReport.factors.map((factor, idx) => (
                <div
                  key={factor.dimension}
                  onClick={() => setSelectedFactorIndex(idx)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedFactorIndex === idx
                      ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>{factor.dimension}</span>
                    <span className="text-indigo-600">{factor.score}/100</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{factor.description}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-mono">Source: {factor.sourceDataset}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10-CATEGORY INFRASTRUCTURE GAP MATRIX */}
        {currentReport && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sectoral Assessment</span>
                <h2 className="text-xl font-extrabold text-slate-900">10-Sector Infrastructure Gap Matrix</h2>
              </div>
              <span className="text-xs text-slate-500">Benchmark: MoHUA / CPHEEO Standards</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4">Citizen Demand</th>
                    <th className="py-3 px-4">Facility Status</th>
                    <th className="py-3 px-4">Gap Score</th>
                    <th className="py-3 px-4">Severity Tier</th>
                    <th className="py-3 px-4">Benchmark Comparison</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentReport.categoryGaps.map(g => (
                    <tr key={g.category} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900">{g.category}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          g.demandLevel === 'Critical' ? 'bg-rose-100 text-rose-700' : (g.demandLevel === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700')
                        }`}>
                          {g.demandLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{g.availableFacilities}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{g.gapScore} / 100</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          g.gapSeverity === 'Critical Gap' ? 'bg-rose-600 text-white' : (g.gapSeverity === 'High Gap' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700')
                        }`}>
                          {g.gapSeverity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{g.benchmarkComparison}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
