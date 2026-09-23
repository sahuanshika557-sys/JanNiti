import { CitizenFeedbackData, ImpactVerificationRecord } from '../types';

/**
 * Impact Verification & Citizen Outcome Feedback Loop Engine
 * Tracks projects after execution, calculates before-and-after variance,
 * and records citizen satisfaction ratings to close the DPI feedback loop.
 */
export class ImpactVerificationEngine {
  private records: ImpactVerificationRecord[] = [];

  constructor() {
    this.seedInitialVerificationRecords();
  }

  private seedInitialVerificationRecords() {
    this.records = [
      {
        id: 'IMP-201',
        clusterId: 'CL-1028',
        title: 'Hazratganj Smart Drainage & Road Resurfacing Corridor',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        category: 'Roads & Bridges',
        interventionDescription: 'Integrated asphalt resurfacing with 1.8km RCC box storm drainage and precast culverts.',
        completedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        beforeMetrics: {
          citizenRequestsPerMonth: 820,
          infrastructureGapScore: 86,
          priorityScore: 91,
          reportedSeverity: 'Critical'
        },
        afterMetrics: {
          citizenRequestsPerMonth: 410,
          infrastructureGapScore: 51,
          priorityScore: 42,
          reportedSeverity: 'Low'
        },
        observedImprovementPercent: 52,
        citizenFeedback: {
          improved: 342,
          partiallyImproved: 68,
          notImproved: 14,
          totalResponses: 424,
          citizenSatisfactionPercent: 88
        },
        visualEvidenceBeforeUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        visualEvidenceAfterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
        verificationStatus: 'Verified with High Confidence',
        leadDepartment: 'Public Works Department (PWD)'
      },
      {
        id: 'IMP-202',
        clusterId: 'CL-1031',
        title: 'Panki Industrial Bypass Water Pipeline Replacement',
        district: 'Kanpur Nagar',
        state: 'Uttar Pradesh',
        category: 'Water Supply',
        interventionDescription: 'Replaced 4.2km corroded cast-iron transmission main with ductile iron (DI) pipe and booster station.',
        completedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
        beforeMetrics: {
          citizenRequestsPerMonth: 560,
          infrastructureGapScore: 82,
          priorityScore: 88,
          reportedSeverity: 'High'
        },
        afterMetrics: {
          citizenRequestsPerMonth: 120,
          infrastructureGapScore: 38,
          priorityScore: 35,
          reportedSeverity: 'Low'
        },
        observedImprovementPercent: 78,
        citizenFeedback: {
          improved: 280,
          partiallyImproved: 45,
          notImproved: 8,
          totalResponses: 333,
          citizenSatisfactionPercent: 91
        },
        visualEvidenceBeforeUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80',
        visualEvidenceAfterUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        verificationStatus: 'Field Inspection Completed',
        leadDepartment: 'Jal Sansthan (PHED)'
      },
      {
        id: 'IMP-203',
        clusterId: 'CL-1034',
        title: 'Kankarbagh High-Capacity Solid Waste Transfer Station',
        district: 'Patna',
        state: 'Bihar',
        category: 'Sanitation & Waste',
        interventionDescription: 'Commissioned covered modern compaction station with 12 GPS-tracked mechanized e-trikes.',
        completedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        beforeMetrics: {
          citizenRequestsPerMonth: 490,
          infrastructureGapScore: 79,
          priorityScore: 84,
          reportedSeverity: 'High'
        },
        afterMetrics: {
          citizenRequestsPerMonth: 195,
          infrastructureGapScore: 44,
          priorityScore: 48,
          reportedSeverity: 'Medium'
        },
        observedImprovementPercent: 60,
        citizenFeedback: {
          improved: 195,
          partiallyImproved: 52,
          notImproved: 18,
          totalResponses: 265,
          citizenSatisfactionPercent: 82
        },
        verificationStatus: 'Ongoing Citizen Monitoring',
        leadDepartment: 'Patna Municipal Corporation'
      }
    ];
  }

  public getVerificationRecords(): ImpactVerificationRecord[] {
    return this.records;
  }

  public getRecordById(id: string): ImpactVerificationRecord | undefined {
    return this.records.find(r => r.id === id || r.clusterId === id);
  }

  public recordCitizenFeedback(
    recordId: string,
    feedbackType: 'improved' | 'partiallyImproved' | 'notImproved'
  ): ImpactVerificationRecord | null {
    const rec = this.records.find(r => r.id === recordId);
    if (!rec) return null;

    rec.citizenFeedback[feedbackType]++;
    rec.citizenFeedback.totalResponses++;
    
    // Recalculate citizen satisfaction %
    const total = rec.citizenFeedback.totalResponses;
    const positive = rec.citizenFeedback.improved + (rec.citizenFeedback.partiallyImproved * 0.5);
    rec.citizenFeedback.citizenSatisfactionPercent = Math.round((positive / total) * 100);

    return rec;
  }
}

export const impactVerificationEngine = new ImpactVerificationEngine();
