import React, { useState, useEffect } from 'react';
import { 
  Filter, Download, Bot, RefreshCw, Search, 
  MapPin, Flame, Layers, Sparkles, Building2, 
  ChevronRight, SlidersHorizontal, FileText, CheckCircle2 
} from 'lucide-react';
import { PolicyCopilotModal } from '../components/copilot/PolicyCopilotModal';
import { ChartsSection } from '../components/dashboard/ChartsSection';
import { KPICards } from '../components/dashboard/KPICards';
import { PredictiveGapsSection } from '../components/dashboard/PredictiveGapsSection';
import { RecommendationsList } from '../components/dashboard/RecommendationsList';
import { RequestDetailsModal } from '../components/dashboard/RequestDetailsModal';
import { GeospatialMap } from '../components/map/GeospatialMap';
import { apiService } from '../services/api';
import { CitizenRequest, Hotspot, MLDemandPrediction, PlatformStats, ProjectRecommendation, SupportedLanguage } from '../types';
import { StoryAwareThoughtBar } from '../components/ProjectStory/StoryAwareThoughtBar';

interface PolicymakerDashboardProps {
  onOpenVideoStory?: () => void;
  currentLanguage?: SupportedLanguage;
}

export const PolicymakerDashboard: React.FC<PolicymakerDashboardProps> = ({
  onOpenVideoStory,
  currentLanguage = 'hi'
}) => {
  // Data States
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [recommendations, setRecommendations] = useState<ProjectRecommendation[]>([]);
  const [predictions, setPredictions] = useState<MLDemandPrediction[]>([]);
  const [requests, setRequests] = useState<CitizenRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter States
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Item Modals
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CitizenRequest | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Active Tab within Policymaker View
  const [activeTab, setActiveTab] = useState<'heatmap' | 'projects' | 'predictions' | 'requests'>('heatmap');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, hotspotsData, recsData, predsData, reqsData] = await Promise.all([
        apiService.getStatistics(selectedState, selectedDistrict),
        apiService.getHotspots(selectedState, selectedDistrict),
        apiService.getRecommendations(),
        apiService.getPredictions(),
        apiService.getRequests({
          state: selectedState,
          district: selectedDistrict,
          category: selectedCategory,
          urgency: selectedUrgency,
          search: searchQuery,
          limit: 150
        })
      ]);

      setStats(statsData);
      setHotspots(hotspotsData);
      setRecommendations(recsData);
      setPredictions(predsData);
      setRequests(reqsData.requests);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedState, selectedDistrict, selectedCategory, selectedUrgency]);

  const handleExportCSV = () => {
    if (requests.length === 0) return;

    const headers = ['RequestID', 'Date', 'State', 'District', 'Category', 'SubCategory', 'Urgency', 'PriorityScore', 'AffectedPopEst', 'Status', 'CitizenText'];
    const rows = requests.map(r => [
      r.requestId,
      r.createdAt,
      `"${r.location.state}"`,
      `"${r.location.district}"`,
      `"${r.category}"`,
      `"${r.subCategory}"`,
      r.urgency,
      r.priorityScore,
      r.affectedPopulationEstimate,
      r.status,
      `"${r.text.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JanNiti_Citizen_Requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedCategory('All');
    setSelectedUrgency('All');
    setSearchQuery('');
    setSelectedHotspot(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fade-in text-left">
      {/* 1. STORY THOUGHT & VOICE OF THE DAY BANNER */}
      {onOpenVideoStory && (
        <div className="-mt-2 -mb-2">
          <StoryAwareThoughtBar
            onOpenStory={onOpenVideoStory}
            currentLanguage={currentLanguage}
          />
        </div>
      )}

      {/* Header & Copilot CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
              Policymaker Decision Dashboard
            </h1>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-gov-100 text-gov-800 border border-gov-200">
              Government-Grade DPI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Real-time geospatial hotspot intelligence, transparent demand scoring, and AI project dossiers for evidence-based infrastructure sanctions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-gov-700 to-indigo-800 hover:from-gov-800 hover:to-indigo-900 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>AI Policy Copilot</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20">Ask</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-gov-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition shadow-sm disabled:opacity-50"
            title="Refresh live data"
          >
            <RefreshCw className={`w-4 h-4 text-gov-700 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <KPICards
        stats={stats}
        selectedState={selectedState !== 'All' ? selectedState : undefined}
        selectedDistrict={selectedDistrict !== 'All' ? selectedDistrict : undefined}
      />

      {/* Filter Control Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gov-600" />
            Filters:
          </span>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('All');
            }}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-gov-400"
          >
            <option value="All">All States</option>
            {stats?.stateDistribution.map(s => (
              <option key={s.state} value={s.state}>{s.state} ({s.count})</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-gov-400"
          >
            <option value="All">All Categories</option>
            {stats?.categoryDistribution.map(c => (
              <option key={c.category} value={c.category}>{c.category}</option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-gov-400"
          >
            <option value="All">All Urgencies</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High &amp; Critical</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(selectedState !== 'All' || selectedCategory !== 'All' || selectedUrgency !== 'All' || selectedHotspot) && (
            <button
              onClick={handleResetFilters}
              className="text-gov-700 font-extrabold hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchDashboardData()}
            placeholder="Search keywords, district, ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-gov-400 font-medium"
          />
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'heatmap'
              ? 'border-gov-700 text-gov-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-gov-600" />
          <span>Geospatial Hotspots &amp; Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'projects'
              ? 'border-gov-700 text-gov-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>AI Project Proposals ({recommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('predictions')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'predictions'
              ? 'border-gov-700 text-gov-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-600" />
          <span>Predictive Gap Risk Model</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'border-gov-700 text-gov-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-gov-600" />
          <span>Citizen Demand Audit Trail ({requests.length})</span>
        </button>
      </div>

      {/* Tab 1: Geospatial Hotspots & Visual Analytics */}
      {activeTab === 'heatmap' && (
        <div className="space-y-8">
          {/* Map + Side Hotspot Inspector Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <GeospatialMap
                hotspots={hotspots}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={(h) => setSelectedHotspot(h)}
                filteredRequests={requests}
              />
            </div>

            {/* Side Hotspot Inspector Card */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-slate-900 text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-red-600 animate-bounce" />
                  <span>District Hotspot Inspector</span>
                </div>
                {selectedHotspot && (
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Clear Focus
                  </button>
                )}
              </div>

              {selectedHotspot ? (
                <div className="space-y-3.5 text-xs animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-slate-900 text-lg">
                      {selectedHotspot.district}
                    </h3>
                    <span className="font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                      {selectedHotspot.state}
                    </span>
                  </div>

                  <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-900">Hotspot Demand Score</span>
                      <span className="font-black text-red-700 text-lg">
                        {selectedHotspot.hotspotScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-red-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full"
                        style={{ width: `${selectedHotspot.hotspotScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">Submissions</span>
                      <span className="font-extrabold text-slate-900 mt-0.5 block">{selectedHotspot.requestCount} Demands</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">Beneficiaries</span>
                      <span className="font-extrabold text-slate-900 mt-0.5 block">~{selectedHotspot.affectedPopulation.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                    <strong className="text-amber-900 font-bold block">AI Suggested Intervention:</strong>
                    <p className="text-slate-800 font-medium">
                      {selectedHotspot.recommendedIntervention}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('projects')}
                    className="w-full py-2.5 bg-gov-700 hover:bg-gov-800 text-white rounded-xl font-bold text-xs transition shadow-sm"
                  >
                    View Project Proposal in Recommendations
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 space-y-2.5">
                  <Flame className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs leading-relaxed font-medium">
                    Click any colored hotspot circle on the map to inspect district metrics, citizen quotes, and recommended interventions.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Analytical Charts */}
          <ChartsSection stats={stats} />
        </div>
      )}

      {/* Tab 2: AI Project Proposals */}
      {activeTab === 'projects' && (
        <RecommendationsList
          recommendations={recommendations}
        />
      )}

      {/* Tab 3: Predictive ML Risk Model */}
      {activeTab === 'predictions' && (
        <PredictiveGapsSection
          predictions={predictions}
        />
      )}

      {/* Tab 4: Citizen Demand Audit Trail List */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Underlying Citizen Submissions Register
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Displaying {requests.length} of {stats?.totalRequests || 0} demands
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Request ID</th>
                    <th className="py-3.5 px-4">Geography</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Urgency</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Summary</th>
                    <th className="py-3.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-gov-700">
                        {req.requestId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{req.location.district}</span>
                        <span className="text-[10px] text-slate-400 block">{req.location.state}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {req.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          req.urgency === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                          req.urgency === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {req.priorityScore}/100
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                        {req.problemSummary || req.text}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                          }}
                          className="px-3 py-1 rounded-lg bg-gov-50 hover:bg-gov-100 text-gov-700 font-bold text-[11px] transition border border-gov-200"
                        >
                          Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      {/* AI Policy Copilot Modal */}
      <PolicyCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        selectedState={selectedState !== 'All' ? selectedState : undefined}
        selectedDistrict={selectedDistrict !== 'All' ? selectedDistrict : undefined}
      />
    </div>
  );
};
