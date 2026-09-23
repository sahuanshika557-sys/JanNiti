import { BudgetAllocationResult, BudgetProjectItem, IssueCluster } from '../types';

export interface BudgetOptimizerWeights {
  population: number; // 0 - 100
  urgency: number; // 0 - 100
  equity: number; // 0 - 100
  gap: number; // 0 - 100
  costEfficiency: number; // 0 - 100
}

/**
 * Budget & Resource Portfolio Optimization Engine
 * Selects the optimal set of infrastructure projects under a given budget ceiling (in ₹ Crores)
 * based on multi-objective weighted utility scoring.
 */
export function optimizeBudgetPortfolio(
  clusters: IssueCluster[],
  totalBudgetCrores: number,
  customWeights?: Partial<BudgetOptimizerWeights>
): BudgetAllocationResult {
  const weights: BudgetOptimizerWeights = {
    population: customWeights?.population ?? 25,
    urgency: customWeights?.urgency ?? 25,
    equity: customWeights?.equity ?? 20,
    gap: customWeights?.gap ?? 15,
    costEfficiency: customWeights?.costEfficiency ?? 15
  };

  const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0) || 100;

  // Convert clusters into Candidate Budget Projects
  const candidateProjects: BudgetProjectItem[] = clusters.map(c => {
    const cost = c.estimatedCostCrores || 1.8;
    const popScore = Math.min(100, Math.round((c.affectedPopulation / 35000) * 100));
    const urgencyScore = c.priorityScore || 80;
    const gapScore = c.infrastructureGapScore || 75;
    const equityScore = c.locality.includes('Rural') || c.district.toLowerCase() === 'gaya' || c.district.toLowerCase() === 'muzaffarpur' ? 95 : 72;
    const efficiencyRatio = Number((((popScore + urgencyScore) / 2) / cost).toFixed(2));

    // Weighted composite impact score (0 - 100)
    const compositeImpact = Math.round(
      (popScore * weights.population +
       urgencyScore * weights.urgency +
       equityScore * weights.equity +
       gapScore * weights.gap +
       Math.min(100, efficiencyRatio * 2) * weights.costEfficiency) / totalWeight
    );

    return {
      id: c.id,
      title: c.title,
      category: c.category,
      district: c.district,
      state: c.state,
      estimatedCostCrores: cost,
      expectedImpactScore: compositeImpact,
      populationBenefited: c.affectedPopulation,
      priorityScore: c.priorityScore,
      costEfficiencyRatio: efficiencyRatio,
      selected: false
    };
  });

  // Sort candidates by cost efficiency & composite impact
  candidateProjects.sort((a, b) => (b.expectedImpactScore / b.estimatedCostCrores) - (a.expectedImpactScore / a.estimatedCostCrores));

  // Greedy Knapsack Selection
  let allocated = 0;
  const portfolio: BudgetProjectItem[] = [];

  for (const proj of candidateProjects) {
    if (allocated + proj.estimatedCostCrores <= totalBudgetCrores) {
      proj.selected = true;
      allocated += proj.estimatedCostCrores;
      portfolio.push(proj);
    } else {
      proj.selected = false;
      portfolio.push(proj);
    }
  }

  const selectedList = portfolio.filter(p => p.selected);
  const netPop = selectedList.reduce((s, p) => s + p.populationBenefited, 0);
  const avgImpact = selectedList.length > 0
    ? Math.round(selectedList.reduce((s, p) => s + p.expectedImpactScore, 0) / selectedList.length)
    : 0;

  return {
    totalBudgetProvidedCrores: totalBudgetCrores,
    allocatedAmountCrores: Number(allocated.toFixed(2)),
    remainingAmountCrores: Number((totalBudgetCrores - allocated).toFixed(2)),
    projectsCount: selectedList.length,
    netPopulationBenefited: netPop,
    averagePortfolioImpact: avgImpact,
    portfolioProjects: portfolio,
    weightsUsed: weights
  };
}
