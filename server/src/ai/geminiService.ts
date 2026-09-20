import { GoogleGenerativeAI } from '@google/generative-ai';
import { GapLevel, SentimentType, UrgencyLevel } from '../types';

export interface GeminiAnalysisResult {
  category: string;
  sub_category: string;
  urgency: UrgencyLevel;
  sentiment: SentimentType;
  affected_population: 'High' | 'Medium' | 'Low';
  affected_population_estimate: number;
  infrastructure_gap_level: GapLevel;
  problem_summary: string;
  recommended_action: string;
  detected_language: string;
  translated_text?: string;
  extracted_location?: {
    state?: string;
    district?: string;
    cityOrVillage?: string;
  };
  confidence_score: number;
  is_fallback: boolean;
}

const CATEGORIES = [
  'Road Infrastructure',
  'Water & Sanitation',
  'Drainage & Flood Control',
  'Healthcare & Primary Health',
  'Electricity & Street Lighting',
  'Education & School Infrastructure',
  'Public Safety & Transport',
  'Waste Management & Environment',
  'Digital Connectivity & Telecom'
];

export async function analyzeCitizenRequestWithGemini(
  text: string,
  preferredLanguage?: string,
  locationHint?: { state?: string; district?: string }
): Promise<GeminiAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_gemini_api_key')) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-1.5-flash for fastest, most reliable structured output
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are the core AI intelligence engine for "JanNiti AI", a Digital Public Infrastructure platform for India that processes citizen infrastructure and public works requests.

Understand the following citizen development request, which may be in any Indian language (Hindi, English, Bengali, Marathi, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, etc.) or a mix of languages (Hinglish, etc.).

CITIZEN REQUEST:
"""
${text}
"""

LOCATION CONTEXT (if known): ${locationHint ? JSON.stringify(locationHint) : 'Not specified'}
USER INTERFACE LANGUAGE: ${preferredLanguage || 'auto'}

Analyze the request and return ONLY a valid JSON object matching this exact structure:
{
  "category": "One of: Road Infrastructure, Water & Sanitation, Drainage & Flood Control, Healthcare & Primary Health, Electricity & Street Lighting, Education & School Infrastructure, Public Safety & Transport, Waste Management & Environment, Digital Connectivity & Telecom",
  "sub_category": "Short specific sub-category (e.g., Potholed Road, Broken Pipeline, Waterlogging, No Street Lights, Doctor Shortage)",
  "urgency": "One of: Critical, High, Medium, Low",
  "sentiment": "One of: Urgent, Negative, Neutral, Positive",
  "affected_population": "One of: High, Medium, Low",
  "affected_population_estimate": 25000, // Reasonable estimated number of community members affected (integer)
  "infrastructure_gap_level": "One of: Critical, High, Medium, Low",
  "problem_summary": "Clear, objective 1-2 sentence problem description in English",
  "recommended_action": "Specific 1-2 sentence public works intervention / policy recommendation in English",
  "detected_language": "Detected language code (e.g., Hindi, English, Tamil, Bengali, Marathi, Telugu, Gujarati, Kannada, Malayalam, Punjabi)",
  "translated_text": "High quality English translation / normalization of the citizen's original statement",
  "extracted_location": {
    "state": "State name if mentioned or null",
    "district": "District name if mentioned or null",
    "cityOrVillage": "Village, ward or locality if mentioned or null"
  },
  "confidence_score": 0.95
}
Do not include markdown backticks or any conversational preamble. Return pure JSON.
`;

      const response = await model.generateContent(prompt);
      const rawText = response.response.text().trim();
      
      // Clean backticks if any
      const cleanedJson = rawText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanedJson);

      return {
        category: CATEGORIES.includes(parsed.category) ? parsed.category : mapCategory(parsed.category || text),
        sub_category: parsed.sub_category || 'Public Infrastructure Deficit',
        urgency: (['Critical', 'High', 'Medium', 'Low'].includes(parsed.urgency) ? parsed.urgency : 'High') as UrgencyLevel,
        sentiment: (['Urgent', 'Negative', 'Neutral', 'Positive'].includes(parsed.sentiment) ? parsed.sentiment : 'Negative') as SentimentType,
        affected_population: (['High', 'Medium', 'Low'].includes(parsed.affected_population) ? parsed.affected_population : 'High'),
        affected_population_estimate: Number(parsed.affected_population_estimate) || 18500,
        infrastructure_gap_level: (['Critical', 'High', 'Medium', 'Low'].includes(parsed.infrastructure_gap_level) ? parsed.infrastructure_gap_level : 'High') as GapLevel,
        problem_summary: parsed.problem_summary || text,
        recommended_action: parsed.recommended_action || 'Inspect area and initiate infrastructure improvement plan.',
        detected_language: parsed.detected_language || 'Hindi',
        translated_text: parsed.translated_text || text,
        extracted_location: parsed.extracted_location || {},
        confidence_score: Number(parsed.confidence_score) || 0.94,
        is_fallback: false
      };
    } catch (err) {
      console.warn('Gemini API call failed or encountered rate limit. Falling back to multilingual heuristic engine:', err);
    }
  }

  // Graceful Intelligent Multilingual Fallback Engine
  return fallbackMultilingualAnalysis(text, preferredLanguage, locationHint);
}

function mapCategory(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('road') || lower.includes('सड़क') || lower.includes('मार्ग') || lower.includes('पुल') || lower.includes('bridge') || lower.includes('pothole') || lower.includes('রাস্তা') || lower.includes('சாலை')) return 'Road Infrastructure';
  if (lower.includes('drain') || lower.includes('नाला') || lower.includes('जलभराव') || lower.includes('waterlog') || lower.includes('flood') || lower.includes('water logging')) return 'Drainage & Flood Control';
  if (lower.includes('water') || lower.includes('पानी') || lower.includes('जल') || lower.includes('pipeline') || lower.includes('tap') || lower.includes('নল') || lower.includes('தண்ணீர்') || lower.includes('నీరు')) return 'Water & Sanitation';
  if (lower.includes('health') || lower.includes('hospital') || lower.includes('doctor') || lower.includes('अस्पताल') || lower.includes('स्वास्थ्य') || lower.includes('phc') || lower.includes('மருத்துவமனை')) return 'Healthcare & Primary Health';
  if (lower.includes('light') || lower.includes('electricity') || lower.includes('बिजली') || lower.includes('अंधेरा') || lower.includes('pole') || lower.includes('current') || lower.includes('மின்சாரம்')) return 'Electricity & Street Lighting';
  if (lower.includes('school') || lower.includes('education') || lower.includes('स्कूल') || lower.includes('शिक्षा') || lower.includes('college') || lower.includes('पल्ली')) return 'Education & School Infrastructure';
  if (lower.includes('waste') || lower.includes('garbage') || lower.includes('कचरा') || lower.includes('गंदगी') || lower.includes('dustbin') || lower.includes('குப்பை')) return 'Waste Management & Environment';
  if (lower.includes('safety') || lower.includes('bus') || lower.includes('transport') || lower.includes('cctv') || lower.includes('women') || lower.includes('सुरक्षा') || lower.includes('बस')) return 'Public Safety & Transport';
  if (lower.includes('internet') || lower.includes('tower') || lower.includes('network') || lower.includes('mobile') || lower.includes('टावर')) return 'Digital Connectivity & Telecom';
  return 'Road Infrastructure';
}

function fallbackMultilingualAnalysis(
  text: string,
  preferredLang?: string,
  locationHint?: { state?: string; district?: string }
): GeminiAnalysisResult {
  const category = mapCategory(text);
  const lower = text.toLowerCase();

  let detectedLang = 'Hindi';
  if (/[\u0900-\u097F]/.test(text)) detectedLang = 'Hindi';
  else if (/[\u0B80-\u0BFF]/.test(text)) detectedLang = 'Tamil';
  else if (/[\u0980-\u09FF]/.test(text)) detectedLang = 'Bengali';
  else if (/[\u0C00-\u0C7F]/.test(text)) detectedLang = 'Telugu';
  else if (/[\u0A80-\u0AFF]/.test(text)) detectedLang = 'Gujarati';
  else if (/[\u0C80-\u0CFF]/.test(text)) detectedLang = 'Kannada';
  else if (/[\u0D00-\u0D7F]/.test(text)) detectedLang = 'Malayalam';
  else if (/[\u0A00-\u0A7F]/.test(text)) detectedLang = 'Punjabi';
  else if (/^[A-Za-z0-9\s.,!?'"()-]+$/.test(text)) detectedLang = 'English';
  else if (preferredLang) detectedLang = preferredLang;

  let urgency: UrgencyLevel = 'High';
  if (lower.includes('urgent') || lower.includes('तुरंत') || lower.includes('खतरनाक') || lower.includes('emergency') || lower.includes('हादसा') || lower.includes('danger') || lower.includes('accident')) {
    urgency = 'Critical';
  } else if (lower.includes('barish') || lower.includes('बारिश') || lower.includes('monsoon') || lower.includes('women') || lower.includes('रात') || lower.includes('waterlog') || lower.includes('severe')) {
    urgency = 'High';
  } else if (lower.includes('improve') || lower.includes('सुधार') || lower.includes('चाहिए') || lower.includes('need')) {
    urgency = 'Medium';
  }

  let subCategory = 'Damaged Infrastructure';
  let problemSummary = 'Citizen reports significant infrastructure deficiency causing recurring community disruption.';
  let recommendedAction = 'Conduct on-site engineering audit and schedule prioritized repair work.';

  if (category === 'Road Infrastructure') {
    subCategory = 'Severely Damaged Road & Potholes';
    problemSummary = 'Road surface is heavily damaged with potholes and monsoon vulnerability causing severe transit hazards.';
    recommendedAction = 'Prioritize bituminous road rehabilitation with integrated drainage culverts.';
  } else if (category === 'Drainage & Flood Control') {
    subCategory = 'Severe Monsoon Waterlogging & Blocked Drain';
    problemSummary = 'Inadequate stormwater drainage leads to persistent waterlogging and health hazards during rainfall.';
    recommendedAction = 'Construct pucca underground drainage network and desilt existing stormwater canals.';
  } else if (category === 'Water & Sanitation') {
    subCategory = 'Drinking Water Supply Disruption & Quality Deficit';
    problemSummary = 'Acute shortage of piped potable water supply affecting households daily.';
    recommendedAction = 'Deploy Jal Jeevan Mission pipeline extension and install community RO water filtration unit.';
  } else if (category === 'Healthcare & Primary Health') {
    subCategory = 'Primary Health Centre Deficit & Equipment Shortage';
    problemSummary = 'Local residents face difficulty accessing timely emergency care and maternal health services.';
    recommendedAction = 'Upgrade local sub-centre to functional Ayushman Arogya Mandir with full-time medical officer.';
  } else if (category === 'Electricity & Street Lighting') {
    subCategory = 'Dark Spots & Defective Street Lights';
    problemSummary = 'Absence of operational street lights creates public safety risks, particularly for women and commuters at night.';
    recommendedAction = 'Install solar smart LED street lights across major village/ward corridors.';
  } else if (category === 'Waste Management & Environment') {
    subCategory = 'Open Waste Dumping & Sanitation Hazard';
    problemSummary = 'Accumulated unsegregated municipal solid waste causing foul odor and vector-borne health risks.';
    recommendedAction = 'Establish daily door-to-door waste collection and localized compost processing unit under Swachh Bharat.';
  }

  return {
    category,
    sub_category: subCategory,
    urgency,
    sentiment: urgency === 'Critical' ? 'Urgent' : 'Negative',
    affected_population: 'High',
    affected_population_estimate: urgency === 'Critical' ? 45000 : 22000,
    infrastructure_gap_level: urgency === 'Critical' ? 'Critical' : 'High',
    problem_summary: problemSummary,
    recommended_action: recommendedAction,
    detected_language: detectedLang,
    translated_text: text,
    extracted_location: {
      state: locationHint?.state,
      district: locationHint?.district
    },
    confidence_score: 0.91,
    is_fallback: true
  };
}
