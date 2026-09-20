import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Send, Sparkles, MapPin, CheckCircle2, AlertTriangle, 
  HelpCircle, ChevronDown, ChevronUp, Image as ImageIcon,
  Compass, RefreshCw, Volume2, ShieldCheck, Flame, Radio, Activity, Mic
} from 'lucide-react';
import { TRANSLATIONS } from '../../i18n/translations';
import { apiService, AnalysisResponse } from '../../services/api';
import { CitizenRequest, SupportedLanguage } from '../../types';
import { AudioReadout } from '../voice/AudioReadout';
import { VoiceInput } from '../voice/VoiceInput';

interface CitizenFormProps {
  currentLanguage: SupportedLanguage;
  onRequestSubmitted: (newReq: CitizenRequest) => void;
  initialText?: string;
}

const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  'Uttar Pradesh': ['Lucknow', 'Kanpur Nagar', 'Varanasi', 'Prayagraj', 'Agra', 'Gorakhpur', 'Meerut', 'Ghaziabad', 'Aligarh'],
  'Maharashtra': ['Pune', 'Thane', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar', 'Solapur', 'Kolhapur'],
  'Bihar': ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Begusarai'],
  'Tamil Nadu': ['Madurai', 'Coimbatore', 'Chennai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode'],
  'West Bengal': ['North 24 Parganas', 'Murshidabad', 'Kolkata', 'Howrah', 'South 24 Parganas', 'Hooghly'],
  'Karnataka': ['Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Belagavi', 'Mangaluru', 'Davanagere'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Alwar'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
  'Kerala': ['Wayanad', 'Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur', 'Malappuram'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda']
};

const DISTRICT_COORDS: Record<string, [number, number]> = {
  'Lucknow': [26.8467, 80.9462],
  'Kanpur Nagar': [26.4499, 80.3319],
  'Varanasi': [25.3176, 82.9739],
  'Prayagraj': [25.4358, 81.8463],
  'Pune': [18.5204, 73.8567],
  'Thane': [19.2183, 72.9781],
  'Nagpur': [21.1458, 79.0882],
  'Patna': [25.5941, 85.1376],
  'Muzaffarpur': [26.1209, 85.3647],
  'Madurai': [9.9252, 78.1198],
  'Coimbatore': [11.0168, 76.9558],
  'North 24 Parganas': [22.7234, 88.4811],
  'Bengaluru Urban': [12.9716, 77.5946],
  'Jaipur': [26.9124, 75.7873],
  'Ahmedabad': [23.0225, 72.5714],
  'Wayanad': [11.6854, 76.1320],
  'Hyderabad': [17.3850, 78.4867],
  'Ludhiana': [30.9010, 75.8573]
};

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Damaged Potholes', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60' },
  { label: 'Monsoon Waterlogging', url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&auto=format&fit=crop&q=60' },
  { label: 'Dark Night Corridor', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=60' },
  { label: 'Leaking Pipeline', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop&q=60' }
];

export const CitizenForm: React.FC<CitizenFormProps> = ({
  currentLanguage,
  onRequestSubmitted,
  initialText = ''
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const [text, setText] = useState<string>(initialText);
  const [state, setState] = useState<string>('Uttar Pradesh');
  const [district, setDistrict] = useState<string>('Lucknow');
  const [locality, setLocality] = useState<string>('Alambagh Ward 12');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  // Real-time AI preview state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [showReasoning, setShowReasoning] = useState<boolean>(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<CitizenRequest | null>(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    if (!text || text.trim().length < 8) {
      setAnalysisResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const res = await apiService.analyzeRequest(text, currentLanguage, { state, district });
        setAnalysisResult(res);
      } catch (err) {
        console.warn('Live preview analysis skipped:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [text, currentLanguage, state, district]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    const coords = DISTRICT_COORDS[district] || [26.8467, 80.9462];

    try {
      const response = await apiService.submitRequest({
        text: text.trim(),
        language: currentLanguage,
        location: {
          state,
          district,
          subDistrict: locality,
          cityOrVillage: locality,
          latitude: coords[0] + (Math.random() - 0.5) * 0.02,
          longitude: coords[1] + (Math.random() - 0.5) * 0.02,
          address: `${locality}, ${district}, ${state}`
        },
        anonymous: isAnonymous,
        imageUri: selectedImage || undefined
      });

      if (response && response.requestId) {
        setSubmittedReceipt(response);
        onRequestSubmitted(response);

        // Confetti celebration
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setText('');
    setAnalysisResult(null);
    setSubmittedReceipt(null);
    setSelectedImage(null);
  };

  if (submittedReceipt) {
    return (
      <div className="bg-white rounded-3xl border border-emerald-300 shadow-xl p-6 sm:p-8 animate-fade-in text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
          ✓ Verified Digital Submission
        </span>

        <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
          {t.requestSubmittedSuccess}
        </h3>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-bold text-slate-600">Request Tracking ID</span>
            <span className="text-sm font-mono font-black text-gov-800 bg-gov-100 px-3 py-1 rounded-lg border border-gov-300">
              {submittedReceipt.requestId}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Category Extracted</span>
            <span className="font-extrabold text-slate-900">{submittedReceipt.category}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Urgency Level</span>
            <span className={`font-black px-2.5 py-0.5 rounded ${
              submittedReceipt.urgency === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
              submittedReceipt.urgency === 'High' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 
              'bg-blue-100 text-blue-900 border border-blue-200'
            }`}>
              {submittedReceipt.urgency}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Transparent Priority Score</span>
            <span className="font-black text-gov-800 text-base">
              {submittedReceipt.priorityScore}/100
            </span>
          </div>

          <div className="pt-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-gov-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gov-600" />
              <span>AI Problem Summary:</span>
            </div>
            <p className="italic text-slate-800 font-medium">"{submittedReceipt.problemSummary}"</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-8 py-3 rounded-xl bg-gov-700 hover:bg-gov-800 text-white text-xs font-black transition shadow-md"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 text-left">
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
              {t.submitDemandTitle}
            </h2>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Voice + Text Active
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            {t.submitDemandSub}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Voice Input */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-gov-600" />
            <span>1. Multilingual Voice Input (10 Indian Languages)</span>
          </label>
          <VoiceInput
            currentLanguage={currentLanguage}
            onTranscriptChange={(val) => setText((prev) => (prev ? `${prev} ${val}` : val))}
          />
        </div>

        {/* Step 2: Text Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
              2. Describe or Edit Request Statement
            </label>
            {isAnalyzing && (
              <span className="flex items-center gap-1.5 text-xs text-gov-600 font-bold animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                {t.analyzing}
              </span>
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.enterTextPlaceholder}
            rows={3}
            required
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:bg-white focus:border-gov-500 focus:ring-2 focus:ring-gov-200 shadow-inner resize-y transition font-medium"
          />
        </div>

        {/* Step 3: Optional Photo Evidence Attachment */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            3. Optional Photo Evidence Attachment
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(selectedImage === preset.url ? null : preset.url)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  selectedImage === preset.url
                    ? 'bg-gov-50 border-gov-500 text-gov-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-gov-600" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          {selectedImage && (
            <div className="mt-2.5 relative inline-block rounded-xl overflow-hidden border-2 border-gov-500 shadow-md">
              <img src={selectedImage} alt="Uploaded evidence" className="h-28 w-auto object-cover" />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-1 right-1 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-md hover:bg-red-600 transition font-bold"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Step 4: Geography Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">State / UT</label>
            <select
              value={state}
              onChange={(e) => {
                const newState = e.target.value;
                setState(newState);
                const firstDistrict = INDIAN_STATES_DISTRICTS[newState]?.[0] || 'Lucknow';
                setDistrict(firstDistrict);
              }}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-gov-400"
            >
              {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-gov-400"
            >
              {(INDIAN_STATES_DISTRICTS[state] || ['Lucknow']).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ward / Locality / Village</label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Ward 14 / Gomti Nagar"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-gov-400"
            />
          </div>
        </div>

        {/* Real-time Gemini Structured Extraction Preview */}
        {analysisResult && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-gov-50/70 border border-gov-300 shadow-md space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gov-200 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-gov-900">
                <Sparkles className="w-4 h-4 text-gov-600" />
                <span>Google Gemini AI Structured Extraction</span>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gov-100 text-gov-800 border border-gov-200">
                  {analysisResult.aiAnalysis.detected_language} Detected
                </span>
              </div>
              <AudioReadout
                text={`${analysisResult.aiAnalysis.problem_summary}. Recommended action: ${analysisResult.aiAnalysis.recommended_action}`}
                language={currentLanguage}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-white rounded-xl border border-gov-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Category</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block">{analysisResult.aiAnalysis.category}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gov-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Urgency</span>
                <span className={`font-black mt-0.5 block ${
                  analysisResult.aiAnalysis.urgency === 'Critical' ? 'text-red-700' :
                  analysisResult.aiAnalysis.urgency === 'High' ? 'text-amber-800' : 'text-blue-800'
                }`}>
                  {analysisResult.aiAnalysis.urgency}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gov-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Infra Deficit</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block">{analysisResult.aiAnalysis.infrastructure_gap_level}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gov-200 shadow-sm">
                <span className="text-[10px] text-gov-700 font-bold block uppercase">Priority Score</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-black text-gov-800 text-lg">
                    {analysisResult.priorityScore}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">/100</span>
                </div>
              </div>
            </div>

            {/* Summary & Recommendations */}
            <div className="text-xs bg-white p-3.5 rounded-xl border border-gov-200 space-y-1.5 shadow-sm">
              <p className="text-slate-800">
                <strong className="text-gov-900">Problem Summary:</strong> {analysisResult.aiAnalysis.problem_summary}
              </p>
              <p className="text-emerald-800">
                <strong>Recommended Action:</strong> {analysisResult.aiAnalysis.recommended_action}
              </p>
            </div>

            {/* Transparent Priority Accordion */}
            <div className="border-t border-gov-200 pt-2.5">
              <button
                type="button"
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center justify-between w-full text-xs font-black text-gov-900 hover:text-gov-700"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-gov-600" />
                  {t.whyPriority} ({analysisResult.priorityScore}/100)
                </span>
                {showReasoning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showReasoning && (
                <div className="mt-2.5 text-xs space-y-2 bg-white p-4 rounded-xl border border-gov-200 text-slate-800 shadow-sm animate-fade-in">
                  <div className="grid grid-cols-3 gap-2 text-[11px] pb-2.5 border-b border-slate-100 font-semibold">
                    <div>Urgency: <strong className="text-gov-700">{analysisResult.scoreBreakdown.urgency}/30</strong></div>
                    <div>Affected Pop: <strong className="text-gov-700">{analysisResult.scoreBreakdown.affectedPopulation}/20</strong></div>
                    <div>Infra Gap: <strong className="text-gov-700">{analysisResult.scoreBreakdown.infrastructureGap}/15</strong></div>
                    <div>Vulnerability: <strong className="text-gov-700">{analysisResult.scoreBreakdown.demographicVulnerability}/15</strong></div>
                    <div>Density: <strong className="text-gov-700">{analysisResult.scoreBreakdown.geographicConcentration}/10</strong></div>
                    <div>Impact: <strong className="text-gov-700">{analysisResult.scoreBreakdown.publicImpact}/10</strong></div>
                  </div>
                  <ul className="space-y-1">
                    {analysisResult.scoreBreakdown.reasons.map((r, i) => (
                      <li key={i} className="text-emerald-800 font-bold text-[11px]">• {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Privacy Checkbox & Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-slate-300 text-gov-600 focus:ring-gov-400"
            />
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Anonymous Submission (Zero Personal Identity / Aadhaar Required)
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-gradient-to-r from-gov-700 to-gov-900 hover:from-gov-800 hover:to-slate-900 text-white text-xs font-black transition-all shadow-md shadow-gov-700/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 uppercase tracking-wider"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.submitting}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.submitBtn}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
