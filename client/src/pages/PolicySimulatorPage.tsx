import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Coins, 
  Compass, 
  HelpCircle, 
  Info, 
  Layers, 
  Play, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Users,
  Zap
} from 'lucide-react';
import { apiService } from '../services/api';
import { BudgetAllocationResult, IssueCluster, PolicySimulationResult, SimulationOption } from '../types';

interface PolicySimulatorProps {
  initialClusterId?: string;
  onSelectOptionForBrief?: (clusterId: string, optionId: string) => void;
}

export const PolicySimulatorPage: React.FC<PolicySimulatorProps> = ({
  initialClusterId,
  onSelectOptionForBrief
}) => {
  const [clusters, setClusters] = useState<IssueCluster[]>([]);
  const [selectedClusterId, setSelectedClusterId] = useState<string>(initialClusterId || '');
  const [simulation, setSimulation] = useState<PolicySimulationResult | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('OPT-C');

  // Budget Optimizer State
  const [budgetCrores, setBudgetCrores] = useState<number>(10);
  const [weights, setWeights] = useState({
    population: 25,
    urgency: 25,
    equity: 20,
    gap: 15,
    costEfficiency: 15
  });
  const [portfolioResult, setPortfolioResult] = useState<BudgetAllocationResult | null>(null);
  const [loadingSim, setLoadingSim] = useState<boolean>(false);
  const [loadingBudget, setLoadingBudget] = useState<boolean>(false);

  useEffect(() => {
    loadClusters();
  }, []);

  useEffect(() => {
    if (selectedClusterId) {
      runSimulation(selectedClusterId);
    }
  }, [selectedClusterId]);

  const loadClusters = async () => {
    try {
      const list = await apiService.getClusters();
      setClusters(list);
      if (list.length > 0) {
        const targetId = initialClusterId && list.some(c => c.id === initialClusterId) ? initialClusterId : list[0].id;
        setSelectedClusterId(targetId);
      }
      runBudgetOptimization(10, weights);
    } catch (err) {
      console.error('Error loading clusters:', err);
    }
  };

  const runSimulation = async (clusterId: string) => {
    setLoadingSim(true);
    try {
      const res = await apiService.simulateIntervention(clusterId);
      setSimulation(res);
      if (res && res.aiRecommendedOptionId) {
        setSelectedOptionId(res.aiRecommendedOptionId);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoadingSim(false);
    }
  };

  const runBudgetOptimization = async (budget: number, w: typeof weights) => {
    setLoadingBudget(true);
    try {
      const res = await apiService.optimizeBudget(budget, w);
      setPortfolioResult(res);
    } catch (err) {
      console.error('Budget optimizer error:', err);
    } finally {
      setLoadingBudget(false);
    }
  };

  const selectedCluster = clusters.find(c => c.id === selectedClusterId);
  const activeOption = simulation?.options.find(o => o.optionId === selectedOptionId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  WHAT-IF POLICY INTERVENTION SIMULATOR
                </span>
                <span className="text-xs text-slate-400">Multi-Objective Decision Science Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Simulate Interventions & Optimize Capital Allocation
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Compare single-agency patchwork vs integrated multi-department overhauls before approving state capital outlay.
              </p>
            </div>

            {/* Cluster Selector */}
            <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 pl-1">Target Cluster:</span>
              <select
                value={selectedClusterId}
                onChange={(e) => setSelectedClusterId(e.target.value)}
                className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
              >
                {clusters.map(c => (
                  <option key={c.id} value={c.id}>{c.id}: {c.district} ({c.category})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* SECTION 1: WHAT-IF INTERVENTION COMPARISON */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Intervention Analysis</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {selectedCluster?.title || 'Cluster Simulation'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Baseline Demand: {selectedCluster?.requestCount} reports • Est. Affected Pop: ~{selectedCluster?.affectedPopulation.toLocaleString()} citizens
              </p>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 max-w-md">
              <strong>AI Decision Rationale:</strong> {simulation?.recommendationRationale}
            </div>
          </div>

          {/* Option Cards Comparison */}
          {simulation && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {simulation.options.map(opt => {
                const isSelected = selectedOptionId === opt.optionId;
                const isRecommended = opt.optionId === simulation.aiRecommendedOptionId;

                return (
                  <div
                    key={opt.optionId}
                    onClick={() => setSelectedOptionId(opt.optionId)}
                    className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          opt.optionId === 'OPT-C' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                        }`}>
                          {opt.optionId}
                        </span>
                        {isRecommended && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ★ AI Recommended
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-slate-900">{opt.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{opt.scope}</p>

                      {/* Projected Metrics */}
                      <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Demand Reduction</span>
                          <strong className="text-emerald-600 text-sm font-extrabold">-{opt.estimatedDemandReductionPercent}%</strong>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Gap Resolution</span>
                          <strong className="text-sky-600 text-sm font-extrabold">-{opt.estimatedGapReductionPercent}%</strong>
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="text-xs space-y-1 pt-1">
                        <div className="text-slate-800 font-semibold text-[11px]">Key Advantages:</div>
                        <ul className="text-slate-600 space-y-0.5 text-[11px] list-disc pl-3.5">
                          {opt.pros.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>

                      <div className="text-xs space-y-1 pt-1">
                        <div className="text-slate-800 font-semibold text-[11px]">Trade-Offs:</div>
                        <ul className="text-rose-600 space-y-0.5 text-[11px] list-disc pl-3.5">
                          {opt.tradeOffs.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Est. Cost</span>
                        <strong className="text-slate-900 font-bold">₹{opt.estimatedCostCrores} Cr</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Complexity</span>
                        <strong className="text-slate-700 font-semibold">{opt.implementationComplexity}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 2: BUDGET & PORTFOLIO OPTIMIZATION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Multi-Objective Knapsack Engine</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Capital Budget Portfolio Optimizer
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Allocate ₹X Crores to automatically identify the highest public-return portfolio of civic works.
              </p>
            </div>

            {/* Budget Input */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Available Budget:</span>
              <div className="flex items-center gap-1 font-extrabold text-sm text-slate-900">
                <span>₹</span>
                <input
                  type="number"
                  min={2}
                  max={100}
                  value={budgetCrores}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBudgetCrores(val);
                    runBudgetOptimization(val, weights);
                  }}
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center focus:outline-none"
                />
                <span>Crore</span>
              </div>
            </div>
          </div>

          {/* Weight Adjusters */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Strategic Weighting Preferences</span>
              <span className="text-xs text-slate-400">Dynamic Multi-Criteria Utility</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Pop. Reach</span>
                  <span>{weights.population}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={weights.population}
                  onChange={(e) => {
                    const w = { ...weights, population: Number(e.target.value) };
                    setWeights(w);
                    runBudgetOptimization(budgetCrores, w);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Urgency</span>
                  <span>{weights.urgency}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={weights.urgency}
                  onChange={(e) => {
                    const w = { ...weights, urgency: Number(e.target.value) };
                    setWeights(w);
                    runBudgetOptimization(budgetCrores, w);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Equity Multiplier</span>
                  <span>{weights.equity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={weights.equity}
                  onChange={(e) => {
                    const w = { ...weights, equity: Number(e.target.value) };
                    setWeights(w);
                    runBudgetOptimization(budgetCrores, w);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Infra Gap</span>
                  <span>{weights.gap}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={weights.gap}
                  onChange={(e) => {
                    const w = { ...weights, gap: Number(e.target.value) };
                    setWeights(w);
                    runBudgetOptimization(budgetCrores, w);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Cost Efficiency</span>
                  <span>{weights.costEfficiency}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={weights.costEfficiency}
                  onChange={(e) => {
                    const w = { ...weights, costEfficiency: Number(e.target.value) };
                    setWeights(w);
                    runBudgetOptimization(budgetCrores, w);
                  }}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Optimized Portfolio Results */}
          {portfolioResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 font-medium">Allocated Amount</span>
                  <div className="text-xl font-extrabold text-emerald-900 mt-0.5">
                    ₹{portfolioResult.allocatedAmountCrores} Cr
                  </div>
                  <span className="text-[10px] text-emerald-700">Remaining: ₹{portfolioResult.remainingAmountCrores} Cr</span>
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <span className="text-[11px] text-indigo-800 font-medium">Selected Projects</span>
                  <div className="text-xl font-extrabold text-indigo-900 mt-0.5">
                    {portfolioResult.projectsCount} Works
                  </div>
                  <span className="text-[10px] text-indigo-700">Optimized for impact/₹</span>
                </div>

                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                  <span className="text-[11px] text-sky-800 font-medium">Net Population Benefited</span>
                  <div className="text-xl font-extrabold text-sky-900 mt-0.5">
                    ~{portfolioResult.netPopulationBenefited.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-sky-700">Verified residents reached</span>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-[11px] text-purple-800 font-medium">Average Portfolio Impact</span>
                  <div className="text-xl font-extrabold text-purple-900 mt-0.5">
                    {portfolioResult.averagePortfolioImpact} / 100
                  </div>
                  <span className="text-[10px] text-purple-700">Weighted return score</span>
                </div>
              </div>

              {/* Selected Projects Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Project Title</th>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Estimated Outlay</th>
                      <th className="py-2.5 px-3">Impact Score</th>
                      <th className="py-2.5 px-3">Beneficiaries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {portfolioResult.portfolioProjects.map(proj => (
                      <tr key={proj.id} className={proj.selected ? 'bg-emerald-50/30' : 'bg-slate-50/50 opacity-60'}>
                        <td className="py-2.5 px-3">
                          {proj.selected ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 w-fit">
                              <Check className="w-3 h-3" /> Funded
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600 w-fit">
                              Deferred
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{proj.title}</td>
                        <td className="py-2.5 px-3">{proj.district}, {proj.state}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">₹{proj.estimatedCostCrores} Cr</td>
                        <td className="py-2.5 px-3 font-bold text-indigo-600">{proj.expectedImpactScore}/100</td>
                        <td className="py-2.5 px-3">~{proj.populationBenefited.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
