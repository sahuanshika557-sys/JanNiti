import { v4 as uuidv4 } from 'uuid';
import { AuditLogEntry, IssueCluster } from '../types';

/**
 * Human-in-the-Loop Governance & Audit Log Engine
 * Ensures AI provides decision support while constitutional human authority retains final project sanction.
 */
export class GovernanceEngine {
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.seedInitialAuditLogs();
  }

  private seedInitialAuditLogs() {
    this.auditLogs = [
      {
        id: uuidv4(),
        timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
        actorName: 'Dr. Alok Verma, IAS',
        actorRole: 'Policymaker',
        actionType: 'STATUS_APPROVAL',
        targetEntityId: 'CL-1041',
        targetEntityType: 'IssueCluster',
        previousValue: 'Pending Review',
        newValue: 'Approved',
        justificationReason: 'Approved for inclusion in upcoming District Urban Development Action Plan (DUDAP).'
      },
      {
        id: uuidv4(),
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
        actorName: 'Er. Rajesh Pandey',
        actorRole: 'Department Officer',
        actionType: 'DEPARTMENT_ASSIGNED',
        targetEntityId: 'CL-1042',
        targetEntityType: 'IssueCluster',
        previousValue: 'Unassigned',
        newValue: 'Public Works Department (PWD) + Stormwater Div.',
        justificationReason: 'Joint field inspection mandated before pre-monsoon road resurfacing.'
      },
      {
        id: uuidv4(),
        timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
        actorName: 'Pooja Singhania',
        actorRole: 'Analyst',
        actionType: 'PRIORITY_OVERRIDE',
        targetEntityId: 'CL-1043',
        targetEntityType: 'IssueCluster',
        previousValue: '76',
        newValue: '88',
        justificationReason: 'Field survey revealed seasonal flood risk at school access corridor; increased priority.'
      }
    ];
  }

  public getAuditLogs(filters?: {
    entityId?: string;
    actorRole?: string;
    actionType?: string;
    limit?: number;
  }): AuditLogEntry[] {
    let list = [...this.auditLogs];

    if (filters) {
      if (filters.entityId) {
        list = list.filter(l => l.targetEntityId.toLowerCase() === filters.entityId!.toLowerCase());
      }
      if (filters.actorRole && filters.actorRole !== 'All') {
        list = list.filter(l => l.actorRole.toLowerCase() === filters.actorRole!.toLowerCase());
      }
      if (filters.actionType && filters.actionType !== 'All') {
        list = list.filter(l => l.actionType.toLowerCase() === filters.actionType!.toLowerCase());
      }
    }

    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return list.slice(0, filters?.limit || 100);
  }

  public recordDecision(
    cluster: IssueCluster,
    decision: {
      action: 'APPROVE' | 'MODIFY' | 'REJECT' | 'INVESTIGATE';
      actorName: string;
      actorRole: 'Policymaker' | 'Department Officer' | 'Analyst' | 'Administrator';
      assignedPriority?: number;
      assignedDepartment?: string;
      notes: string;
    }
  ): { cluster: IssueCluster; auditEntry: AuditLogEntry } {
    const prevStatus = cluster.humanReviewStatus;
    let newStatus: 'Pending Review' | 'Approved' | 'Modified' | 'Rejected' | 'Under Investigation' = 'Approved';
    let actionType: AuditLogEntry['actionType'] = 'STATUS_APPROVAL';

    if (decision.action === 'APPROVE') {
      newStatus = 'Approved';
      actionType = 'STATUS_APPROVAL';
    } else if (decision.action === 'MODIFY') {
      newStatus = 'Modified';
      actionType = 'PRIORITY_OVERRIDE';
      if (decision.assignedPriority !== undefined) {
        cluster.humanAssignedPriority = decision.assignedPriority;
      }
    } else if (decision.action === 'REJECT') {
      newStatus = 'Rejected';
      actionType = 'STATUS_REJECTION';
    } else {
      newStatus = 'Under Investigation';
      actionType = 'NOTE_ADDED';
    }

    if (decision.assignedDepartment) {
      cluster.leadDepartment = decision.assignedDepartment;
    }

    cluster.humanReviewStatus = newStatus;
    cluster.humanReviewerNotes = decision.notes;
    cluster.humanReviewerRole = decision.actorRole;
    cluster.humanReviewedAt = new Date().toISOString();
    cluster.updatedAt = new Date().toISOString();

    const auditEntry: AuditLogEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      actorName: decision.actorName || 'Authorized Officer',
      actorRole: decision.actorRole,
      actionType,
      targetEntityId: cluster.id,
      targetEntityType: 'IssueCluster',
      previousValue: prevStatus,
      newValue: newStatus,
      justificationReason: decision.notes || 'Human review completed through JanNiti Governance Console'
    };

    this.auditLogs.unshift(auditEntry);
    return { cluster, auditEntry };
  }
}

export const governanceEngine = new GovernanceEngine();
