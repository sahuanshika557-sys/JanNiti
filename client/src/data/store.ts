import { calculateHotspots } from '../analytics/hotspotEngine';
import { getAllDistrictPredictions } from '../analytics/predictiveModel';
import { generateProjectRecommendations } from '../analytics/recommendationEngine';
import { clusterCitizenRequests } from '../intelligence/clusteringEngine';
import { generateEarlyWarnings } from '../intelligence/earlyWarningEngine';
import { calculateEquityAndSilentAreas } from '../intelligence/equityEngine';
import { calculateEvidenceFusion } from '../intelligence/evidenceFusionEngine';
import { generateDemandForecasts, getSeasonalDemandRisks } from '../intelligence/forecastingEngine';
import { governanceEngine } from '../intelligence/governanceEngine';
import { impactVerificationEngine } from '../intelligence/impactVerificationEngine';
import { calculateDistrictInfrastructureGaps } from '../intelligence/infrastructureGapEngine';
import { simulateClusterInterventions } from '../intelligence/policySimulatorEngine';
import { optimizeBudgetPortfolio } from '../intelligence/resourceOptimizerEngine';
import {
  AnomalyAlert,
  AuditLogEntry,
  BudgetAllocationResult,
  CitizenRequest,
  DataQualityReport,
  DatasetTransparencyItem,
  DemandForecast,
  EquityMetric,
  EvidenceFusionReport,
  Hotspot,
  ImpactVerificationRecord,
  InfrastructureGapReport,
  IssueCluster,
  MLDemandPrediction,
  PlatformStats,
  PolicySimulationResult,
  ProjectRecommendation,
  SeasonalDemandRisk
} from '../types';
import { DATASET_TRANSPARENCY_REGISTRY, generateSeedRequests } from './seedData';

class JanNitiDataStore {
  private requests: CitizenRequest[] = [];
  private hotspots: Hotspot[] = [];
  private clusters: IssueCluster[] = [];
  private recommendations: ProjectRecommendation[] = [];
  private predictions: MLDemandPrediction[] = [];
  private gapReports: InfrastructureGapReport[] = [];
  private forecasts: DemandForecast[] = [];
  private seasonalRisks: SeasonalDemandRisk[] = [];
  private equityMetrics: EquityMetric[] = [];
  private earlyWarnings: AnomalyAlert[] = [];
  private datasets: DatasetTransparencyItem[] = DATASET_TRANSPARENCY_REGISTRY;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.isInitialized) return;
    this.requests = generateSeedRequests();
    this.recomputeAnalytics();
    this.isInitialized = true;
    console.log(`JanNiti Decision Intelligence DataStore initialized with ${this.requests.length} citizen requests and ${this.clusters.length} issue clusters.`);
  }

  public recomputeAnalytics() {
    this.hotspots = calculateHotspots(this.requests);
    this.clusters = clusterCitizenRequests(this.requests);
    this.recommendations = generateProjectRecommendations(this.hotspots, this.requests);
    this.predictions = getAllDistrictPredictions(this.requests);
    this.gapReports = calculateDistrictInfrastructureGaps(this.requests);
    this.forecasts = generateDemandForecasts(this.requests);
    this.seasonalRisks = getSeasonalDemandRisks();
    this.equityMetrics = calculateEquityAndSilentAreas(this.requests);
    this.earlyWarnings = generateEarlyWarnings(this.clusters, this.requests);
  }

  // --- 1. Citizen Requests ---
  public getRequests(filters?: {
    state?: string;
    district?: string;
    category?: string;
    urgency?: string;
    language?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): { requests: CitizenRequest[]; total: number } {
    let list = [...this.requests];

    if (filters) {
      if (filters.state && filters.state !== 'All') {
        list = list.filter(r => r.location.state.toLowerCase() === filters.state!.toLowerCase());
      }
      if (filters.district && filters.district !== 'All') {
        list = list.filter(r => r.location.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.category && filters.category !== 'All') {
        list = list.filter(r => r.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.urgency && filters.urgency !== 'All') {
        list = list.filter(r => r.urgency.toLowerCase() === filters.urgency!.toLowerCase());
      }
      if (filters.language && filters.language !== 'All') {
        list = list.filter(r => r.language.toLowerCase() === filters.language!.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(r => 
          r.text.toLowerCase().includes(q) ||
          r.requestId.toLowerCase().includes(q) ||
          r.problemSummary.toLowerCase().includes(q) ||
          r.location.district.toLowerCase().includes(q) ||
          r.location.state.toLowerCase().includes(q)
        );
      }
    }

    const total = list.length;
    list.sort((a, b) => b.priorityScore - a.priorityScore || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const offset = filters?.offset || 0;
    const limit = filters?.limit || 100;
    return {
      requests: list.slice(offset, offset + limit),
      total
    };
  }

  public getRequestById(id: string): CitizenRequest | undefined {
    return this.requests.find(r => r.id === id || r.requestId === id);
  }

  public addRequest(request: CitizenRequest): CitizenRequest {
    this.requests.unshift(request);
    this.recomputeAnalytics();
    return request;
  }

  // --- 2. Issue Clusters ---
  public getClusters(filters?: { state?: string; district?: string; category?: string }): IssueCluster[] {
    let list = [...this.clusters];
    if (filters) {
      if (filters.state && filters.state !== 'All') {
        list = list.filter(c => c.state.toLowerCase() === filters.state!.toLowerCase());
      }
      if (filters.district && filters.district !== 'All') {
        list = list.filter(c => c.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.category && filters.category !== 'All') {
        list = list.filter(c => c.category.toLowerCase() === filters.category!.toLowerCase());
      }
    }
    return list;
  }

  public getClusterById(id: string): IssueCluster | undefined {
    return this.clusters.find(c => c.id === id);
  }

  public getEvidenceFusionForCluster(clusterId: string): EvidenceFusionReport | null {
    const cluster = this.getClusterById(clusterId) || this.clusters[0];
    if (!cluster) return null;
    return calculateEvidenceFusion(cluster);
  }

  // --- 3. Infrastructure Gap Reports ---
  public getInfrastructureGaps(district?: string): InfrastructureGapReport[] {
    if (district && district !== 'All') {
      return this.gapReports.filter(g => g.district.toLowerCase() === district.toLowerCase());
    }
    return this.gapReports;
  }

  public getInfrastructureGapByDistrict(district: string): InfrastructureGapReport | undefined {
    return this.gapReports.find(g => g.district.toLowerCase() === district.toLowerCase());
  }

  // --- 4. Demand Forecasts & Seasonal Risks ---
  public getDemandForecasts(district?: string): DemandForecast[] {
    if (district && district !== 'All') {
      return this.forecasts.filter(f => f.district.toLowerCase() === district.toLowerCase());
    }
    return this.forecasts;
  }

  public getSeasonalRisks(): SeasonalDemandRisk[] {
    return this.seasonalRisks;
  }

  // --- 5. Equity & Silent Areas ---
  public getEquityMetrics(): EquityMetric[] {
    return this.equityMetrics;
  }

  public getSilentAreas(): EquityMetric[] {
    return this.equityMetrics.filter(e => e.isSilentNeedArea || e.underReportedRiskTier !== 'BALANCED PARTICIPATION');
  }

  // --- 6. Policy Simulator & Resource Optimizer ---
  public simulateIntervention(clusterId: string): PolicySimulationResult | null {
    const cluster = this.getClusterById(clusterId) || this.clusters[0];
    if (!cluster) return null;
    return simulateClusterInterventions(cluster);
  }

  public optimizeBudget(totalBudgetCrores: number, customWeights?: any): BudgetAllocationResult {
    return optimizeBudgetPortfolio(this.clusters, totalBudgetCrores, customWeights);
  }

  // --- 7. Governance & Audit Logs ---
  public getAuditLogs(filters?: any): AuditLogEntry[] {
    return governanceEngine.getAuditLogs(filters);
  }

  public recordGovernanceDecision(
    clusterId: string,
    decision: {
      action: 'APPROVE' | 'MODIFY' | 'REJECT' | 'INVESTIGATE';
      actorName: string;
      actorRole: 'Policymaker' | 'Department Officer' | 'Analyst' | 'Administrator';
      assignedPriority?: number;
      assignedDepartment?: string;
      notes: string;
    }
  ) {
    const cluster = this.getClusterById(clusterId);
    if (!cluster) return null;
    return governanceEngine.recordDecision(cluster, decision);
  }

  // --- 8. Impact Verification ---
  public getImpactVerificationRecords(): ImpactVerificationRecord[] {
    return impactVerificationEngine.getVerificationRecords();
  }

  public recordCitizenImpactFeedback(recordId: string, feedbackType: 'improved' | 'partiallyImproved' | 'notImproved') {
    return impactVerificationEngine.recordCitizenFeedback(recordId, feedbackType);
  }

  // --- 9. Early Warning Anomaly Alerts ---
  public getAlerts(): AnomalyAlert[] {
    return this.earlyWarnings.filter(a => !a.isDismissed);
  }

  public dismissAlert(id: string): boolean {
    const a = this.earlyWarnings.find(x => x.id === id);
    if (a) {
      a.isDismissed = true;
      return true;
    }
    return false;
  }

  // --- 10. Data Quality Report ---
  public getDataQualityReport(): DataQualityReport {
    return {
      overallScore: 88,
      completeness: 94,
      freshness: 91,
      geographicCoverage: 89,
      consistency: 86,
      sourceReliability: 92,
      warnings: [
        'Census demographic baseline standard (2024 Projections) is mapped to 2021 municipal boundaries.',
        'Gaya and Muzaffarpur rural clusters exhibit lower digital reporting density (<1.5 / lakh).'
      ],
      canonicalGeographyCount: this.gapReports.length,
      canonicalCategoryCount: 10,
      lastIngestionDate: new Date().toISOString()
    };
  }

  // --- 11. Legacy / Core Integrations ---
  public getHotspots(state?: string, district?: string): Hotspot[] {
    if (state && state !== 'All') {
      return this.hotspots.filter(h => h.state.toLowerCase() === state.toLowerCase());
    }
    if (district && district !== 'All') {
      return this.hotspots.filter(h => h.district.toLowerCase() === district.toLowerCase());
    }
    return this.hotspots;
  }

  public getRecommendations(): ProjectRecommendation[] {
    return this.recommendations;
  }

  public getPredictions(): MLDemandPrediction[] {
    return this.predictions;
  }

  public getDatasets(): DatasetTransparencyItem[] {
    return this.datasets;
  }

  public getStatistics(state?: string, district?: string): PlatformStats {
    let list = this.requests;
    if (state && state !== 'All') {
      list = list.filter(r => r.location.state.toLowerCase() === state.toLowerCase());
    }
    if (district && district !== 'All') {
      list = list.filter(r => r.location.district.toLowerCase() === district.toLowerCase());
    }

    const totalRequests = list.length;
    const highPriorityCount = list.filter(r => r.priorityScore >= 75).length;
    const activeHotspotsCount = this.hotspots.filter(h => !state || state === 'All' || h.state.toLowerCase() === state.toLowerCase()).length;
    const activeClustersCount = this.clusters.filter(c => !state || state === 'All' || c.state.toLowerCase() === state.toLowerCase()).length;

    const totalAffectedRaw = list.reduce((sum, r) => sum + (r.affectedPopulationEstimate || 15000), 0);
    const estimatedCitizensAffected = Math.round(totalAffectedRaw * 0.45);

    const catMap = new Map<string, number>();
    for (const r of list) {
      catMap.set(r.category, (catMap.get(r.category) || 0) + 1);
    }
    const categoryDistribution = Array.from(catMap.entries())
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    const stateMap = new Map<string, number>();
    for (const r of list) {
      stateMap.set(r.location.state, (stateMap.get(r.location.state) || 0) + 1);
    }
    const stateDistribution = Array.from(stateMap.entries())
      .map(([st, count]) => ({ state: st, count }))
      .sort((a, b) => b.count - a.count);

    const priorityDistribution = [
      { range: '90 - 100 (Critical)', count: list.filter(r => r.priorityScore >= 90).length },
      { range: '75 - 89 (High)', count: list.filter(r => r.priorityScore >= 75 && r.priorityScore < 90).length },
      { range: '50 - 74 (Medium)', count: list.filter(r => r.priorityScore >= 50 && r.priorityScore < 75).length },
      { range: '0 - 49 (Low)', count: list.filter(r => r.priorityScore < 50).length }
    ];

    const timelineMap = new Map<string, { count: number; highPriority: number }>();
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      timelineMap.set(dateStr, { count: 0, highPriority: 0 });
    }

    for (const r of list) {
      const d = new Date(r.createdAt);
      const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      if (timelineMap.has(dateStr)) {
        const item = timelineMap.get(dateStr)!;
        item.count++;
        if (r.priorityScore >= 75) item.highPriority++;
      }
    }

    const timelineTrends = Array.from(timelineMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      highPriority: data.highPriority
    }));

    return {
      totalRequests,
      highPriorityCount,
      activeHotspotsCount,
      activeClustersCount,
      estimatedCitizensAffected,
      recommendedProjectsCount: this.recommendations.length,
      categoryDistribution,
      stateDistribution,
      timelineTrends,
      priorityDistribution,
      verifiedImpactsCount: impactVerificationEngine.getVerificationRecords().length,
      averageGapScore: 68
    };
  }
}

export const dataStore = new JanNitiDataStore();
