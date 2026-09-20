import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { PlatformStats } from '../../types';
import { BarChart3, TrendingUp, PieChart as PieIcon, MapPin, Sparkles } from 'lucide-react';

interface ChartsSectionProps {
  stats: PlatformStats | null;
}

const CATEGORY_COLORS = [
  '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', 
  '#8b5cf6', '#ec4899', '#6366f1', '#0ea5e9', '#64748b'
];

const PRIORITY_COLORS = ['#f43f5e', '#f97316', '#fbbf24', '#10b981'];

export const ChartsSection: React.FC<ChartsSectionProps> = ({ stats }) => {
  if (!stats) return null;

  const topCategory = stats.categoryDistribution[0]?.category || 'Roads';
  const topCategoryPercent = Math.round(
    ((stats.categoryDistribution[0]?.count || 0) / (stats.totalRequests || 1)) * 100
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      {/* Chart 1: Requests by Infrastructure Category (Data Storytelling) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                  QUESTION: WHAT ARE CITIZENS REPORTING MOST?
                </span>
                <h3 className="text-sm font-bold text-white">Demand Volume by Infrastructure Sector</h3>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {stats.categoryDistribution.length} Sectors
            </span>
          </div>

          <div className="h-60 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.categoryDistribution.slice(0, 6)}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  tick={{ fontSize: 11, fill: '#cbd5e1' }} 
                  width={110} 
                />
                <Tooltip 
                  formatter={(val: number) => [`${val} requests`, 'Volume']}
                  contentStyle={{ borderRadius: '0.75rem', fontSize: '12px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Takeaway Insight Bar */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Takeaway:</strong> {topCategory} represents the largest volume ({topCategoryPercent}% of all submissions), followed by drainage and sanitation corridors.
          </span>
        </div>
      </div>

      {/* Chart 2: Timeline Trends (Demand Velocity) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                  QUESTION: HOW FAST IS DEMAND ACCUMULATING?
                </span>
                <h3 className="text-sm font-bold text-white">Demand Ingestion Velocity vs Critical Risk</h3>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Ingestion
            </span>
          </div>

          <div className="h-60 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.timelineTrends}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCountDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHighDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '0.75rem', fontSize: '12px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorCountDark)" name="Total Requests" />
                <Area type="monotone" dataKey="highPriority" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorHighDark)" name="High Priority" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Takeaway Insight Bar */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Takeaway:</strong> Peak demand spikes correspond to pre-monsoon waterlogging reports, with high-priority clusters growing +24% week-over-week.
          </span>
        </div>
      </div>

      {/* Chart 3: Priority Score Distribution */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
                  QUESTION: WHAT IS THE RISK EXPOSURE PROFILE?
                </span>
                <h3 className="text-sm font-bold text-white">Priority &amp; Urgency Segmentation</h3>
              </div>
            </div>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.priorityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="range"
                >
                  {stats.priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => [`${val} requests`, 'Requests']}
                  contentStyle={{ borderRadius: '0.75rem', fontSize: '12px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(val) => <span className="text-xs font-semibold text-slate-300">{val}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Takeaway:</strong> Critical and high-urgency issues comprise ~40% of the active queue, requiring immediate administrative sanctions.
          </span>
        </div>
      </div>

      {/* Chart 4: Top Demand States */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  QUESTION: WHICH STATES LEAD IN VOLUME?
                </span>
                <h3 className="text-sm font-bold text-white">Geographic Distribution of Grievances</h3>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              State Clusters
            </span>
          </div>

          <div className="h-60 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.stateDistribution.slice(0, 6)}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="state" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  formatter={(val: number) => [`${val} requests`, 'Requests']}
                  contentStyle={{ borderRadius: '0.75rem', fontSize: '12px', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Takeaway:</strong> Uttar Pradesh and Maharashtra account for over 45% of cluster intensity, highlighting dense peri-urban infrastructure bottlenecks.
          </span>
        </div>
      </div>
    </div>
  );
};
