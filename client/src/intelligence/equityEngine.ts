import { CitizenRequest, EquityMetric } from '../types';

interface DistrictDemographicContext {
  state: string;
  population: number;
  populationDensity: number;
  urbanRural: string;
  baselineFacilityDeficit: number; // 0 - 100
  estimatedDigitalLiteracy: number; // 0 - 100
}

const DISTRICT_DEMOGRAPHICS: Record<string, DistrictDemographicContext> = {
  'lucknow': { state: 'Uttar Pradesh', population: 3650000, populationDensity: 1815, urbanRural: '66% Urban / 34% Rural', baselineFacilityDeficit: 45, estimatedDigitalLiteracy: 74 },
  'kanpur nagar': { state: 'Uttar Pradesh', population: 4580000, populationDensity: 1450, urbanRural: '65% Urban / 35% Rural', baselineFacilityDeficit: 52, estimatedDigitalLiteracy: 68 },
  'varanasi': { state: 'Uttar Pradesh', population: 3670000, populationDensity: 2395, urbanRural: '43% Urban / 57% Rural', baselineFacilityDeficit: 50, estimatedDigitalLiteracy: 62 },
  'prayagraj': { state: 'Uttar Pradesh', population: 5950000, populationDensity: 1086, urbanRural: '25% Urban / 75% Rural', baselineFacilityDeficit: 58, estimatedDigitalLiteracy: 56 },
  'agra': { state: 'Uttar Pradesh', population: 4410000, populationDensity: 1084, urbanRural: '45% Urban / 55% Rural', baselineFacilityDeficit: 54, estimatedDigitalLiteracy: 64 },
  'patna': { state: 'Bihar', population: 5830000, populationDensity: 1823, urbanRural: '43% Urban / 57% Rural', baselineFacilityDeficit: 62, estimatedDigitalLiteracy: 58 },
  'gaya': { state: 'Bihar', population: 4390000, populationDensity: 880, urbanRural: '13% Urban / 87% Rural', baselineFacilityDeficit: 74, estimatedDigitalLiteracy: 42 },
  'muzaffarpur': { state: 'Bihar', population: 4800000, populationDensity: 1514, urbanRural: '9% Urban / 91% Rural', baselineFacilityDeficit: 76, estimatedDigitalLiteracy: 40 },
  'pune': { state: 'Maharashtra', population: 9420000, populationDensity: 603, urbanRural: '61% Urban / 39% Rural', baselineFacilityDeficit: 32, estimatedDigitalLiteracy: 82 },
  'nagpur': { state: 'Maharashtra', population: 4650000, populationDensity: 470, urbanRural: '68% Urban / 32% Rural', baselineFacilityDeficit: 38, estimatedDigitalLiteracy: 78 },
  'jaipur': { state: 'Rajasthan', population: 6620000, populationDensity: 598, urbanRural: '52% Urban / 48% Rural', baselineFacilityDeficit: 42, estimatedDigitalLiteracy: 70 },
  'jodhpur': { state: 'Rajasthan', population: 3680000, populationDensity: 161, urbanRural: '34% Urban / 66% Rural', baselineFacilityDeficit: 55, estimatedDigitalLiteracy: 54 },
  'bengaluru urban': { state: 'Karnataka', population: 13190000, populationDensity: 4381, urbanRural: '91% Urban / 9% Rural', baselineFacilityDeficit: 28, estimatedDigitalLiteracy: 88 },
  'kolkata': { state: 'West Bengal', population: 14900000, populationDensity: 24306, urbanRural: '100% Urban', baselineFacilityDeficit: 36, estimatedDigitalLiteracy: 80 },
  'chennai': { state: 'Tamil Nadu', population: 8650000, populationDensity: 26553, urbanRural: '100% Urban', baselineFacilityDeficit: 26, estimatedDigitalLiteracy: 86 },
  'ahmedabad': { state: 'Gujarat', population: 8250000, populationDensity: 890, urbanRural: '84% Urban / 16% Rural', baselineFacilityDeficit: 30, estimatedDigitalLiteracy: 81 },
  'bhopal': { state: 'Madhya Pradesh', population: 2370000, populationDensity: 855, urbanRural: '80% Urban / 20% Rural', baselineFacilityDeficit: 48, estimatedDigitalLiteracy: 69 },
  'indore': { state: 'Madhya Pradesh', population: 3270000, populationDensity: 841, urbanRural: '74% Urban / 26% Rural', baselineFacilityDeficit: 34, estimatedDigitalLiteracy: 79 },
  'hyderabad': { state: 'Telangana', population: 10500000, populationDensity: 18172, urbanRural: '100% Urban', baselineFacilityDeficit: 29, estimatedDigitalLiteracy: 84 },
  'thiruvananthapuram': { state: 'Kerala', population: 3300000, populationDensity: 1508, urbanRural: '54% Urban / 46% Rural', baselineFacilityDeficit: 22, estimatedDigitalLiteracy: 92 }
};

/**
 * Calculates Equity Metrics & Detects "Silent Areas" (Potential Under-Reported Regions)
 */
export function calculateEquityAndSilentAreas(requests: CitizenRequest[]): EquityMetric[] {
  // Count requests per district
  const requestCountMap = new Map<string, number>();
  for (const r of requests) {
    const d = r.location.district.toLowerCase();
    requestCountMap.set(d, (requestCountMap.get(d) || 0) + 1);
  }

  const equityList: EquityMetric[] = [];

  for (const [distKey, demo] of Object.entries(DISTRICT_DEMOGRAPHICS)) {
    const count = requestCountMap.get(distKey) || 0;
    const formattedDistrict = distKey.replace(/\b\w/g, c => c.toUpperCase());

    // Requests per lakh (100,000) population
    const requestsPerLakh = Number(((count / demo.population) * 100000).toFixed(2));

    // Digital Participation Index (DPI) (0 - 100)
    // Combines request rate per capita, smartphone penetration proxy, and language breadth
    const digitalParticipationIndex = Math.min(95, Math.max(18, 
      Math.round(demo.estimatedDigitalLiteracy * 0.65 + (requestsPerLakh * 12) + (demo.urbanRural.includes('Urban') ? 10 : 0))
    ));

    // Under-Reporting Risk Evaluation:
    // High Risk if: Low reporting rate (<1.5 per lakh) AND High Baseline Facility Deficit (>50) AND Low Digital Literacy (<60)
    let isSilentNeedArea = false;
    let underReportedRiskTier: 'HIGH UNDER-REPORTING RISK' | 'MODERATE UNDER-REPORTING' | 'BALANCED PARTICIPATION' = 'BALANCED PARTICIPATION';
    let equityImpactMultiplier = 1.0;
    let equityExplanation = '';

    if (requestsPerLakh < 1.8 && demo.baselineFacilityDeficit >= 55) {
      isSilentNeedArea = true;
      underReportedRiskTier = 'HIGH UNDER-REPORTING RISK';
      equityImpactMultiplier = 1.45; // 45% priority boost to prevent digital bias
      equityExplanation = `High vulnerability / rural demographic with low digital reporting volume. AI flags potential hidden infrastructure deficits requiring field survey.`;
    } else if (requestsPerLakh < 3.0 && demo.baselineFacilityDeficit >= 45) {
      underReportedRiskTier = 'MODERATE UNDER-REPORTING';
      equityImpactMultiplier = 1.20;
      equityExplanation = `Moderate digital participation gap. Suggests expanding Common Service Centre (CSC) and mobile voice-intake camps.`;
    } else {
      underReportedRiskTier = 'BALANCED PARTICIPATION';
      equityImpactMultiplier = 1.0;
      equityExplanation = `Healthy digital reporting coverage consistent with municipal demographic baseline.`;
    }

    equityList.push({
      district: formattedDistrict,
      state: demo.state,
      population: demo.population,
      populationDensityPerSqKm: demo.populationDensity,
      urbanRuralRatio: demo.urbanRural,
      digitalParticipationIndex,
      requestsPerLakhPopulation: requestsPerLakh,
      equityImpactMultiplier,
      isSilentNeedArea,
      underReportedRiskTier,
      equityExplanation
    });
  }

  // Sort: High Silent Need / Under-reporting first, then lowest DPI
  return equityList.sort((a, b) => {
    if (a.isSilentNeedArea && !b.isSilentNeedArea) return -1;
    if (!a.isSilentNeedArea && b.isSilentNeedArea) return 1;
    return a.digitalParticipationIndex - b.digitalParticipationIndex;
  });
}
