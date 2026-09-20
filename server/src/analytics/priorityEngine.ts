import { GapLevel, ScoreBreakdown, UrgencyLevel } from '../types';

interface ScoreInput {
  urgency: UrgencyLevel;
  affectedPopulation: 'High' | 'Medium' | 'Low';
  affectedPopulationEstimate?: number;
  infrastructureGapLevel: GapLevel;
  demographicVulnerabilityScore?: number; // 0-15
  geographicConcentrationScore?: number; // 0-10
  publicImpactScore?: number; // 0-10
  category: string;
  nearbySimilarCount?: number;
}

export function calculatePriorityScore(input: ScoreInput): {
  priorityScore: number;
  scoreBreakdown: ScoreBreakdown;
} {
  const reasons: string[] = [];

  // 1. Urgency (Weight: 30%)
  let urgencyScore = 15;
  if (input.urgency === 'Critical') {
    urgencyScore = 30;
    reasons.push('+ Critical urgency: Immediate hazard / acute safety risk flagged');
  } else if (input.urgency === 'High') {
    urgencyScore = 24;
    reasons.push('+ High urgency: Severe recurring disruption impacting daily life');
  } else if (input.urgency === 'Medium') {
    urgencyScore = 15;
    reasons.push('+ Medium urgency: Standard maintenance or service deficit');
  } else {
    urgencyScore = 8;
    reasons.push('+ Low urgency: Scheduled or routine enhancement');
  }

  // 2. Number of Affected Citizens (Weight: 20%)
  let popScore = 12;
  const est = input.affectedPopulationEstimate || 
    (input.affectedPopulation === 'High' ? 25000 : input.affectedPopulation === 'Medium' ? 8000 : 1500);

  if (est >= 50000 || input.affectedPopulation === 'High') {
    popScore = 20;
    reasons.push(`+ Large affected population (~${est.toLocaleString('en-IN')} citizens impacted)`);
  } else if (est >= 10000 || input.affectedPopulation === 'Medium') {
    popScore = 14;
    reasons.push(`+ Moderate community impact (~${est.toLocaleString('en-IN')} citizens)`);
  } else {
    popScore = 7;
    reasons.push(`+ Localized cluster impact (~${est.toLocaleString('en-IN')} citizens)`);
  }

  // 3. Infrastructure Gap (Weight: 15%)
  let gapScore = 9;
  if (input.infrastructureGapLevel === 'Critical') {
    gapScore = 15;
    reasons.push('+ Critical infrastructure deficit: Zero alternative provision currently accessible');
  } else if (input.infrastructureGapLevel === 'High') {
    gapScore = 12;
    reasons.push('+ Significant infrastructure gap: Below state & national standard benchmarks');
  } else if (input.infrastructureGapLevel === 'Medium') {
    gapScore = 8;
    reasons.push('+ Moderate service deficit under current demand load');
  } else {
    gapScore = 4;
    reasons.push('+ Minor infrastructure inadequacy');
  }

  // 4. Demographic Vulnerability (Weight: 15%)
  let vulnScore = input.demographicVulnerabilityScore ?? 11;
  if (vulnScore >= 12) {
    reasons.push('+ High demographic vulnerability: Impacts vulnerable rural/peri-urban populations, women safety, or children/elderly');
  } else if (vulnScore >= 8) {
    reasons.push('+ Moderate demographic vulnerability index for this administrative block');
  }

  // 5. Geographic Concentration (Weight: 10%)
  let geoScore = input.geographicConcentrationScore ?? 7;
  const nearby = input.nearbySimilarCount ?? 15;
  if (nearby > 50) {
    geoScore = 10;
    reasons.push(`+ High demand concentration: ${nearby}+ similar citizen reports within geographic cluster`);
  } else if (nearby > 10) {
    geoScore = 8;
    reasons.push(`+ Notable cluster density: ${nearby} reports in proximity corridor`);
  } else {
    geoScore = 5;
  }

  // 6. Public Impact (Weight: 10%)
  let impactScore = input.publicImpactScore ?? 7;
  const highImpactCategories = ['Road Infrastructure', 'Water & Sanitation', 'Healthcare & Primary Health', 'Drainage & Flood Control'];
  if (highImpactCategories.some(c => input.category.toLowerCase().includes(c.toLowerCase().split(' ')[0]))) {
    impactScore = 9;
    reasons.push('+ Multi-sectoral public benefit: Directly unlocks economic mobility and public health');
  }

  const rawTotal = urgencyScore + popScore + gapScore + vulnScore + geoScore + impactScore;
  const finalScore = Math.min(100, Math.max(1, Math.round(rawTotal)));

  return {
    priorityScore: finalScore,
    scoreBreakdown: {
      urgency: urgencyScore,
      affectedPopulation: popScore,
      infrastructureGap: gapScore,
      demographicVulnerability: vulnScore,
      geographicConcentration: geoScore,
      publicImpact: impactScore,
      reasons
    }
  };
}
