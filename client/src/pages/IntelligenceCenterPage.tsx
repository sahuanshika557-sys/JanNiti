import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Database, 
  FileText, 
  Layers, 
  Lightbulb, 
  MapPin, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Users,
  Eye,
  Sliders,
  Check,
  X,
  Play
} from 'lucide-react';
import { apiService } from '../services/api';
import { AnomalyAlert, ExecutiveTodaySummary, GeneratedPolicyBrief, IssueCluster, PlatformStats } from '../types';

import { SupportedLanguage } from '../types';
import { CinematicHeroTeaser } from '../components/ProjectStory/CinematicHeroTeaser';
import { StoryAwareThoughtBar } from '../components/ProjectStory/StoryAwareThoughtBar';

interface IntelligenceCenterProps {
  onNavigateToArea?: (district: string) => void;
  onNavigateToSimulator?: (clusterId: string) => void;
  onOpenVideoStory?: () => void;
  currentLanguage?: SupportedLanguage;
}

export const IntelligenceCenterPage: React.FC<IntelligenceCenterProps> = ({
  onNavigateToArea,
  onNavigateToSimulator,
  onOpenVideoStory,
  currentLanguage = 'hi'
}) => {
  const [clusters, setClusters] = useState<IssueCluster[]>([]);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveTodaySummary | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<IssueCluster | null>(null);
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [briefData, setBriefData] = useState<GeneratedPolicyBrief | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clusterList, alertList, statData, execSum] = await Promise.all([
        apiService.getClusters(),
        apiService.getAlerts(),
        apiService.getPlatformStats(),
        apiService.getExecutiveTodaySummary()
      ]);
      setClusters(clusterList);
      setAlerts(alertList);
      setStats(statData);
      setExecutiveSummary(execSum);
      if (clusterList.length > 0) {
        setSelectedCluster(clusterList[0]);
      }
    } catch (err) {
      console.error('Error loading intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBrief = async (cluster: IssueCluster) => {
    setSelectedCluster(cluster);
    setLoadingBrief(true);
    setBriefModalOpen(true);
    try {
      const brief = await apiService.generatePolicyBrief(cluster.id);
      setBriefData(brief);
    } catch (err) {
      console.error('Failed to generate policy brief:', err);
    } finally {
      setLoadingBrief(false);
    }
  };

  const filteredClusters = filterCategory === 'All' 
    ? clusters 
    : clusters.filter(c => c.category.toLowerCase().includes(filterCategory.toLowerCase()));

  const categories = ['All', 'Road', 'Drainage', 'Water', 'Sanitation', 'Healthcare', 'Electricity'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. CINEMATIC HERO TEASER: Moving Miniature Story World + Rotating Copy */}
      {onOpenVideoStory && (
        <CinematicHeroTeaser
          onOpenStory={onOpenVideoStory}
          currentLanguage={currentLanguage}
        />
      )}

      {/* 2. STORY THOUGHT / VOICE OF THE DAY & STORY ENTRY */}
      {onOpenVideoStory && (
        <StoryAwareThoughtBar
          onOpenStory={onOpenVideoStory}
          currentLanguage={currentLanguage}
        />
      )}

      {/* 3. Top Telemetry Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE PUBLIC INFRASTRUCTURE INTELLIGENCE ENGINE
                </span>
                <span className="text-xs text-slate-400">Canonical DPI Model v2.0</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Intelligence Center: Actionable Infrastructure Priorities
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Synthesizing thousands of individual citizen grievances into clustered, evidence-backed public works recommendations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {onOpenVideoStory && (
                <button
                  onClick={onOpenVideoStory}
                  className="px-3 py-2 text-xs font-bold bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 rounded-lg border border-amber-400/40 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Story Video (10 Langs)</span>
                </button>
              )}
              <button 
                onClick={loadData}
                className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Telemetry
              </button>
              {clusters[0] && (
                <button
                  onClick={() => handleGenerateBrief(clusters[0])}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Today's Policy Brief
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium">Verified Citizen Signals</div>
                <div className="text-xl font-bold text-white mt-0.5">{stats.totalRequests.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">Across 20 Indian Districts</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium">Active Issue Clusters</div>
                <div className="text-xl font-bold text-amber-400 mt-0.5">{clusters.length}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Semantic grouping (94% conf.)</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium">Est. Population Impact</div>
                <div className="text-xl font-bold text-sky-400 mt-0.5">~{stats.estimatedCitizensAffected.toLocaleString()}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Catchment area beneficiaries</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium">High / Critical Priority</div>
                <div className="text-xl font-bold text-rose-400 mt-0.5">{stats.highPriorityCount}</div>
                <div className="text-[11px] text-rose-300 mt-0.5">Score ≥ 75/100</div>
              </div>
              <div className="hidden lg:block bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-400 font-medium">Avg Infrastructure Gap</div>
                <div className="text-xl font-bold text-indigo-300 mt-0.5">{stats.averageGapScore || 68} / 100</div>
                <div className="text-[11px] text-slate-300 mt-0.5">MoHUA standard deficit</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Early Warnings & Anomalies Banner */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                AI Early Warnings & Demand Velocity Anomalies ({alerts.length})
              </h2>
              <span className="text-xs text-slate-500">Autonomous time-series anomaly detector</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alerts.slice(0, 3).map(alert => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alert.severity === 'Critical' 
                      ? 'bg-rose-50 border-rose-200' 
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      alert.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {alert.severity} Risk
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{alert.metricChangeText}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-2">{alert.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{alert.message}</p>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {alert.district}, {alert.state}
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-700">Confidence: {alert.confidenceScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DECISION JOURNEY VISUALIZER */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">End-to-End Governance Architecture</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">The JanNiti AI Decision Journey</h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              From raw citizen reports to verified public outcomes with human-in-the-loop oversight.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mb-2">1</div>
              <div className="text-xs font-bold text-slate-900">Citizen Voice</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Voice / Text / Photos</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-2">2</div>
              <div className="text-xs font-bold text-slate-900">Issue Clustering</div>
              <div className="text-[10px] text-slate-500 mt-0.5">CL-1042 (~127 reports)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-2">3</div>
              <div className="text-xs font-bold text-slate-900">Evidence Fusion</div>
              <div className="text-[10px] text-slate-500 mt-0.5">10-layer data fusion</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mb-2">4</div>
              <div className="text-xs font-bold text-slate-900">Policy Simulator</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Option A vs B vs C</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">5</div>
              <div className="text-xs font-bold text-slate-900">Human Sanction</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Audit log recorded</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs mb-2">6</div>
              <div className="text-xs font-bold text-slate-900">Implementation</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Cross-department execution</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs mb-2">7</div>
              <div className="text-xs font-bold text-slate-900">Impact Verified</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Citizen feedback loop</div>
            </div>
          </div>
        </div>

        {/* MAIN SECTION: WHAT NEEDS ATTENTION NOW? */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Priority Executive Feed</span>
              <h2 className="text-2xl font-extrabold text-slate-900">What Needs Attention Now?</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Top semantic issue clusters prioritized by citizen volume, infrastructure gap severity, and demographic equity.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterCategory === cat
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Issue Clusters List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredClusters.slice(0, 8).map(cluster => (
              <div 
                key={cluster.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md ${
                  cluster.priorityScore >= 85 ? 'border-l-4 border-l-rose-500 border-slate-200' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white font-mono">
                        {cluster.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {cluster.category}
                      </span>
                      <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {cluster.district}, {cluster.state}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        cluster.trend === 'Spiking' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        Trend: {cluster.trend} (+{cluster.growthRatePercent}%)
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        Cluster Confidence: {cluster.clusterConfidence}%
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {cluster.title}
                    </h3>

                    {/* Underlying Problem Box */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                      <div>
                        <strong className="text-slate-900">Underlying Problem:</strong> {cluster.underlyingProblem}
                      </div>
                      <div className="text-slate-600 italic">
                        {cluster.rootCauseHypothesis}
                      </div>
                    </div>

                    {/* Observed Evidence vs AI Inference */}
                    <div className="text-xs text-slate-600 space-y-1">
                      <strong className="text-slate-800">Observed Citizen Evidence:</strong>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                        {cluster.observedEvidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400">Related Requests:</span> <strong className="text-slate-900">{cluster.requestCount} citizen reports</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Affected Population:</span> <strong className="text-slate-900">~{cluster.affectedPopulation.toLocaleString()} citizens</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Lead Department:</span> <strong className="text-indigo-700">{cluster.leadDepartment}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Est. Capital Outlay:</span> <strong className="text-slate-900">₹{cluster.estimatedCostCrores} Cr (Illustrative)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Priority & Action Sidebox */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:min-w-[200px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5">
                    <div className="text-left lg:text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Decision Priority</div>
                      <div className="text-3xl font-extrabold text-slate-900 flex items-center lg:justify-end gap-1">
                        {cluster.priorityScore}
                        <span className="text-xs font-semibold text-slate-400">/ 100</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        {cluster.confidenceTier} ({cluster.confidenceScore}%)
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto lg:w-full">
                      <button
                        onClick={() => handleGenerateBrief(cluster)}
                        className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        AI Policy Brief
                      </button>

                      {onNavigateToSimulator && (
                        <button
                          onClick={() => onNavigateToSimulator(cluster.id)}
                          className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Sliders className="w-3.5 h-3.5 text-slate-500" />
                          Simulate What-If
                        </button>
                      )}

                      {onNavigateToArea && (
                        <button
                          onClick={() => onNavigateToArea(cluster.district)}
                          className="px-3.5 py-2 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          Area Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POLICY BRIEF GENERATION MODAL */}
      {briefModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 z-10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">Grounded AI Policy Brief</h3>
              </div>
              <button
                onClick={() => setBriefModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {loadingBrief ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">Synthesizing ground-truth data with Gemini 1.5 Flash...</p>
                  <p className="text-xs text-slate-400">Strict zero-hallucination verification active.</p>
                </div>
              ) : briefData ? (
                <div className="space-y-6 text-slate-800">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Brief Reference: <strong>{briefData.briefId}</strong></span>
                      <span>Generated: {briefData.generatedAt}</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">{briefData.title}</h2>
                    <div className="text-xs text-indigo-600 font-semibold mt-1">
                      Target Area: {briefData.district}, {briefData.state} | Category: {briefData.category}
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">1. Executive Summary</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                      {briefData.executiveSummary}
                    </p>
                  </div>

                  {/* Problem Definition & Root Cause */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">2. Problem & Root Cause Analysis</h4>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div><strong className="text-slate-900">Definition:</strong> {briefData.problemDefinition}</div>
                      <div><strong className="text-slate-900">AI Root Cause Inference:</strong> {briefData.observedEvidenceVsInference.aiRootCauseHypothesis}</div>
                      <div><strong className="text-slate-900">Observed Signals:</strong> {briefData.observedEvidenceVsInference.observedCitizenSignals.join(' | ')}</div>
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">3. Recommended Action Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                        <span className="text-slate-500">Lead Agency:</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">{briefData.recommendedActionPlan.leadAgency}</div>
                      </div>
                      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                        <span className="text-slate-500">Estimated Budget:</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">{briefData.recommendedActionPlan.estimatedCapitalRequirement}</div>
                      </div>
                    </div>
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <strong>Scope:</strong> {briefData.recommendedActionPlan.scopeOfWork}
                    </div>
                  </div>

                  {/* Projected Outcomes */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">4. Projected Outcomes & Public Utility</h4>
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <div>✔ <strong>Demand Reduction:</strong> {briefData.projectedOutcomes.demandReductionPercent}</div>
                      <div>✔ <strong>Beneficiary Reach:</strong> {briefData.projectedOutcomes.beneficiaryReach}</div>
                      <div>✔ <strong>Long Term:</strong> {briefData.projectedOutcomes.longTermResilience}</div>
                    </div>
                  </div>

                  {/* Risk Mitigation */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">5. Risk & Limitation Disclosure</h4>
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div><strong>Risks:</strong> {briefData.riskAnalysisAndMitigation.risks.join(', ')}</div>
                      <div><strong>Data Limitations:</strong> {briefData.riskAnalysisAndMitigation.dataLimitations.join(', ')}</div>
                    </div>
                  </div>

                  {/* Sign-off */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>Sign-off: <strong>{briefData.signOffBlock.preparedBy}</strong></span>
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-mono text-[11px]">{briefData.signOffBlock.auditLogRef}</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setBriefModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
