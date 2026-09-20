import React from 'react';
import { Shield, Sparkles, Database, ExternalLink, Heart, Building2 } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: 'citizen' | 'policymaker' | 'datasources' | 'responsibleai') => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 mt-20 pt-14 pb-8 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Brand */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-gov-700 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-4 h-4 text-cyan-200" />
              </div>
              <span className="font-heading font-black text-white text-lg tracking-tight">
                JanNiti<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                DPG India
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An AI-powered Digital Public Good turning citizen development requests across 10+ Indian languages into evidence-backed infrastructure projects for policymakers.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Powered by Google Gemini 1.5 Flash</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3.5">Platform Portals</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onTabChange('citizen')}
                  className="hover:text-cyan-300 transition text-slate-400 font-medium"
                >
                  Citizen Multilingual Submission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('policymaker')}
                  className="hover:text-cyan-300 transition text-slate-400 font-medium"
                >
                  Policymaker Decision Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('datasources')}
                  className="hover:text-cyan-300 transition text-slate-400 font-medium"
                >
                  Public Open Data Registers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('responsibleai')}
                  className="hover:text-cyan-300 transition text-slate-400 font-medium"
                >
                  Ethics, Privacy &amp; AI Governance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: National Alignment */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3.5">National Missions</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>PM Gati Shakti National Master Plan</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Jal Jeevan Mission (Har Ghar Jal)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>PMGSY-IV (Rural Road Pavement)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>AMRUT 2.0 (Drainage &amp; Water)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Trust &amp; Integrity</h4>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Advisory Decision Support</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Designed for integration with government open-data and public infrastructure systems. Final administrative approvals rest with designated authorities.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JanNiti AI — Digital Public Infrastructure Platform. Open Source DPG Architecture.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-cyan-300 cursor-pointer" onClick={() => onTabChange('responsibleai')}>
              Privacy Policy (Zero PII)
            </span>
            <span>•</span>
            <span className="hover:text-cyan-300 cursor-pointer" onClick={() => onTabChange('datasources')}>
              data.gov.in Attribution
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
