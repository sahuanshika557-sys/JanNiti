import { CitizenRequest, GapLevel, Hotspot, UrgencyLevel } from '../types';

export function calculateHotspots(requests: CitizenRequest[]): Hotspot[] {
  // Group requests by state & district
  const districtGroups = new Map<string, CitizenRequest[]>();

  for (const req of requests) {
    const key = `${req.location.state}:::${req.location.district}`;
    if (!districtGroups.has(key)) {
      districtGroups.set(key, []);
    }
    districtGroups.get(key)!.push(req);
  }

  const hotspots: Hotspot[] = [];

  for (const [key, reqList] of districtGroups.entries()) {
    const [state, district] = key.split(':::');
    if (reqList.length < 2) continue; // Minimum threshold for a cluster

    // Average coordinates
    const avgLat = reqList.reduce((sum, r) => sum + r.location.latitude, 0) / reqList.length;
    const avgLng = reqList.reduce((sum, r) => sum + r.location.longitude, 0) / reqList.length;

    // Category distribution
    const catMap = new Map<string, number>();
    for (const r of reqList) {
      catMap.set(r.category, (catMap.get(r.category) || 0) + 1);
    }
    const topCategories = Array.from(catMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate urgency & priority stats
    const criticalCount = reqList.filter(r => r.urgency === 'Critical').length;
    const highCount = reqList.filter(r => r.urgency === 'High').length;
    const avgPriority = Math.round(reqList.reduce((sum, r) => sum + r.priorityScore, 0) / reqList.length);
    const totalAffectedEst = reqList.reduce((sum, r) => sum + (r.affectedPopulationEstimate || 15000), 0);
    // Deduplicate community overlap factor
    const estAffectedPop = Math.min(250000, Math.round(totalAffectedEst * 0.45));

    // Hotspot score calculation (0 - 100)
    // Factors: Volume density (max 35), Priority avg (max 35), Critical ratio (max 20), Growth factor (max 10)
    const volumeScore = Math.min(35, (reqList.length / 40) * 35);
    const priorityFactor = (avgPriority / 100) * 35;
    const urgencyRatioFactor = ((criticalCount * 2 + highCount) / (reqList.length * 2)) * 20;
    const growthFactor = 8.5; // Baseline high demand momentum

    const hotspotScore = Math.min(100, Math.max(15, Math.round(volumeScore + priorityFactor + urgencyRatioFactor + growthFactor)));

    // Determine highest infrastructure gap
    let infraGap: GapLevel = 'Medium';
    if (hotspotScore >= 80 || criticalCount >= 5) infraGap = 'Critical';
    else if (hotspotScore >= 60) infraGap = 'High';

    let urgencyLevel: UrgencyLevel = 'Medium';
    if (criticalCount > 0 || hotspotScore >= 75) urgencyLevel = 'Critical';
    else if (highCount > reqList.length * 0.4 || hotspotScore >= 55) urgencyLevel = 'High';

    // Formulate targeted intervention recommendation
    const primaryCat = topCategories[0]?.category || 'Road Infrastructure';
    const secondaryCat = topCategories[1]?.category;

    let recommendedIntervention = `Deploy prioritized ${primaryCat} upgrades across ${district} corridor.`;
    if (primaryCat === 'Road Infrastructure' && secondaryCat === 'Drainage & Flood Control') {
      recommendedIntervention = `Prioritize integrated road rehabilitation and underground stormwater drainage across ${district} to mitigate recurring monsoon damages.`;
    } else if (primaryCat === 'Water & Sanitation') {
      recommendedIntervention = `Accelerate Jal Jeevan Mission pipeline deployment and community water purification units in high-demand pockets of ${district}.`;
    } else if (primaryCat === 'Healthcare & Primary Health') {
      recommendedIntervention = `Upgrade local primary health sub-centres into 24/7 Ayushman Arogya Mandirs with mobile diagnostic units in ${district}.`;
    } else if (primaryCat === 'Electricity & Street Lighting') {
      recommendedIntervention = `Implement smart solar LED street lighting illumination project along vulnerable transit corridors in ${district}.`;
    }

    hotspots.push({
      id: `hotspot-${state.toLowerCase().slice(0, 3)}-${district.toLowerCase().replace(/\s+/g, '-')}`,
      state,
      district,
      name: `${district} Infrastructure Hotspot`,
      latitude: Number(avgLat.toFixed(5)),
      longitude: Number(avgLng.toFixed(5)),
      requestCount: reqList.length,
      hotspotScore,
      topCategories,
      affectedPopulation: estAffectedPop,
      infrastructureGap: infraGap,
      urgencyLevel,
      recommendedIntervention,
      growthRatePercent: Math.round(14 + (hotspotScore * 0.35)),
      priorityAverage: avgPriority,
      requestIds: reqList.map(r => r.id)
    });
  }

  return hotspots.sort((a, b) => b.hotspotScore - a.hotspotScore);
}
