export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'mr' | 'ta' | 'te' | 'gu' | 'kn' | 'ml' | 'pa';

export type UrgencyLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type SentimentType = 'Negative' | 'Urgent' | 'Neutral' | 'Positive';
export type GapLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type RequestStatus = 
  | 'Submitted' 
  | 'AI Analysed' 
  | 'Clustered'
  | 'Under Review' 
  | 'Prioritized' 
  | 'Recommended' 
  | 'Human Decision'
  | 'Assigned'
  | 'In Progress' 
  | 'Completed'
  | 'Impact Verified'
  | 'Resolved';

export interface LocationData {
  state: string;
  district: string;
  subDistrict?: string;
  cityOrVillage?: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ScoreBreakdown {
  urgency: number;
  affectedPopulation: number;
  infrastructureGap: number;
  demographicVulnerability: number;
  geographicConcentration: number;
  publicImpact: number;
  reasons: string[];
}

export interface VisualAssessment {
  detectedIssues: string[];
  severityRating: 'High' | 'Medium' | 'Low';
  visibleWaterlogging: boolean;
  potholeSeverity: string;
  structuralDamage: boolean;
  aiNote: string;
}

export interface CitizenRequest {
  id: string;
  requestId: string;
  text: string;
  originalText: string;
  language: string;
  translatedText?: string;
  category: string;
  subCategory: string;
  urgency: UrgencyLevel;
  sentiment: SentimentType;
  affectedPopulation: 'High' | 'Medium' | 'Low';
  affectedPopulationEstimate: number;
  infrastructureGapLevel: GapLevel;
  problemSummary: string;
  recommendedAction: string;
  priorityScore: number;
  scoreBreakdown: ScoreBreakdown;
  location: LocationData;
  status: RequestStatus;
  anonymous: boolean;
  imageUri?: string;
  voiceTranscript?: string;
  visualAssessment?: VisualAssessment;
  clusterId?: string;
  aiConfidence?: number;
  isDemo?: boolean;
  createdAt: string;
}

// ----------------------------------------------------
// PHASE 2: PUBLIC INFRASTRUCTURE INTELLIGENCE ENGINE
// ----------------------------------------------------

export interface EvidenceTimelineItem {
  date: string;
  event: string;
  badge?: string;
  type: 'citizen_signal' | 'cluster_formed' | 'spike_detected' | 'recommendation' | 'policy_decision' | 'verified_impact';
}

export interface IssueCluster {
  id: string; // e.g. "CL-1042"
  title: string;
  underlyingProblem: string;
  category: string;
  subCategories: string[];
  state: string;
  district: string;
  locality: string;
  coordinates: [number, number];
  relatedRequestIds: string[];
  requestCount: number;
  affectedPopulation: number;
  trend: 'Increasing' | 'Stable' | 'Decreasing' | 'Spiking';
  growthRatePercent: number;
  infrastructureGapScore: number; // 0 - 100
  priorityScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100%
  confidenceTier: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';
  clusterConfidence: number; // e.g. 94%
  rootCauseHypothesis: string;
  observedEvidence: string[];
  recommendedIntervention: string;
  leadDepartment: string;
  supportingDepartments: string[];
  estimatedCostCrores: number;
  timeline: EvidenceTimelineItem[];
  humanReviewStatus: 'Pending Review' | 'Approved' | 'Modified' | 'Rejected' | 'Under Investigation';
  humanAssignedPriority?: number;
  humanReviewerNotes?: string;
  humanReviewerRole?: string;
  humanReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceFusionFactor {
  dimension: string;
  score: number;
  weight: number;
  description: string;
  sourceDataset: string;
}

export interface EvidenceFusionReport {
  clusterId: string;
  overallPriorityScore: number;
  confidenceScore: number;
  confidenceTier: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';
  citizenDemandWeight: number;
  infrastructureGapWeight: number;
  populationImpactWeight: number;
  demandGrowthWeight: number;
  vulnerabilityWeight: number;
  factors: EvidenceFusionFactor[];
  verificationGuidance: string;
}

export interface CategoryGap {
  category: string;
  demandLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  availableFacilities: 'Critical Shortage' | 'Low' | 'Moderate' | 'Adequate';
  gapScore: number;
  gapSeverity: 'Critical Gap' | 'High Gap' | 'Moderate Gap' | 'Low Gap';
  benchmarkComparison: string;
}

export interface InfrastructureGapReport {
  state: string;
  district: string;
  overallHealthScore: number;
  overallGapScore: number;
  status: 'Critical Gap' | 'High Gap' | 'Moderate' | 'Satisfactory';
  population: number;
  activeRequests: number;
  categoryGaps: CategoryGap[];
  lastUpdated: string;
}

export interface DemandForecast {
  district: string;
  state: string;
  category: string;
  currentDemandCount: number;
  predictedDemand30d: number;
  growthRatePercent: number;
  forecastTier: 'Spike Expected' | 'Moderate Growth' | 'Stable' | 'Declining';
  historicalSeries: { date: string; demand: number }[];
  predictedSeries: { date: string; demand: number }[];
  modelAccuracyMae: number;
  confidenceScore: number;
}

export interface SeasonalDemandRisk {
  season: 'Monsoon' | 'Summer / Heatwave' | 'Winter / Smog' | 'Festival / Harvest Surge';
  riskTitle: string;
  expectedIncreasePercent: number;
  topAffectedCategories: string[];
  vulnerableDistricts: string[];
  evidenceNotes: string;
  recommendedPreemptiveActions: string[];
  riskSeverity: 'Critical' | 'High' | 'Moderate';
}

export interface EquityMetric {
  district: string;
  state: string;
  population: number;
  populationDensityPerSqKm: number;
  urbanRuralRatio: string;
  digitalParticipationIndex: number;
  requestsPerLakhPopulation: number;
  equityImpactMultiplier: number;
  isSilentNeedArea: boolean;
  underReportedRiskTier: 'HIGH UNDER-REPORTING RISK' | 'MODERATE UNDER-REPORTING' | 'BALANCED PARTICIPATION';
  equityExplanation: string;
}

export interface SimulationOption {
  optionId: string;
  name: string;
  interventionType: string;
  scope: string;
  estimatedDemandReductionPercent: number;
  estimatedGapReductionPercent: number;
  populationBenefited: number;
  estimatedCostCrores: number;
  implementationComplexity: 'Low' | 'Medium' | 'High' | 'Very High';
  feasibilityScore: number;
  pros: string[];
  tradeOffs: string[];
}

export interface PolicySimulationResult {
  clusterId: string;
  problemSummary: string;
  baselinePriority: number;
  baselineGapScore: number;
  affectedPopulation: number;
  options: SimulationOption[];
  aiRecommendedOptionId: string;
  recommendationRationale: string;
}

export interface BudgetProjectItem {
  id: string;
  title: string;
  category: string;
  district: string;
  state: string;
  estimatedCostCrores: number;
  expectedImpactScore: number;
  populationBenefited: number;
  priorityScore: number;
  costEfficiencyRatio: number;
  selected: boolean;
}

export interface BudgetAllocationResult {
  totalBudgetProvidedCrores: number;
  allocatedAmountCrores: number;
  remainingAmountCrores: number;
  projectsCount: number;
  netPopulationBenefited: number;
  averagePortfolioImpact: number;
  portfolioProjects: BudgetProjectItem[];
  weightsUsed: {
    population: number;
    urgency: number;
    equity: number;
    gap: number;
    costEfficiency: number;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'Policymaker' | 'Department Officer' | 'Analyst' | 'Administrator' | 'System AI';
  actionType: 'PRIORITY_OVERRIDE' | 'STATUS_APPROVAL' | 'STATUS_REJECTION' | 'DEPARTMENT_ASSIGNED' | 'BUDGET_APPROVED' | 'NOTE_ADDED' | 'DATA_INGESTED';
  targetEntityId: string;
  targetEntityType: 'IssueCluster' | 'CitizenRequest' | 'ProjectRecommendation' | 'Dataset';
  previousValue?: string;
  newValue?: string;
  justificationReason: string;
}

export interface CitizenFeedbackData {
  improved: number;
  partiallyImproved: number;
  notImproved: number;
  totalResponses: number;
  citizenSatisfactionPercent: number;
}

export interface ImpactVerificationRecord {
  id: string;
  clusterId: string;
  title: string;
  district: string;
  state: string;
  category: string;
  interventionDescription: string;
  completedAt: string;
  beforeMetrics: {
    citizenRequestsPerMonth: number;
    infrastructureGapScore: number;
    priorityScore: number;
    reportedSeverity: string;
  };
  afterMetrics: {
    citizenRequestsPerMonth: number;
    infrastructureGapScore: number;
    priorityScore: number;
    reportedSeverity: string;
  };
  observedImprovementPercent: number;
  citizenFeedback: CitizenFeedbackData;
  visualEvidenceBeforeUrl?: string;
  visualEvidenceAfterUrl?: string;
  verificationStatus: 'Verified with High Confidence' | 'Field Inspection Completed' | 'Ongoing Citizen Monitoring';
  leadDepartment: string;
}

export interface AnomalyAlert {
  id: string;
  type: 'DEMAND_SPIKE' | 'HOTSPOT_BREACH' | 'SILENT_AREA_ALERT' | 'SEASONAL_WARNING' | 'DATA_GAP_WARNING' | 'ANOMALOUS_VELOCITY';
  severity: 'Critical' | 'High' | 'Medium';
  title: string;
  message: string;
  district: string;
  state: string;
  category?: string;
  metricChangeText: string;
  confidenceScore: number;
  recommendedAction: string;
  timestamp: string;
  isDismissed: boolean;
}

export interface DataQualityReport {
  overallScore: number;
  completeness: number;
  freshness: number;
  geographicCoverage: number;
  consistency: number;
  sourceReliability: number;
  warnings: string[];
  canonicalGeographyCount: number;
  canonicalCategoryCount: number;
  lastIngestionDate: string;
}

export interface GeneratedPolicyBrief {
  briefId: string;
  title: string;
  district: string;
  state: string;
  category: string;
  generatedAt: string;
  executiveSummary: string;
  problemDefinition: string;
  observedEvidenceVsInference: {
    observedCitizenSignals: string[];
    aiRootCauseHypothesis: string;
    confidenceRating: string;
  };
  demographicAndInfrastructureGap: {
    affectedPopulation: string;
    gapScore: string;
    benchmarkComparison: string;
  };
  recommendedActionPlan: {
    leadAgency: string;
    supportingAgencies: string[];
    scopeOfWork: string;
    estimatedCapitalRequirement: string;
    executionTimeline: string;
  };
  projectedOutcomes: {
    demandReductionPercent: string;
    beneficiaryReach: string;
    longTermResilience: string;
  };
  riskAnalysisAndMitigation: {
    risks: string[];
    dataLimitations: string[];
    suggestedMitigations: string[];
  };
  alternativeOptionsConsidered: {
    alternativeTitle: string;
    tradeOffRationale: string;
  };
  signOffBlock: {
    preparedBy: string;
    reviewStatus: string;
    auditLogRef: string;
  };
}

export interface ExecutiveTodaySummary {
  date: string;
  totalActiveRequests: number;
  activeHotspots: number;
  activeClusters: number;
  criticalGapsCount: number;
  headline: string;
  summaryText: string;
  topPriorities: string;
  earlyWarningsCount: number;
  alerts: AnomalyAlert[];
}

export interface Hotspot {
  id: string;
  state: string;
  district: string;
  name: string;
  latitude: number;
  longitude: number;
  requestCount: number;
  hotspotScore: number;
  topCategories: { category: string; count: number }[];
  affectedPopulation: number;
  infrastructureGap: GapLevel;
  urgencyLevel: UrgencyLevel;
  recommendedIntervention: string;
  growthRatePercent: number;
  priorityAverage: number;
  requestIds: string[];
  clusterId?: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  problem: string;
  clusterId?: string;
  location: {
    state: string;
    district: string;
    coordinates: [number, number];
  };
  evidence: {
    requestCount: number;
    affectedPopulation: number;
    averagePriority: number;
    topCitizenQuotes: string[];
    keyIndicators: string[];
  };
  priorityScore: number;
  confidenceScore?: number;
  confidenceTier?: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';
  expectedImpact: string;
  suggestedIntervention: string;
  budgetTier: 'Low (< ₹50L)' | 'Medium (₹50L - ₹5Cr)' | 'High (₹5Cr - ₹25Cr)' | 'Major (> ₹25Cr)';
  estimatedCostCrores?: number;
  nationalMissionAlignment?: {
    schemeCode?: string;
    description?: string;
    mission?: string;
    reason?: string;
  }[];
  aiExplanation?: string;
  status?: 'Pending Review' | 'Approved' | 'Modified' | 'Rejected' | 'Under Investigation';
  humanOverridePriority?: number;
  decisionNotes?: string;
  createdAt?: string;
}

export interface MLDemandPrediction {
  district: string;
  state: string;
  category?: string;
  riskScore?: number;
  predictedDemandRisk?: 'LOW' | 'MEDIUM' | 'HIGH' | number;
  probabilityPercent: number;
  historicalGrowthRate?: number;
  baselineDeficitScore?: number;
  featureImportances?: {
    feature: string;
    importance: number;
    impact: 'Positive' | 'Negative' | 'Neutral';
    description: string;
  }[];
}

export interface PlatformStats {
  totalRequests: number;
  highPriorityCount: number;
  activeHotspotsCount: number;
  activeClustersCount?: number;
  estimatedCitizensAffected: number;
  recommendedProjectsCount: number;
  categoryDistribution: { category: string; count: number; percentage: number }[];
  stateDistribution: { state: string; count: number }[];
  timelineTrends: { date: string; count: number; highPriority: number }[];
  priorityDistribution: { range: string; count: number }[];
  verifiedImpactsCount?: number;
  averageGapScore?: number;
}

export interface DatasetTransparencyItem {
  id: string;
  name: string;
  source?: string;
  dataType?: string;
  status?: string;
  coverage?: string;
  lastUpdated?: string;
  ministryOrOrganization?: string;
  portalUrl?: string;
  purpose: string;
  updateFrequency?: string;
  governanceCompliance?: string;
  dataPointsUsed?: string[];
}
