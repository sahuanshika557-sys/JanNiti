import { CategoryGap, CitizenRequest, InfrastructureGapReport } from '../types';

export const CORE_INFRASTRUCTURE_CATEGORIES = [
  'Roads & Bridges',
  'Water Supply',
  'Sanitation & Solid Waste',
  'Healthcare Facilities',
  'Education Infrastructure',
  'Electricity & Power',
  'Public Transport',
  'Stormwater Drainage',
  'Public Safety & Lighting',
  'Digital Connectivity'
];

/**
 * Benchmark facility coverage ratios per 100k population
 */
const DISTRICT_POPULATION_BENCHMARKS: Record<string, { population: number; baselineHealth: number }> = {
  'lucknow': { population: 3650000, baselineHealth: 68 },
  'kanpur nagar': { population: 4580000, baselineHealth: 62 },
  'varanasi': { population: 3670000, baselineHealth: 70 },
  'prayagraj': { population: 5950000, baselineHealth: 64 },
  'agra': { population: 4410000, baselineHealth: 65 },
  'patna': { population: 5830000, baselineHealth: 58 },
  'gaya': { population: 4390000, baselineHealth: 54 },
  'muzaffarpur': { population: 4800000, baselineHealth: 52 },
  'pune': { population: 9420000, baselineHealth: 78 },
  'nagpur': { population: 4650000, baselineHealth: 74 },
  'jaipur': { population: 6620000, baselineHealth: 72 },
  'jodhpur': { population: 3680000, baselineHealth: 66 },
  'bengaluru urban': { population: 13190000, baselineHealth: 76 },
  'kolkata': { population: 14900000, baselineHealth: 73 },
  'chennai': { population: 8650000, baselineHealth: 79 },
  'ahmedabad': { population: 8250000, baselineHealth: 75 },
  'bhopal': { population: 2370000, baselineHealth: 67 },
  'indore': { population: 3270000, baselineHealth: 81 },
  'hyderabad': { population: 10500000, baselineHealth: 77 },
  'thiruvananthapuram': { population: 3300000, baselineHealth: 84 }
};

/**
 * Computes district-level Infrastructure Gap Reports across 10 vital civic categories
 */
export function calculateDistrictInfrastructureGaps(requests: CitizenRequest[]): InfrastructureGapReport[] {
  // Group requests by district
  const districtMap = new Map<string, { state: string; requests: CitizenRequest[] }>();

  for (const r of requests) {
    const dKey = r.location.district.toLowerCase();
    if (!districtMap.has(dKey)) {
      districtMap.set(dKey, { state: r.location.state, requests: [] });
    }
    districtMap.get(dKey)!.requests.push(r);
  }

  // Also ensure canonical benchmark districts are present
  for (const [distKey, info] of Object.entries(DISTRICT_POPULATION_BENCHMARKS)) {
    if (!districtMap.has(distKey)) {
      const state = resolveDefaultState(distKey);
      districtMap.set(distKey, { state, requests: [] });
    }
  }

  const reports: InfrastructureGapReport[] = [];

  for (const [distKey, data] of districtMap.entries()) {
    const formattedDistrict = capitalizeWords(distKey);
    const benchmark = DISTRICT_POPULATION_BENCHMARKS[distKey] || { population: 2500000, baselineHealth: 65 };
    const distRequests = data.requests;

    const categoryGaps: CategoryGap[] = CORE_INFRASTRUCTURE_CATEGORIES.map(category => {
      // Find matching requests for this category
      const matched = distRequests.filter(r => isCategoryMatch(r.category, category));
      const demandCount = matched.length;

      let demandLevel: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
      if (demandCount >= 25) demandLevel = 'Critical';
      else if (demandCount >= 14) demandLevel = 'High';
      else if (demandCount >= 6) demandLevel = 'Medium';

      // Base gap computation
      let gapScore = Math.min(95, Math.max(25, 
        Math.round((100 - benchmark.baselineHealth) * 0.8 + (demandCount * 2.8) + getCategoryBaseRisk(category))
      ));

      let availableFacilities: 'Critical Shortage' | 'Low' | 'Moderate' | 'Adequate' = 'Moderate';
      if (gapScore >= 80) availableFacilities = 'Critical Shortage';
      else if (gapScore >= 65) availableFacilities = 'Low';
      else if (gapScore >= 45) availableFacilities = 'Moderate';
      else availableFacilities = 'Adequate';

      let gapSeverity: 'Critical Gap' | 'High Gap' | 'Moderate Gap' | 'Low Gap' = 'Moderate Gap';
      if (gapScore >= 80) gapSeverity = 'Critical Gap';
      else if (gapScore >= 65) gapSeverity = 'High Gap';
      else if (gapScore >= 45) gapSeverity = 'Moderate Gap';
      else gapSeverity = 'Low Gap';

      const benchmarkComparison = gapScore >= 75
        ? `${Math.round(gapScore - 50)}% below national urban infrastructure benchmark standard`
        : (gapScore >= 55
            ? `Within 15% variance of state capital infrastructure averages`
            : `Compliant with MoHUA / CPHEEO baseline infrastructure norms`);

      return {
        category,
        demandLevel,
        availableFacilities,
        gapScore,
        gapSeverity,
        benchmarkComparison
      };
    });

    // Overall District Infrastructure Gap Score
    const overallGapScore = Math.round(categoryGaps.reduce((sum, g) => sum + g.gapScore, 0) / categoryGaps.length);
    const overallHealthScore = Math.max(15, 100 - overallGapScore);

    const status: 'Critical Gap' | 'High Gap' | 'Moderate' | 'Satisfactory' =
      overallGapScore >= 75 ? 'Critical Gap' : (overallGapScore >= 60 ? 'High Gap' : (overallGapScore >= 40 ? 'Moderate' : 'Satisfactory'));

    reports.push({
      state: data.state,
      district: formattedDistrict,
      overallHealthScore,
      overallGapScore,
      status,
      population: benchmark.population,
      activeRequests: distRequests.length,
      categoryGaps: categoryGaps.sort((a, b) => b.gapScore - a.gapScore),
      lastUpdated: new Date().toISOString()
    });
  }

  return reports.sort((a, b) => b.overallGapScore - a.overallGapScore);
}

function isCategoryMatch(reqCategory: string, coreCategory: string): boolean {
  const rc = reqCategory.toLowerCase();
  const cc = coreCategory.toLowerCase();

  if (cc.includes('road') && (rc.includes('road') || rc.includes('transport'))) return true;
  if (cc.includes('water') && (rc.includes('water') || rc.includes('jal'))) return true;
  if (cc.includes('sanitation') && (rc.includes('sanitation') || rc.includes('waste') || rc.includes('garbage'))) return true;
  if (cc.includes('health') && (rc.includes('health') || rc.includes('hospital') || rc.includes('medical'))) return true;
  if (cc.includes('education') && (rc.includes('education') || rc.includes('school'))) return true;
  if (cc.includes('electricity') && (rc.includes('electricity') || rc.includes('power') || rc.includes('energy'))) return true;
  if (cc.includes('transport') && (rc.includes('transport') || rc.includes('bus') || rc.includes('metro'))) return true;
  if (cc.includes('drainage') && (rc.includes('drainage') || rc.includes('flood') || rc.includes('waterlogging'))) return true;
  if (cc.includes('safety') && (rc.includes('safety') || rc.includes('light') || rc.includes('police'))) return true;
  if (cc.includes('digital') && (rc.includes('digital') || rc.includes('internet') || rc.includes('telecom'))) return true;

  return rc.includes(cc.split(' ')[0]);
}

function getCategoryBaseRisk(category: string): number {
  if (category.includes('Roads') || category.includes('Drainage')) return 12;
  if (category.includes('Water') || category.includes('Sanitation')) return 10;
  if (category.includes('Healthcare')) return 8;
  return 4;
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

function resolveDefaultState(distKey: string): string {
  if (['lucknow', 'kanpur nagar', 'varanasi', 'prayagraj', 'agra'].includes(distKey)) return 'Uttar Pradesh';
  if (['patna', 'gaya', 'muzaffarpur'].includes(distKey)) return 'Bihar';
  if (['pune', 'nagpur'].includes(distKey)) return 'Maharashtra';
  if (['jaipur', 'jodhpur'].includes(distKey)) return 'Rajasthan';
  if (['bengaluru urban'].includes(distKey)) return 'Karnataka';
  if (['kolkata'].includes(distKey)) return 'West Bengal';
  if (['chennai'].includes(distKey)) return 'Tamil Nadu';
  if (['ahmedabad'].includes(distKey)) return 'Gujarat';
  if (['bhopal', 'indore'].includes(distKey)) return 'Madhya Pradesh';
  if (['hyderabad'].includes(distKey)) return 'Telangana';
  if (['thiruvananthapuram'].includes(distKey)) return 'Kerala';
  return 'Uttar Pradesh';
}
