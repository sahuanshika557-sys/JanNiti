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
  ExecutiveTodaySummary,
  GeneratedPolicyBrief,
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

const metaEnv = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
const API_BASE = metaEnv?.VITE_API_URL
  ? `${metaEnv.VITE_API_URL.replace(/\/$/, '')}/api`
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
    ? 'https://janniti-lviv.onrender.com/api'
    : '/api';

export interface AnalysisResponse {
  aiAnalysis: {
    category: string;
    sub_category: string;
    urgency: string;
    sentiment: string;
    affected_population: string;
    affected_population_estimate: number;
    infrastructure_gap_level: string;
    problem_summary: string;
    recommended_action: string;
    detected_language: string;
    translated_text?: string;
    extracted_location?: {
      state?: string;
      district?: string;
      cityOrVillage?: string;
    };
    confidence_score: number;
    is_fallback: boolean;
  };
  priorityScore: number;
  scoreBreakdown: {
    urgency: number;
    affectedPopulation: number;
    infrastructureGap: number;
    demographicVulnerability: number;
    geographicConcentration: number;
    publicImpact: number;
    reasons: string[];
  };
  visualAssessment?: {
    detectedIssues: string[];
    severityRating: 'High' | 'Medium' | 'Low';
    visibleWaterlogging: boolean;
    potholeSeverity: string;
    structuralDamage: boolean;
    aiNote: string;
  };
}

export const apiService = {
  // 1. Health check
  async checkHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'OFFLINE_FALLBACK', geminiConfigured: false };
    }
  },

  // 2. Multimodal citizen analysis preview
  async analyzeRequest(
    text: string,
    language?: string,
    location?: { state?: string; district?: string },
    imageUri?: string
  ): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyze-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language, location, imageUri })
    });

    if (!res.ok) {
      throw new Error(`Analysis failed with status ${res.status}`);
    }
    return await res.json();
  },

  // 3. Submit Citizen Request
  async submitRequest(data: {
    text: string;
    language: string;
    location: {
      state: string;
      district: string;
      subDistrict?: string;
      cityOrVillage?: string;
      latitude: number;
      longitude: number;
      address?: string;
    };
    anonymous?: boolean;
    imageUri?: string;
    voiceTranscript?: string;
  }): Promise<CitizenRequest> {
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Server error');
      const saved = await res.json();
      this.saveToLocalHistory(saved);
      return saved;
    } catch (err) {
      console.warn('Network submission failed, queueing locally:', err);
      const localReq: CitizenRequest = {
        id: `local-req-${Date.now()}`,
        requestId: `JN-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`,
        text: data.text,
        originalText: data.text,
        language: data.language || 'hi',
        translatedText: data.text,
        category: 'Road Infrastructure',
        subCategory: 'Local Drainage & Surface Degradation',
        urgency: 'High',
        sentiment: 'Negative',
        affectedPopulation: 'High',
        affectedPopulationEstimate: 28000,
        infrastructureGapLevel: 'High',
        problemSummary: `Draft Request (Saved Locally on Device)`,
        recommendedAction: 'Sync automatically when internet connection resumes',
        priorityScore: 84,
        scoreBreakdown: {
          urgency: 25,
          affectedPopulation: 18,
          infrastructureGap: 14,
          demographicVulnerability: 12,
          geographicConcentration: 8,
          publicImpact: 7,
          reasons: ['Locally queued due to network deficit']
        },
        location: data.location,
        status: 'Submitted',
        anonymous: !!data.anonymous,
        imageUri: data.imageUri,
        voiceTranscript: data.voiceTranscript,
        aiConfidence: 0.92,
        isDemo: true,
        createdAt: new Date().toISOString()
      };
      this.saveToLocalHistory(localReq);
      return localReq;
    }
  },

  // 4. Get Citizen Requests
  async getRequests(filters?: {
    state?: string;
    district?: string;
    category?: string;
    urgency?: string;
    language?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ requests: CitizenRequest[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.state) params.set('state', filters.state);
    if (filters?.district) params.set('district', filters.district);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.urgency) params.set('urgency', filters.urgency);
    if (filters?.language) params.set('language', filters.language);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.limit) params.set('limit', filters.limit.toString());
    if (filters?.offset) params.set('offset', filters.offset.toString());

    const res = await fetch(`${API_BASE}/requests?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch requests');
    return await res.json();
  },

  // 5. Issue Clusters
  async getClusters(filters?: { state?: string; district?: string; category?: string }): Promise<IssueCluster[]> {
    const params = new URLSearchParams();
    if (filters?.state) params.set('state', filters.state);
    if (filters?.district) params.set('district', filters.district);
    if (filters?.category) params.set('category', filters.category);

    const res = await fetch(`${API_BASE}/clusters?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch clusters');
    return await res.json();
  },

  async getClusterById(id: string): Promise<IssueCluster> {
    const res = await fetch(`${API_BASE}/clusters/${id}`);
    if (!res.ok) throw new Error('Failed to fetch cluster');
    return await res.json();
  },

  // 6. Evidence Fusion Report
  async getEvidenceFusion(clusterId: string): Promise<EvidenceFusionReport> {
    const res = await fetch(`${API_BASE}/evidence-fusion/${clusterId}`);
    if (!res.ok) throw new Error('Failed to fetch evidence fusion report');
    return await res.json();
  },

  // 7. Infrastructure Gaps (10 vital categories)
  async getInfrastructureGaps(district?: string): Promise<InfrastructureGapReport[]> {
    const url = district ? `${API_BASE}/infrastructure-gaps?district=${encodeURIComponent(district)}` : `${API_BASE}/infrastructure-gaps`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch infrastructure gaps');
    return await res.json();
  },

  async getInfrastructureGapByDistrict(district: string): Promise<InfrastructureGapReport> {
    const res = await fetch(`${API_BASE}/infrastructure-gaps/${encodeURIComponent(district)}`);
    if (!res.ok) throw new Error('Failed to fetch district gap report');
    return await res.json();
  },

  // 8. Demand Forecasts & Seasonal Risks
  async getForecasts(district?: string): Promise<DemandForecast[]> {
    const url = district ? `${API_BASE}/forecasts?district=${encodeURIComponent(district)}` : `${API_BASE}/forecasts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch demand forecasts');
    return await res.json();
  },

  async getSeasonalRisks(): Promise<SeasonalDemandRisk[]> {
    const res = await fetch(`${API_BASE}/seasonal-risks`);
    if (!res.ok) throw new Error('Failed to fetch seasonal risks');
    return await res.json();
  },

  // 9. Equity & Silent Areas
  async getEquityMetrics(): Promise<EquityMetric[]> {
    const res = await fetch(`${API_BASE}/equity/metrics`);
    if (!res.ok) throw new Error('Failed to fetch equity metrics');
    return await res.json();
  },

  async getSilentAreas(): Promise<EquityMetric[]> {
    const res = await fetch(`${API_BASE}/equity/silent-areas`);
    if (!res.ok) throw new Error('Failed to fetch silent areas');
    return await res.json();
  },

  // 10. Policy Simulator & Budget Optimizer
  async simulateIntervention(clusterId: string): Promise<PolicySimulationResult> {
    const res = await fetch(`${API_BASE}/simulator/evaluate/${clusterId}`);
    if (!res.ok) throw new Error('Failed to simulate intervention');
    return await res.json();
  },

  async optimizeBudget(budgetCrores: number, weights?: any): Promise<BudgetAllocationResult> {
    const res = await fetch(`${API_BASE}/simulator/optimize-budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budgetCrores, weights })
    });
    if (!res.ok) throw new Error('Failed to optimize budget');
    return await res.json();
  },

  // 11. Governance & Audit Logs
  async getAuditLogs(filters?: any): Promise<AuditLogEntry[]> {
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${API_BASE}/governance/audit-logs?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return await res.json();
  },

  async recordGovernanceDecision(data: {
    clusterId: string;
    action: 'APPROVE' | 'MODIFY' | 'REJECT' | 'INVESTIGATE';
    actorName?: string;
    actorRole?: string;
    assignedPriority?: number;
    assignedDepartment?: string;
    notes?: string;
  }): Promise<{ cluster: IssueCluster; auditEntry: AuditLogEntry }> {
    const res = await fetch(`${API_BASE}/governance/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to record governance decision');
    return await res.json();
  },

  // 12. Impact Verification & Feedback Loop
  async getImpactVerificationRecords(): Promise<ImpactVerificationRecord[]> {
    const res = await fetch(`${API_BASE}/impact-verification`);
    if (!res.ok) throw new Error('Failed to fetch impact verification records');
    return await res.json();
  },

  async recordCitizenImpactFeedback(
    recordId: string,
    feedbackType: 'improved' | 'partiallyImproved' | 'notImproved'
  ): Promise<ImpactVerificationRecord> {
    const res = await fetch(`${API_BASE}/impact-verification/${recordId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedbackType })
    });
    if (!res.ok) throw new Error('Failed to record feedback');
    return await res.json();
  },

  // 13. Early Warnings & Anomaly Alerts
  async getAlerts(): Promise<AnomalyAlert[]> {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return await res.json();
  },

  async dismissAlert(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/alerts/${id}/dismiss`, { method: 'POST' });
    if (!res.ok) return false;
    const json = await res.json();
    return json.success;
  },

  // 14. AI Policy Brief Generator
  async generatePolicyBrief(clusterId: string, notes?: string): Promise<GeneratedPolicyBrief> {
    const res = await fetch(`${API_BASE}/policy-brief/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clusterId, notes })
    });
    if (!res.ok) throw new Error('Failed to generate policy brief');
    return await res.json();
  },

  // 15. Today's Executive Infrastructure Brief
  async getExecutiveTodaySummary(): Promise<ExecutiveTodaySummary> {
    const res = await fetch(`${API_BASE}/executive-summary/today`);
    if (!res.ok) throw new Error('Failed to fetch executive summary');
    return await res.json();
  },

  // 16. Data Quality Report
  async getDataQualityReport(): Promise<DataQualityReport> {
    const res = await fetch(`${API_BASE}/data-quality`);
    if (!res.ok) throw new Error('Failed to fetch data quality report');
    return await res.json();
  },

  // --- Legacy / Core Integrations ---
  async getHotspots(state?: string, district?: string): Promise<Hotspot[]> {
    const params = new URLSearchParams();
    if (state && state !== 'All') params.set('state', state);
    if (district && district !== 'All') params.set('district', district);
    const res = await fetch(`${API_BASE}/hotspots?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch hotspots');
    return await res.json();
  },

  async getRecommendations(): Promise<ProjectRecommendation[]> {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return await res.json();
  },

  async getPredictions(): Promise<MLDemandPrediction[]> {
    const res = await fetch(`${API_BASE}/predictions`);
    if (!res.ok) throw new Error('Failed to fetch predictions');
    return await res.json();
  },

  async getPlatformStats(state?: string, district?: string): Promise<PlatformStats> {
    const params = new URLSearchParams();
    if (state && state !== 'All') params.set('state', state);
    if (district && district !== 'All') params.set('district', district);
    const res = await fetch(`${API_BASE}/statistics?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch platform stats');
    return await res.json();
  },

  async getDatasets(): Promise<DatasetTransparencyItem[]> {
    const res = await fetch(`${API_BASE}/datasets`);
    if (!res.ok) throw new Error('Failed to fetch datasets');
    return await res.json();
  },

  async askCopilot(query: string, contextFilters?: { state?: string; district?: string }): Promise<{ answer: string; isRealtimeGemini: boolean }> {
    const res = await fetch(`${API_BASE}/policy-copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query, contextFilters })
    });
    if (!res.ok) throw new Error('Copilot query failed');
    return await res.json();
  },

  async transcribeVoice(language?: string): Promise<{ transcript: string; language: string; confidence: number }> {
    const res = await fetch(`${API_BASE}/voice/transcribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language })
    });
    if (!res.ok) throw new Error('Voice transcription failed');
    return await res.json();
  },

  async askPolicyCopilot(
    query: string, 
    stateOrFilters?: string | { state?: string; district?: string }, 
    district?: string
  ): Promise<{ answer: string; isRealtimeGemini: boolean }> {
    let contextFilters: { state?: string; district?: string } | undefined = undefined;
    if (typeof stateOrFilters === 'string') {
      contextFilters = { state: stateOrFilters, district };
    } else if (stateOrFilters) {
      contextFilters = stateOrFilters;
    }
    return this.askCopilot(query, contextFilters);
  },

  async getStatistics(state?: string, district?: string): Promise<PlatformStats> {
    return this.getPlatformStats(state, district);
  },

  // Local storage caching for offline drafts
  saveToLocalHistory(request: CitizenRequest) {
    try {
      const stored = localStorage.getItem('janniti_my_requests');
      const list: CitizenRequest[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter(r => r.requestId !== request.requestId);
      filtered.unshift(request);
      localStorage.setItem('janniti_my_requests', JSON.stringify(filtered.slice(0, 30)));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  },

  getLocalHistory(): CitizenRequest[] {
    try {
      const stored = localStorage.getItem('janniti_my_requests');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
};
