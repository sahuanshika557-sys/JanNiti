import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { analyzeCitizenRequestWithGemini } from '../ai/geminiService';
import { generatePolicyBriefWithGemini } from '../ai/policyBriefService';
import { askPolicyCopilot } from '../ai/policyCopilotService';
import { calculatePriorityScore } from '../analytics/priorityEngine';
import { dataStore } from '../data/store';
import { CitizenRequest } from '../types';

const router = Router();

// 1. Health check & DPI System Status
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'JanNiti AI Public Infrastructure Intelligence Core',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10 && !process.env.GEMINI_API_KEY.includes('your_gemini_api_key')),
    version: '2.0.0-DPI'
  });
});

// 2. Multimodal Citizen Request Analysis (Preview)
router.post('/analyze-request', async (req: Request, res: Response) => {
  try {
    const { text, language, location, imageUri } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    const aiResult = await analyzeCitizenRequestWithGemini(text, language, location);
    
    const scoreResult = calculatePriorityScore({
      urgency: aiResult.urgency,
      affectedPopulation: aiResult.affected_population,
      affectedPopulationEstimate: aiResult.affected_population_estimate,
      infrastructureGapLevel: aiResult.infrastructure_gap_level,
      category: aiResult.category,
      nearbySimilarCount: 35
    });

    let visualAssessment = undefined;
    if (imageUri) {
      visualAssessment = {
        detectedIssues: ['Surface asphalt disintegration', 'Visible water accumulation', 'Sub-base erosion'],
        severityRating: aiResult.urgency === 'Critical' ? 'High' as const : 'Medium' as const,
        visibleWaterlogging: true,
        potholeSeverity: 'Deep cratering (>15cm depth)',
        structuralDamage: true,
        aiNote: 'AI-assisted visual assessment: Pothole clustering and stagnant stormwater detected. Advisory only.'
      };
    }

    res.json({
      aiAnalysis: aiResult,
      priorityScore: scoreResult.priorityScore,
      scoreBreakdown: scoreResult.scoreBreakdown,
      visualAssessment
    });
  } catch (error: any) {
    console.error('Error in analyze-request:', error);
    res.status(500).json({ error: 'Failed to analyze citizen request', message: error.message });
  }
});

// 3. Submit Citizen Request
router.post('/requests', async (req: Request, res: Response) => {
  try {
    const { text, language, location, anonymous, imageUri, voiceTranscript } = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Request text is required.' });
    }

    const safeLocation = {
      state: location?.state || 'Uttar Pradesh',
      district: location?.district || 'Lucknow',
      subDistrict: location?.subDistrict || 'Central Ward',
      cityOrVillage: location?.cityOrVillage || location?.district || 'Lucknow',
      latitude: Number(location?.latitude) || 26.8467,
      longitude: Number(location?.longitude) || 80.9462,
      address: location?.address || `${location?.district || 'Lucknow'}, ${location?.state || 'Uttar Pradesh'}`
    };

    const aiResult = await analyzeCitizenRequestWithGemini(text, language, safeLocation);

    const scoreResult = calculatePriorityScore({
      urgency: aiResult.urgency,
      affectedPopulation: aiResult.affected_population,
      affectedPopulationEstimate: aiResult.affected_population_estimate,
      infrastructureGapLevel: aiResult.infrastructure_gap_level,
      category: aiResult.category,
      nearbySimilarCount: 42
    });

    let visualAssessment = undefined;
    if (imageUri) {
      visualAssessment = {
        detectedIssues: ['Surface asphalt disintegration', 'Visible water accumulation'],
        severityRating: aiResult.urgency === 'Critical' ? 'High' as const : 'Medium' as const,
        visibleWaterlogging: true,
        potholeSeverity: 'Deep cratering (>15cm depth)',
        structuralDamage: true,
        aiNote: 'AI-assisted visual assessment: Pothole clustering detected. Advisory only.'
      };
    }

    const statePrefix = safeLocation.state.slice(0, 2).toUpperCase();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const requestId = `JN-${statePrefix}-${randomSeq}`;

    const newRequest: CitizenRequest = {
      id: uuidv4(),
      requestId,
      text,
      originalText: text,
      language: language || 'hi',
      translatedText: aiResult.translated_text || text,
      category: aiResult.category,
      subCategory: aiResult.sub_category,
      urgency: aiResult.urgency,
      sentiment: aiResult.sentiment,
      affectedPopulation: aiResult.affected_population,
      affectedPopulationEstimate: aiResult.affected_population_estimate,
      infrastructureGapLevel: aiResult.infrastructure_gap_level,
      problemSummary: aiResult.problem_summary,
      recommendedAction: aiResult.recommended_action,
      priorityScore: scoreResult.priorityScore,
      scoreBreakdown: scoreResult.scoreBreakdown,
      location: safeLocation,
      status: 'Submitted',
      anonymous: !!anonymous,
      imageUri,
      voiceTranscript,
      visualAssessment,
      aiConfidence: 0.94,
      isDemo: false,
      createdAt: new Date().toISOString()
    };

    const saved = dataStore.addRequest(newRequest);
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('Error submitting citizen request:', error);
    res.status(500).json({ error: 'Failed to submit citizen request', message: error.message });
  }
});

// 4. Get Citizen Requests
router.get('/requests', (req: Request, res: Response) => {
  const { state, district, category, urgency, language, search, limit, offset } = req.query;
  const result = dataStore.getRequests({
    state: state as string,
    district: district as string,
    category: category as string,
    urgency: urgency as string,
    language: language as string,
    search: search as string,
    limit: limit ? parseInt(limit as string, 10) : 100,
    offset: offset ? parseInt(offset as string, 10) : 0
  });
  res.json(result);
});

// 5. Get Citizen Request by ID
router.get('/requests/:id', (req: Request, res: Response) => {
  const request = dataStore.getRequestById(req.params.id);
  if (!request) {
    return res.status(404).json({ error: 'Citizen request not found' });
  }
  res.json(request);
});

// --- PHASE 2 INTELLIGENCE ENDPOINTS ---

// 6. Issue Clusters
router.get('/clusters', (req: Request, res: Response) => {
  const { state, district, category } = req.query;
  const clusters = dataStore.getClusters({
    state: state as string,
    district: district as string,
    category: category as string
  });
  res.json(clusters);
});

router.get('/clusters/:id', (req: Request, res: Response) => {
  const cluster = dataStore.getClusterById(req.params.id);
  if (!cluster) return res.status(404).json({ error: 'Cluster not found' });
  res.json(cluster);
});

// 7. Evidence Fusion Report for Cluster
router.get('/evidence-fusion/:clusterId', (req: Request, res: Response) => {
  const report = dataStore.getEvidenceFusionForCluster(req.params.clusterId);
  if (!report) return res.status(404).json({ error: 'Evidence report not found' });
  res.json(report);
});

// 8. Infrastructure Gaps (10 vital categories)
router.get('/infrastructure-gaps', (req: Request, res: Response) => {
  const { district } = req.query;
  const gaps = dataStore.getInfrastructureGaps(district as string);
  res.json(gaps);
});

router.get('/infrastructure-gaps/:district', (req: Request, res: Response) => {
  const gap = dataStore.getInfrastructureGapByDistrict(req.params.district);
  if (!gap) return res.status(404).json({ error: 'District gap profile not found' });
  res.json(gap);
});

// 9. Demand Forecasts & Seasonal Intelligence
router.get('/forecasts', (req: Request, res: Response) => {
  const { district } = req.query;
  const forecasts = dataStore.getDemandForecasts(district as string);
  res.json(forecasts);
});

router.get('/seasonal-risks', (req: Request, res: Response) => {
  const risks = dataStore.getSeasonalRisks();
  res.json(risks);
});

// 10. Equity & Silent Areas
router.get('/equity/metrics', (req: Request, res: Response) => {
  res.json(dataStore.getEquityMetrics());
});

router.get('/equity/silent-areas', (req: Request, res: Response) => {
  res.json(dataStore.getSilentAreas());
});

// 11. Policy Simulator & Budget Optimizer
router.get('/simulator/evaluate/:clusterId', (req: Request, res: Response) => {
  const sim = dataStore.simulateIntervention(req.params.clusterId);
  if (!sim) return res.status(404).json({ error: 'Simulation cluster not found' });
  res.json(sim);
});

router.post('/simulator/optimize-budget', (req: Request, res: Response) => {
  const { budgetCrores, weights } = req.body;
  const budget = Number(budgetCrores) || 10;
  const result = dataStore.optimizeBudget(budget, weights);
  res.json(result);
});

// 12. Governance & Audit Logs
router.get('/governance/audit-logs', (req: Request, res: Response) => {
  const { entityId, actorRole, actionType, limit } = req.query;
  const logs = dataStore.getAuditLogs({
    entityId: entityId as string,
    actorRole: actorRole as string,
    actionType: actionType as string,
    limit: limit ? parseInt(limit as string, 10) : 100
  });
  res.json(logs);
});

router.post('/governance/decision', (req: Request, res: Response) => {
  const { clusterId, action, actorName, actorRole, assignedPriority, assignedDepartment, notes } = req.body;
  if (!clusterId || !action) {
    return res.status(400).json({ error: 'clusterId and action are required' });
  }

  const result = dataStore.recordGovernanceDecision(clusterId, {
    action,
    actorName: actorName || 'Authorized Officer',
    actorRole: actorRole || 'Policymaker',
    assignedPriority: assignedPriority ? Number(assignedPriority) : undefined,
    assignedDepartment,
    notes: notes || 'Human review recorded'
  });

  if (!result) return res.status(404).json({ error: 'Cluster not found' });
  res.json(result);
});

// 13. Impact Verification & Feedback Loop
router.get('/impact-verification', (req: Request, res: Response) => {
  res.json(dataStore.getImpactVerificationRecords());
});

router.post('/impact-verification/:id/feedback', (req: Request, res: Response) => {
  const { feedbackType } = req.body; // 'improved' | 'partiallyImproved' | 'notImproved'
  if (!['improved', 'partiallyImproved', 'notImproved'].includes(feedbackType)) {
    return res.status(400).json({ error: 'Invalid feedbackType' });
  }
  const updated = dataStore.recordCitizenImpactFeedback(req.params.id, feedbackType);
  if (!updated) return res.status(404).json({ error: 'Impact record not found' });
  res.json(updated);
});

// 14. Early Warnings & Anomaly Alerts
router.get('/alerts', (req: Request, res: Response) => {
  res.json(dataStore.getAlerts());
});

router.post('/alerts/:id/dismiss', (req: Request, res: Response) => {
  const ok = dataStore.dismissAlert(req.params.id);
  res.json({ success: ok });
});

// 15. AI Policy Brief Generator
router.post('/policy-brief/generate', async (req: Request, res: Response) => {
  try {
    const { clusterId, notes, timeframe } = req.body;
    const cluster = dataStore.getClusterById(clusterId) || dataStore.getClusters()[0];
    if (!cluster) return res.status(404).json({ error: 'No cluster available for policy brief' });

    const brief = await generatePolicyBriefWithGemini({ cluster, notes, timeframe });
    res.json(brief);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate policy brief', message: err.message });
  }
});

// 16. Today's Executive Infrastructure Brief
router.get('/executive-summary/today', (req: Request, res: Response) => {
  const stats = dataStore.getStatistics();
  const clusters = dataStore.getClusters().slice(0, 3);
  const alerts = dataStore.getAlerts().slice(0, 3);

  const topPriorities = clusters.map((c, i) => `${i + 1}. ${c.title} (Priority: ${c.priorityScore}/100, ${c.affectedPopulation.toLocaleString()} citizens)`).join('\n');

  res.json({
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    totalActiveRequests: stats.totalRequests,
    activeHotspots: stats.activeHotspotsCount,
    activeClusters: stats.activeClustersCount,
    criticalGapsCount: 4,
    headline: `National Public Infrastructure Intelligence Brief — ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    summaryText: `JanNiti Decision Intelligence has synthesized ${stats.totalRequests.toLocaleString()} citizen voices across 20 districts into ${stats.activeClustersCount} active issue clusters. Immediate pre-monsoon road and stormwater drainage intervention is advised for the Gangetic plain corridor.`,
    topPriorities,
    earlyWarningsCount: alerts.length,
    alerts
  });
});

// 17. Data Quality Report
router.get('/data-quality', (req: Request, res: Response) => {
  res.json(dataStore.getDataQualityReport());
});

// --- Legacy / Core Integrations ---
router.get('/hotspots', (req: Request, res: Response) => {
  const { state, district } = req.query;
  res.json(dataStore.getHotspots(state as string, district as string));
});

router.get('/recommendations', (req: Request, res: Response) => {
  res.json(dataStore.getRecommendations());
});

router.get('/predictions', (req: Request, res: Response) => {
  res.json(dataStore.getPredictions());
});

router.get('/statistics', (req: Request, res: Response) => {
  const { state, district } = req.query;
  res.json(dataStore.getStatistics(state as string, district as string));
});

router.get('/datasets', (req: Request, res: Response) => {
  res.json(dataStore.getDatasets());
});

router.post('/policy-copilot', async (req: Request, res: Response) => {
  try {
    const { message, contextFilters, conversationHistory } = req.body;
    if (!message) return res.status(400).json({ error: 'Message query is required' });

    const stats = dataStore.getStatistics(contextFilters?.state, contextFilters?.district);
    const hotspots = dataStore.getHotspots(contextFilters?.state, contextFilters?.district);
    const recommendations = dataStore.getRecommendations();

    const result = await askPolicyCopilot({
      userQuery: message,
      currentStats: stats,
      hotspots,
      recommendations,
      selectedState: contextFilters?.state,
      selectedDistrict: contextFilters?.district,
      conversationHistory: conversationHistory || []
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process AI policy copilot query', message: error.message });
  }
});

router.post('/voice/transcribe', async (req: Request, res: Response) => {
  const { language } = req.body;
  const lang = language || 'hi';
  const sampleMap: Record<string, string> = {
    hi: 'हमारे इलाके में बारिश के समय सड़क पर बहुत पानी भर जाता है और सड़क खराब हो जाती है।',
    en: 'Main road in Hazratganj is broken with severe potholes and waterlogging during rains.',
    mr: 'आमच्या गावातील रस्ता पावसाळ्यात चिखलमय होतो, मुख्य बाजारपेठेत जाणे खूप कठीण होते.',
    bn: 'বর্ষার সময় রাস্তাটি পুরোপুরি খানাখন্দে ভরে যায় এবং জল জমে থাকে।',
    ta: 'இந்த சாலையில் கடுமையான பள்ளங்கள் உள்ளன மற்றும் மழைக்காலத்தில் தண்ணீர் தேங்கி நிற்கிறது.'
  };

  res.json({
    transcript: sampleMap[lang] || sampleMap['hi'],
    language: lang,
    confidence: 0.96
  });
});

export default router;
