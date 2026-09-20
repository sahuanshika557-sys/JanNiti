import React, { useState, useEffect } from 'react';
import { 
  Building2, Mic, Sparkles, CheckCircle2, ShieldCheck, 
  MapPin, HelpCircle, ArrowRight, HeartHandshake, Eye, Zap, Flame, Radio,
  Droplets, Lightbulb, Stethoscope, GraduationCap, Waves
} from 'lucide-react';
import { CitizenForm } from '../components/citizen/CitizenForm';
import { MyRequestsList } from '../components/citizen/MyRequestsList';
import { TRANSLATIONS } from '../i18n/translations';
import { apiService } from '../services/api';
import { CitizenRequest, SupportedLanguage } from '../types';

import { VideoHeroBanner } from '../components/media/VideoHeroBanner';
import { MultilingualStoryVideo } from '../components/media/MultilingualStoryVideo';

interface CitizenPortalProps {
  currentLanguage: SupportedLanguage;
  onSwitchToPolicymaker: () => void;
}

const VISUAL_CATEGORIES = [
  {
    name: 'Road Infrastructure',
    hindiName: 'सड़क एवं पुल निर्माण',
    scheme: 'PMGSY-IV',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    sampleText: 'हमारे गांव की मुख्य सड़क गड्ढों से भरी है और बारिश में पूरी तरह टूट जाती है।'
  },
  {
    name: 'Water & Sanitation',
    hindiName: 'पेयजल एवं जल जीवन मिशन',
    scheme: 'Jal Jeevan Mission',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    sampleText: 'गांव में पीने के पानी की पाइपलाइन टूटी है और पिछले 3 हफ्तों से साफ पानी नहीं आ रहा है।'
  },
  {
    name: 'Drainage & Flood Control',
    hindiName: 'नाली एवं जलभराव नियंत्रण',
    scheme: 'AMRUT 2.0',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80',
    sampleText: 'मुख्य नाला जाम होने के कारण बारिश में घरों में गंदा पानी भर जाता है।'
  },
  {
    name: 'Electricity & Street Lights',
    hindiName: 'सोलर स्ट्रीट लाइट व बिजली',
    scheme: 'National Street Lighting',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    sampleText: 'गांव के मुख्य मार्ग पर स्ट्रीट लाइट नहीं है, रात में अंधेरे के कारण महिलाओं की सुरक्षा का खतरा रहता है।'
  },
  {
    name: 'Healthcare & PHC',
    hindiName: 'प्राथमिक स्वास्थ्य केंद्र',
    scheme: 'Ayushman Arogya Mandir',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    sampleText: 'हमारे प्राथमिक स्वास्थ्य केंद्र में डॉक्टर और आपातकालीन दवाइयों की भारी कमी है।'
  },
  {
    name: 'Education Infrastructure',
    hindiName: 'स्कूल भवन एवं बालिका शौचालय',
    scheme: 'Samagra Shiksha',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    sampleText: 'सरकारी प्राथमिक विद्यालय की छत से पानी टपकता है और बालिकाओं के लिए अलग शौचालय नहीं है।'
  }
];

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  currentLanguage,
  onSwitchToPolicymaker
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [localRequests, setLocalRequests] = useState<CitizenRequest[]>([]);
  const [prefilledText, setPrefilledText] = useState<string>('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const history = apiService.getLocalHistory();
    setLocalRequests(history);
  }, []);

  const handleNewRequest = (req: CitizenRequest) => {
    setLocalRequests((prev) => [req, ...prev]);
  };

  const handleSelectVisualCategory = (sample: string) => {
    setPrefilledText(sample);
    const formElement = document.getElementById('citizen-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Video Hero Banner with Live Ambient Motion & Radar Telemetry */}
      <VideoHeroBanner
        tagline={t.tagline}
        onOpenVideoTour={() => setIsVideoModalOpen(true)}
        onSwitchToPolicymaker={onSwitchToPolicymaker}
      />

      {/* Multilingual Story Video Modal */}
      <MultilingualStoryVideo
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        initialLanguage={currentLanguage}
        onNavigateToTab={onSwitchToPolicymaker}
      />

      {/* Visual Category Selector Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-black text-slate-900">
              Select Infrastructure Category to Report
            </h3>
            <p className="text-xs text-slate-500">
              Click any photo category below to instantly populate and submit your demand.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-gov-100 text-gov-800 border border-gov-200">
            6 Priority Domains
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {VISUAL_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectVisualCategory(cat.sampleText)}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-gov-500 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between"
            >
              <div className="relative h-28 w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded bg-slate-950/80 text-white backdrop-blur-sm">
                  {cat.scheme}
                </span>
              </div>

              <div className="p-3 space-y-1">
                <h4 className="text-xs font-black text-slate-900 group-hover:text-gov-700 transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {cat.hindiName}
                </p>
                <div className="pt-2 text-[10px] font-bold text-gov-700 flex items-center gap-1">
                  <span>Report Demand</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Step Interactive Pipeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            step: '01',
            title: 'Speak or Type',
            desc: 'Voice STT in 10 Indian languages with real-time audio waveform transcription.',
            badge: 'Multilingual Voice',
            color: 'from-blue-600 to-gov-700'
          },
          {
            step: '02',
            title: 'Gemini AI Extraction',
            desc: 'Instant structured classification of category, urgency, and deficit level.',
            badge: 'Structured JSON',
            color: 'from-purple-600 to-indigo-700'
          },
          {
            step: '03',
            title: 'Priority & Hotspot',
            desc: 'Transparent 6-factor scoring (0-100) and geospatial corridor clustering.',
            badge: 'Explainable AI',
            color: 'from-amber-500 to-orange-600'
          },
          {
            step: '04',
            title: 'Policy Sanction',
            desc: 'Evidence dossiers connected directly to PM Gati Shakti & Jal Jeevan Mission.',
            badge: 'Capital Budgeting',
            color: 'from-emerald-600 to-teal-700'
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 text-left space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg bg-gradient-to-r ${item.color} text-white shadow-sm`}>
                STEP {item.step}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.badge}</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 mt-2">
              {item.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Main Submission Form & Tracker Grid */}
      <div id="citizen-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Card */}
        <div className="lg:col-span-7">
          <CitizenForm
            currentLanguage={currentLanguage}
            onRequestSubmitted={handleNewRequest}
            initialText={prefilledText}
          />
        </div>

        {/* My Requests Tracker & Decision Callout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
            <MyRequestsList
              requests={localRequests}
              currentLanguage={currentLanguage}
            />
          </div>

          {/* Policymaker Callout Card */}
          <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-gov-800 to-gov-950 text-white shadow-xl space-y-3.5 overflow-hidden">
            <div className="flex items-center gap-2 text-cyan-300">
              <Eye className="w-5 h-5 animate-pulse" />
              <h3 className="font-heading font-black text-sm uppercase tracking-wider">Government Decision Dashboard</h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              Experience how incoming citizen demands dynamically calculate demand hotspots, simulate infrastructure failure risks, and formulate capital works proposals.
            </p>
            <button
              onClick={onSwitchToPolicymaker}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-gov-900 font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Policymaker Heatmap Dashboard</span>
              <ArrowRight className="w-4 h-4 text-gov-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
