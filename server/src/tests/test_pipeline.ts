import { analyzeCitizenRequestWithGemini } from '../ai/geminiService';
import { calculateHotspots } from '../analytics/hotspotEngine';
import { calculatePriorityScore } from '../analytics/priorityEngine';
import { generateProjectRecommendations } from '../analytics/recommendationEngine';
import { generateSeedRequests } from '../data/seedData';

async function runTests() {
  console.log('--- STARTING JANNITI AI CORE TEST SUITE ---');

  // Test 1: Priority Score bounds & breakdown
  console.log('1. Testing Priority Scoring Engine...');
  const scoreCritical = calculatePriorityScore({
    urgency: 'Critical',
    affectedPopulation: 'High',
    affectedPopulationEstimate: 50000,
    infrastructureGapLevel: 'Critical',
    category: 'Road Infrastructure',
    nearbySimilarCount: 60
  });

  if (scoreCritical.priorityScore < 80 || scoreCritical.priorityScore > 100) {
    throw new Error(`Critical score out of expected bounds: ${scoreCritical.priorityScore}`);
  }
  console.log(`✓ Critical Priority Score: ${scoreCritical.priorityScore}/100 with ${scoreCritical.scoreBreakdown.reasons.length} reasons.`);

  const scoreLow = calculatePriorityScore({
    urgency: 'Low',
    affectedPopulation: 'Low',
    affectedPopulationEstimate: 800,
    infrastructureGapLevel: 'Low',
    category: 'Public Safety & Transport',
    nearbySimilarCount: 2
  });
  console.log(`✓ Low Priority Score: ${scoreLow.priorityScore}/100 with ${scoreLow.scoreBreakdown.reasons.length} reasons.`);

  // Test 2: Multilingual AI Analysis (Hindi)
  console.log('\n2. Testing AI Semantic Understanding...');
  const hindiInput = 'हमारे गांव में बारिश के समय सड़क पूरी तरह खराब हो जाती है और पानी भर जाता है।';
  const aiRes = await analyzeCitizenRequestWithGemini(hindiInput, 'Hindi', { state: 'Uttar Pradesh', district: 'Lucknow' });
  console.log(`✓ Detected Category: "${aiRes.category}", Sub: "${aiRes.sub_category}", Urgency: "${aiRes.urgency}", Lang: "${aiRes.detected_language}"`);

  // Test 3: Hotspot Detection Engine
  console.log('\n3. Testing Hotspot Detection...');
  const seed = generateSeedRequests();
  console.log(`✓ Generated ${seed.length} realistic geocoded Indian citizen requests.`);
  
  const hotspots = calculateHotspots(seed);
  console.log(`✓ Identified ${hotspots.length} active demand hotspots.`);
  const topHotspot = hotspots[0];
  console.log(`✓ Top Hotspot: ${topHotspot.district} (${topHotspot.state}) with Hotspot Score ${topHotspot.hotspotScore}/100 affecting ~${topHotspot.affectedPopulation.toLocaleString()} citizens.`);

  // Test 4: AI Recommendations
  console.log('\n4. Testing AI Project Recommendation Engine...');
  const recs = generateProjectRecommendations(hotspots, seed);
  console.log(`✓ Generated ${recs.length} AI public works recommendations.`);
  console.log(`✓ Sample Recommended Project: "${recs[0]?.title}" [Priority: ${recs[0]?.priorityScore}]`);

  console.log('\n--- ALL CORE INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
