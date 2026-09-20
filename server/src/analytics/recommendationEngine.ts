import { CitizenRequest, Hotspot, ProjectRecommendation } from '../types';

export function generateProjectRecommendations(
  hotspots: Hotspot[],
  requests: CitizenRequest[]
): ProjectRecommendation[] {
  const recommendations: ProjectRecommendation[] = [];

  for (const hotspot of hotspots.slice(0, 8)) {
    const clusterRequests = requests.filter(r => hotspot.requestIds.includes(r.id));
    const quotes = clusterRequests.slice(0, 3).map(r => `"${r.text}" (${r.language})`);
    
    const primaryCat = hotspot.topCategories[0]?.category || 'Road Infrastructure';
    const district = hotspot.district;
    const state = hotspot.state;

    let title = `${district} Comprehensive Infrastructure Modernization`;
    let problem = `Severe multi-point infrastructure deficit reported across ${district} with concentrated citizen distress.`;
    let suggestedIntervention = hotspot.recommendedIntervention;
    let budgetTier: ProjectRecommendation['budgetTier'] = 'High (₹5Cr - ₹25Cr)';
    let nationalMissions = [
      {
        mission: 'PM Gati Shakti National Master Plan',
        schemeCode: 'PMGS-INFRA-2024',
        description: 'Multi-modal synchronization to eliminate infrastructure bottlenecks.'
      }
    ];

    if (primaryCat === 'Road Infrastructure') {
      title = `${district} High-Density Road Corridor & Pothole Rehabilitation Project`;
      problem = `Pervasive road surface deterioration, dangerous potholes, and unpaved arterial stretches disrupting daily commute and emergency medical transit across ${district}.`;
      budgetTier = 'High (₹5Cr - ₹25Cr)';
      nationalMissions = [
        {
          mission: 'Pradhan Mantri Gram Sadak Yojana (PMGSY-IV)',
          schemeCode: 'PMGSY-RUR-RD',
          description: 'All-weather durable road connectivity for rural and peri-urban habitations.'
        },
        {
          mission: 'PM Gati Shakti National Master Plan',
          schemeCode: 'PMGS-CORRIDOR',
          description: 'Synchronized utility corridor laying to prevent repetitive road digging.'
        }
      ];
    } else if (primaryCat === 'Drainage & Flood Control') {
      title = `${district} Stormwater Drainage & Monsoon Waterlogging Mitigation Project`;
      problem = `Recurring monsoon inundation, blocked open nullahs, and zero stormwater outlet capacity triggering localized flooding and waterborne illness in ${district}.`;
      budgetTier = 'Medium (₹50L - ₹5Cr)';
      nationalMissions = [
        {
          mission: 'AMRUT 2.0 (Urban Water & Drainage Mission)',
          schemeCode: 'AMRUT-DR-02',
          description: 'Universal coverage of stormwater drains and urban flood management.'
        },
        {
          mission: 'Swachh Bharat Mission (Grameen / Urban 2.0)',
          schemeCode: 'SBM-U-SOLID',
          description: 'Liquid waste containment and sustainable stormwater management.'
        }
      ];
    } else if (primaryCat === 'Water & Sanitation') {
      title = `${district} Potable Water Pipeline & Har Ghar Jal Extension Initiative`;
      problem = `Acute contamination of local groundwater and severe shortages in tap water delivery forcing households to travel long distances for daily drinking water.`;
      budgetTier = 'High (₹5Cr - ₹25Cr)';
      nationalMissions = [
        {
          mission: 'Jal Jeevan Mission (Har Ghar Jal)',
          schemeCode: 'JJM-DW-2024',
          description: 'Assured tap water supply of 55 litres per capita per day of prescribed quality.'
        },
        {
          mission: 'National Water Mission (Jal Shakti Abhiyan)',
          schemeCode: 'JSA-CATCH-RAIN',
          description: 'Rainwater harvesting and aquifer recharge in critical blocks.'
        }
      ];
    } else if (primaryCat === 'Healthcare & Primary Health') {
      title = `${district} Ayushman Arogya Mandir Upgrade & Mobile Health Delivery Project`;
      problem = `Critical shortage of functional primary health sub-centres and diagnostic facilities within 10km radius, causing delayed emergency response.`;
      budgetTier = 'Medium (₹50L - ₹5Cr)';
      nationalMissions = [
        {
          mission: 'Ayushman Bharat Digital & Health Infrastructure Mission',
          schemeCode: 'PM-ABHIM',
          description: 'Strengthening grassroots public health institutions in rural and urban areas.'
        }
      ];
    } else if (primaryCat === 'Electricity & Street Lighting') {
      title = `${district} Smart Solar Street Lighting & Public Corridor Illumination Project`;
      problem = `Persistent dark stretches and non-functional illumination compromising night safety, especially for women, girl students, and nighttime workers.`;
      budgetTier = 'Low (< ₹50L)';
      nationalMissions = [
        {
          mission: 'Street Lighting National Programme (SLNP)',
          schemeCode: 'SLNP-EESL',
          description: 'Energy-efficient LED conversion and smart automated timer lighting.'
        },
        {
          mission: 'Safe City Project (MHA / Nirbhaya Fund)',
          schemeCode: 'NIRBHAYA-SAFE-CITY',
          description: 'Targeted safety infrastructure and surveillance in public spaces.'
        }
      ];
    }

    const aiExplanation = `JanNiti AI analysis identified a severe cluster of ${hotspot.requestCount} citizen requests in ${district}, ${state} with an average urgency priority of ${hotspot.priorityAverage}/100. Combining citizen feedback with Open Government baseline data shows an acute infrastructure gap level (${hotspot.infrastructureGap}). Implementing this project will directly benefit ~${hotspot.affectedPopulation.toLocaleString('en-IN')} citizens while proactively eliminating recurring maintenance expenses.`;

    recommendations.push({
      id: `rec-${district.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`,
      title,
      problem,
      location: {
        state,
        district,
        coordinates: [hotspot.latitude, hotspot.longitude]
      },
      evidence: {
        requestCount: hotspot.requestCount,
        affectedPopulation: hotspot.affectedPopulation,
        averagePriority: hotspot.priorityAverage,
        topCitizenQuotes: quotes.length > 0 ? quotes : [
          `"Roads are impassable after the recent rains" (Hindi)`,
          `"Water stagnation causing massive health hazards" (English)`
        ],
        keyIndicators: [
          `Hotspot Demand Score: ${hotspot.hotspotScore}/100`,
          `Demographic Exposure: ${hotspot.affectedPopulation.toLocaleString('en-IN')} citizens`,
          `30-Day Complaint Velocity: +${hotspot.growthRatePercent}%`,
          `Primary Need: ${primaryCat} (${hotspot.topCategories[0]?.count || 0} reports)`
        ]
      },
      priorityScore: hotspot.hotspotScore,
      expectedImpact: `Resolution will restore safe connectivity, prevent monsoon water stagnation, and protect ~${hotspot.affectedPopulation.toLocaleString('en-IN')} residents from recurring hazards.`,
      suggestedIntervention,
      budgetTier,
      nationalMissionAlignment: nationalMissions,
      aiExplanation
    });
  }

  return recommendations;
}
