import React, { useEffect, useState } from 'react';
import { 
  AlertCircle, 
  Check, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  FileText, 
  Filter, 
  History, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  Sliders, 
  UserCheck, 
  X, 
  XCircle 
} from 'lucide-react';
import { apiService } from '../services/api';
import { AuditLogEntry, IssueCluster } from '../types';

export const GovernanceAuditPage: React.FC = () => {
  const [clusters, setClusters] = useState<IssueCluster[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<IssueCluster | null>(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'APPROVE' | 'MODIFY' | 'REJECT' | 'INVESTIGATE'>('APPROVE');
  const [officerName, setOfficerName] = useState<string>('Dr. Rajesh Verma, IAS');
  const [officerRole, setOfficerRole] = useState<'Policymaker' | 'Department Officer' | 'Analyst' | 'Administrator'>('Policymaker');
  const [customPriority, setCustomPriority] = useState<number>(85);
  const [assignedDepartment, setAssignedDepartment] = useState<string>('Public Works Department (PWD)');
  const [justificationNotes, setJustificationNotes] = useState<string>('');

  const [searchLog, setSearchLog] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clusterList, logs] = await Promise.all([
        apiService.getClusters(),
        apiService.getAuditLogs()
      ]);
      setClusters(clusterList);
      setAuditLogs(logs);
      if (clusterList.length > 0) {
        setSelectedCluster(clusterList[0]);
      }
    } catch (err) {
      console.error('Failed to load governance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (cluster: IssueCluster, action: 'APPROVE' | 'MODIFY' | 'REJECT' | 'INVESTIGATE') => {
    setSelectedCluster(cluster);
    setActionType(action);
    setCustomPriority(cluster.priorityScore);
    setAssignedDepartment(cluster.leadDepartment);
    setJustificationNotes(
      action === 'APPROVE' 
        ? 'Sanctioned for execution under District Urban Development Plan.' 
        : (action === 'MODIFY' ? 'Priority adjusted based on on-ground demographic vulnerability survey.' : '')
    );
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedCluster) return;

    try {
      const res = await apiService.recordGovernanceDecision({
        clusterId: selectedCluster.id,
        action: actionType,
        actorName: officerName,
        actorRole: officerRole,
        assignedPriority: actionType === 'MODIFY' ? customPriority : undefined,
        assignedDepartment,
        notes: justificationNotes || 'Review completed'
      });

      // Update local state
      setClusters(prev => prev.map(c => c.id === selectedCluster.id ? res.cluster : c));
      setAuditLogs(prev => [res.auditEntry, ...prev]);
      setReviewModalOpen(false);
      setSuccessBanner(`Action recorded for ${selectedCluster.id} and added to Immutable Audit Log.`);
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err) {
      console.error('Failed to record review:', err);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = !searchLog || 
      log.targetEntityId.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.justificationReason.toLowerCase().includes(searchLog.toLowerCase());
    const matchesRole = filterRole === 'All' || log.actorRole.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  HUMAN-IN-THE-LOOP GOVERNANCE CONSOLE
                </span>
                <span className="text-xs text-slate-400">Accountability & Override Integrity</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Review Console, Sanctions & Audit Log
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                AI proposes recommendations; constitutionally empowered human officers retain complete sanction, modification, and override control.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {successBanner && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            {successBanner}
          </div>
        )}

        {/* SECTION 1: PENDING / ACTIVE ISSUE CLUSTER REVIEWS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Executive Review Feed</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                AI Recommendations Awaiting Administrative Action
              </h2>
            </div>
            <span className="text-xs text-slate-500">{clusters.length} total active issue clusters</span>
          </div>

          <div className="space-y-3">
            {clusters.slice(0, 6).map(cluster => (
              <div
                key={cluster.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-white">
                      {cluster.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {cluster.category}
                    </span>
                    <span className="text-xs text-slate-600">{cluster.district}, {cluster.state}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cluster.humanReviewStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      (cluster.humanReviewStatus === 'Modified' ? 'bg-amber-100 text-amber-800' :
                      (cluster.humanReviewStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'))
                    }`}>
                      Status: {cluster.humanReviewStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{cluster.title}</h3>
                  <div className="text-xs text-slate-500">
                    Lead: <strong className="text-slate-700">{cluster.leadDepartment}</strong> • Est: <strong>₹{cluster.estimatedCostCrores} Cr</strong> • Reach: <strong>~{cluster.affectedPopulation.toLocaleString()} citizens</strong>
                  </div>

                  {cluster.humanAssignedPriority && (
                    <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 inline-block mt-1">
                      <strong>Human Override Priority:</strong> {cluster.humanAssignedPriority}/100 (AI baseline was {cluster.priorityScore}/100) — Note: <em>"{cluster.humanReviewerNotes}"</em>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenReview(cluster, 'APPROVE')}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleOpenReview(cluster, 'MODIFY')}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-all flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Override / Modify
                  </button>

                  <button
                    onClick={() => handleOpenReview(cluster, 'REJECT')}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-all flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: IMMUTABLE AUDIT LOG */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-700" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  Government Decision Audit Log
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tamper-evident record of all human approvals, priority overrides, and departmental assignments.
              </p>
            </div>

            {/* Log Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Policymaker">Policymaker</option>
                <option value="Department Officer">Department Officer</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Authorized Actor</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Previous → New State</th>
                  <th className="py-3 px-4">Official Justification / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block">{log.actorName}</strong>
                      <span className="text-[10px] text-indigo-700 font-semibold">{log.actorRole}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{log.targetEntityId}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {log.previousValue || 'N/A'} → <strong className="text-slate-900">{log.newValue}</strong>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">{log.justificationReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HUMAN REVIEW & OVERRIDE MODAL */}
      {reviewModalOpen && selectedCluster && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Official Action</span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {actionType === 'APPROVE' ? 'Sanction AI Recommendation' : (actionType === 'MODIFY' ? 'Human Override & Parameter Tuning' : 'Reject Proposal')}
                </h3>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">{selectedCluster.title}</div>
                <div className="text-slate-500 mt-0.5">Cluster ID: {selectedCluster.id} • AI Priority: {selectedCluster.priorityScore}/100</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Officer Name:</label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Designation:</label>
                  <select
                    value={officerRole}
                    onChange={(e) => setOfficerRole(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Policymaker">Policymaker (IAS / Secretary)</option>
                    <option value="Department Officer">Department Officer (PWD / Jal Sansthan)</option>
                    <option value="Analyst">Public Policy Analyst</option>
                    <option value="Administrator">District Administrator</option>
                  </select>
                </div>
              </div>

              {actionType === 'MODIFY' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex justify-between font-bold text-amber-950">
                    <span>Adjust Priority Score:</span>
                    <span>{customPriority} / 100</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={100}
                    value={customPriority}
                    onChange={(e) => setCustomPriority(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <p className="text-[11px] text-amber-800">
                    * AI baseline score ({selectedCluster.priorityScore}/100) will be preserved in audit records.
                  </p>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Lead Department:</label>
                <input
                  type="text"
                  value={assignedDepartment}
                  onChange={(e) => setAssignedDepartment(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mandatory Justification / Rationale Notes:</label>
                <textarea
                  rows={3}
                  value={justificationNotes}
                  onChange={(e) => setJustificationNotes(e.target.value)}
                  placeholder="Enter official reason for this administrative decision..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
              >
                Commit Decision to Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
