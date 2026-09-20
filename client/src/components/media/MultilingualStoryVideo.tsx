import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Globe2, 
  Sparkles, 
  Radio, 
  Activity, 
  Layers, 
  Compass, 
  Sliders, 
  CheckCircle2, 
  MapPin, 
  X, 
  ChevronRight, 
  ExternalLink,
  Cpu,
  Building2,
  TrendingUp,
  ShieldCheck,
  Eye,
  Flame,
  Award
} from 'lucide-react';
import { LANGUAGES } from '../../i18n/translations';
import { SupportedLanguage } from '../../types';

interface MultilingualStoryVideoProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: SupportedLanguage;
  onNavigateToTab?: (tab: any) => void;
}

interface StoryScene {
  id: number;
  stageNumber: string;
  duration: number; // in seconds
  audioText: Record<SupportedLanguage, string>;
  title: Record<SupportedLanguage, string>;
  subtitle: Record<SupportedLanguage, string>;
  keyHighlight: Record<SupportedLanguage, string>;
  visualScene: 'voice_input' | 'multimodal_ai' | 'issue_clustering' | 'evidence_fusion' | 'policy_simulation' | 'impact_verification';
}

const STORY_SCENES: StoryScene[] = [
  {
    id: 1,
    stageNumber: '01 / 06',
    duration: 7,
    title: {
      hi: 'चरण 1: नागरिक की आवाज़ एवं बहुभाषी इनपुट',
      en: 'Scene 1: Grassroots Citizen Voice & Multilingual Input',
      bn: 'দৃশ্য ১: তৃণমূল নাগরিকের কণ্ঠ ও বহুভাষিক ইনপুট',
      mr: 'दृश्य १: नागरिकांचा आवाज आणि बहुभाषिक इनपुट',
      ta: 'காட்சி 1: குடிமக்கள் குரல் மற்றும் பலமொழி உள்ளீடு',
      te: 'దృశ్యం 1: పౌరుల స్వరం మరియు బహుభాషా ఇన్‌పుట్',
      gu: 'દ્રશ્ય ૧: નાગરિકનો અવાજ અને બહુભાષી ઇનપુટ',
      kn: 'ದೃಶ್ಯ ೧: ನಾಗರಿಕರ ಧ್ವನಿ ಮತ್ತು ಬಹುಭಾಷಾ ಇನ್‌ಪುಟ್',
      ml: 'രംഗം 1: പൗരന്മാരുടെ ശബ്ദവും ബഹുഭാഷാ ഇൻപുട്ടും',
      pa: 'ਦ੍ਰਿਸ਼ 1: ਨਾਗਰਿਕਾਂ ਦੀ ਆਵਾਜ਼ ਅਤੇ ਬਹੁ-ਭਾਸ਼ਾਈ ਇਨਪੁਟ'
    },
    subtitle: {
      hi: 'नागरिक अपनी मातृभाषा (हिन्दी/तमिल/मराठी) में सड़क और जलभराव की समस्या बोलते हैं।',
      en: 'A citizen speaks in their native tongue describing severe monsoon road inundation.',
      bn: 'নাগরিক তাদের মাতৃভাষায় রাস্তার ক্ষতি ও জল জমার সমস্যা জানান।',
      mr: 'नागरिक आपल्या मातृभाषेत रस्ता आणि पाणी साचण्याची समस्या सांगतात.',
      ta: 'குடிமக்கள் தங்கள் தாய்மொழியில் சாலை சேதம் மற்றும் வெள்ள பாதிப்பை கூறுகிறார்கள்.',
      te: 'పౌరులు తమ మాతృభాషలో రహదారి సమస్య మరియు నీటి నిల్వను నివేదిస్తారు.',
      gu: 'નાગરિક પોતાની માતૃભાષામાં રસ્તાના ખાડા અને પાણી ભરાવાની સમસ્યા જણાવે છે.',
      kn: 'ನಾಗರಿಕರು ತಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ರಸ್ತೆ ಗುಂಡಿ ಮತ್ತು ನೀರಿನ ಸಮಸ್ಯೆಯನ್ನು ತಿಳಿಸುತ್ತಾರೆ.',
      ml: 'പൗരന്മാർ മാതൃഭാഷയിൽ റോഡ് തകർച്ചയും വെള്ളക്കെട്ടും അറിയിക്കുന്നു.',
      pa: 'ਨਾਗਰਿਕ ਆਪਣੀ ਮਾਤ ਭਾਸ਼ਾ ਵਿੱਚ ਸੜਕ ਟੁੱਟਣ ਅਤੇ ਪਾਣੀ ਭਰਨ ਦੀ ਸਮੱਸਿਆ ਦੱਸਦੇ ਹਨ।'
    },
    audioText: {
      hi: 'नागरिक पोर्टल पर अपनी भाषा में बोलते हैं। गूगल स्पीच और जेमिनी एआई उनकी आवाज़ को तुरंत समझकर श्रेणीबद्ध करता है।',
      en: 'Citizens speak in their native dialect. Google Cloud Speech and Gemini AI transcribe and extract structured infrastructure categories in real time.',
      bn: 'নাগরিকরা নিজস্ব ভাষায় কথা বলেন। গুগল স্পিচ এবং জেমিনি এআই তাদের দাবি বিশ্লেষণ করে।',
      mr: 'नागरिक आपल्या भाषेत बोलतात. गुगल स्पीच आणि जेमिनी एआय तात्काळ मागणी समजून घेतात.',
      ta: 'குடிமக்கள் தங்கள் மொழியில் பேசுகிறார்கள். கூகிள் ஜெமினி ஏஐ அதை உடனடியாக புரிந்துகொள்கிறது.',
      te: 'పౌరులు తమ భాషలో మాట్లాడతారు. గూగుల్ జెమిని ఏఐ తక్షణమే విశ్లేషిస్తుంది.',
      gu: 'નાગરિકો પોતાની ભાષામાં બોલે છે. ગુગલ જેમિની એઆઈ તરત જ તેનું વિશ્લેષણ કરે છે.',
      kn: 'ನಾಗರಿಕರು ತಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡುತ್ತಾರೆ. ಗೂಗಲ್ ಜೆಮಿನಿ ಎಐ ತಕ್ಷಣವೇ ವರ್ಗೀಕರಿಸುತ್ತದೆ.',
      ml: 'പൗരന്മാർ സ്വന്തം ഭാഷയിൽ സംസാരിക്കുന്നു. ഗൂഗിൾ ജെമിനി എഐ ഇത് തത്സമയം വിശകലനം ചെയ്യുന്നു.',
      pa: 'ਨਾਗਰਿਕ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲਦੇ ਹਨ। ਗੂਗਲ ਜੈਮਿਨੀ ਏਆਈ ਇਸ ਦਾ ਤੁਰੰਤ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ।'
    },
    keyHighlight: {
      hi: '10 भारतीय भाषाएं • 96% सटीकता • वॉइस-फर्स्ट डिजिटल पब्लिक गुड',
      en: '10 Indian Languages • 96% STT Accuracy • Voice-First DPI',
      bn: '১০টি ভারতীয় ভাষা • ভয়েস ফার্স্ট ডিজিটাল পাবলিক গুড',
      mr: '१० भारतीय भाषा • व्हॉईस-फर्स्ट डिजिटल पब्लिक गुड',
      ta: '10 இந்திய மொழிகள் • குரல் வழி டிஜிட்டல் பொது சேவை',
      te: '10 భారతీయ భాషలు • వాయిస్-ఫస్ట్ డిజిటల్ పబ్లిక్ గుడ్',
      gu: '૧૦ ભારતીય ભાષાઓ • વોઈસ-ફર્સ્ટ ડિજિટલ પબ્લિક ગુડ',
      kn: '೧೦ ಭಾರತೀಯ ಭಾಷೆಗಳು • ವಾಯ್ಸ್-ಫಸ್ಟ್ ಡಿಜಿಟಲ್ ಪಬ್ಲಿಕ್ ಗುಡ್',
      ml: '10 ഇന്ത്യൻ ഭാഷകൾ • വോയ്സ് ഫസ്റ്റ് ഡിജിറ്റൽ പൊതുസേവനം',
      pa: '10 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ • ਵਾਇਸ-ਫਸਟ ਡਿਜੀਟਲ ਪਬਲਿਕ ਗੁੱਡ'
    },
    visualScene: 'voice_input'
  },
  {
    id: 2,
    stageNumber: '02 / 06',
    duration: 7,
    title: {
      hi: 'चरण 2: मल्टीमॉडल जेमिनी एआई विश्लेषण एवं विज़ुअल डैमेज स्कैन',
      en: 'Scene 2: Multimodal Gemini AI Understanding & Visual Damage Scan',
      bn: 'দৃশ্য ২: মাল্টিমোডাল জেমিনি এআই বিশ্লেষণ',
      mr: 'दृश्य २: मल्टीमॉडल जेमिनी एआय विश्लेषण',
      ta: 'காட்சி 2: மல்டிமாடல் ஜெமினி ஏஐ காட்சி பகுப்பாய்வு',
      te: 'దృశ్యం 2: మల్టీమోడల్ జెమిని ఏఐ దృశ్య విశ్లేషణ',
      gu: 'દ્રશ્ય ૨: મલ્ટિમોડલ જેમિની એઆઈ વિશ્લેષણ',
      kn: 'ದೃಶ್ಯ ೨: ಮಲ್ಟಿಮೋಡಲ್ ಜೆಮಿನಿ ಎಐ ದೃಶ್ಯ ವಿಶ್ಲೇಷಣೆ',
      ml: 'രംഗം 2: മൾട്ടിമോഡൽ ജെമിനി എഐ വിശകലനം',
      pa: 'ਦ੍ਰਿਸ਼ 2: ਮਲਟੀਮੋਡਲ ਜੈਮਿਨੀ ਏਆਈ ਵਿਸ਼ਲੇਸ਼ਣ'
    },
    subtitle: {
      hi: 'अपलोड की गई सड़क फोटो से गड्ढों और जलभराव का कंप्यूटर विज़न से स्वचालित मूल्यांकन।',
      en: 'Computer vision extracts pothole severity, sub-base erosion, and water accumulation from user photos.',
      bn: 'ব্যবহারকারীর ছবি থেকে রাস্তার গর্ত ও জমা জলের গভীরতা স্বয়ংক্রিয়ভাবে সনাক্ত করা হয়।',
      mr: 'अपलोड केलेल्या फोटोमधून रस्त्यावरील खड्डे आणि पाण्याचे प्रमाण तपासले जाते.',
      ta: 'புகைப்படங்களிலிருந்து சாலை பள்ளங்கள் மற்றும் நீர் தேக்கத்தை ஏஐ கண்டறிகிறது.',
      te: 'ఫోటోల నుండి రోడ్డు గుంతలు మరియు నీటి నిల్వను ఏఐ గుర్తిస్తుంది.',
      gu: 'ફોટોમાંથી રસ્તાના ખાડા અને પાણી ભરાવાની સ્થિતિ ઓળખાય છે.',
      kn: 'ಫೋಟೋಗಳಿಂದ ರಸ್ते ಗುಂಡಿಗಳನ್ನು ಎಐ ಪತ್ತೆ ಮಾಡುತ್ತದೆ.',
      ml: 'ഫോട്ടോകളിൽ നിന്ന് റോഡിലെ കുഴികൾ എഐ കണ്ടെത്തുന്നു.',
      pa: 'ਫੋਟੋਆਂ ਤੋਂ ਸੜਕ ਦੇ ਖੱਡਿਆਂ ਦੀ ਪਛਾਣ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।'
    },
    audioText: {
      hi: 'जेमिनी 1.5 फ़्लैश फ़ोटो और टेक्स्ट का विश्लेषण कर समस्या का मूल कारण और तात्कालिकता रेटिंग तय करता है।',
      en: 'Gemini 1.5 Flash processes photo and text simultaneously, structuring urgency ratings and advisory engineering flags.',
      bn: 'জেমিনি ১.৫ ফ্ল্যাশ ছবি এবং টেক্সট বিশ্লেষণ করে জরুরি রেটিং প্রদান করে।',
      mr: 'जेमिनी १.५ फ्लॅश फोटो आणि मजकूर तपासतात आणि तातडीचे निकष ठरवतात.',
      ta: 'ஜெமினி 1.5 ஃபிளாஷ் புகைப்படம் மற்றும் உரையை ஆராய்ந்து உடனடி நிலையை மதிப்பிடுகிறது.',
      te: 'జెమిని 1.5 ఫ్లాష్ ఫోటో మరియు టెక్స్ట్‌ను విశ్లేషించి ప్రాధాన్యతను నిర్ణయిస్తుంది.',
      gu: 'જેમિની ૧.૫ ફ્લેશ ફોટો અને ટેક્સ્ટ તપાસીને તાકીદનું સ્તર નક્કી કરે છે.',
      kn: 'ಜೆಮಿನಿ ೧.೫ ಫ್ಲ್ಯಾಶ್ ಫೋಟೋ ಮತ್ತು ಪಠ್ಯವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.',
      ml: 'ജെമിനി 1.5 ഫ്ലാഷ് ഫോട്ടോയും വിവരങ്ങളും വിശകലനം ചെയ്യുന്നു.',
      pa: 'ਜੈਮਿਨੀ 1.5 ਫਲੈਸ਼ ਫੋਟੋ ਅਤੇ ਟੈਕਸਟ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ।'
    },
    keyHighlight: {
      hi: 'स्ट्रक्चर्ड JSON वर्गीकरण • क्रिटिकल अर्जेंसी • विज़ुअल एडवाइजरी',
      en: 'Structured JSON Taxonomy • Critical Urgency Tier • Visual Advisory',
      bn: 'স্ট্রাকচার্ড JSON শ্রেণীকরণ • জরুরি স্তর',
      mr: 'स्ट्रक्चर्ड JSON वर्गीकरण • क्रिटिकल अर्जन्सी',
      ta: 'கட்டமைக்கப்பட்ட JSON வகைப்பாடு • அவசர மதிப்பீடு',
      te: 'నిర్మాణాత్మక JSON వర్గీకరణ • అత్యవసర స్థాయి',
      gu: 'સંરચિત JSON વર્ગીકરણ • તાકીદ સ્તર',
      kn: 'ರಚನಾತ್ಮಕ JSON ವರ್ಗೀಕರಣ • ತುರ್ತು ಶ್ರೇಣಿ',
      ml: 'ഘടനാപരമായ JSON വർഗ്ഗീകരണം • അത്യാവശ്യ നില',
      pa: 'ਸੰਰਚਿਤ JSON ਵਰਗੀਕਰਨ • ਜ਼ਰੂਰੀ ਪੱਧਰ'
    },
    visualScene: 'multimodal_ai'
  },
  {
    id: 3,
    stageNumber: '03 / 06',
    duration: 7,
    title: {
      hi: 'चरण 3: एआई सिमेंटिक क्लस्टरिंग (इश्यू क्लस्टर CL-1042)',
      en: 'Scene 3: Semantic Issue Clustering (Cluster CL-1042)',
      bn: 'দৃশ্য ৩: শব্দার্থিক সমস্যা ক্লাস্টারিং (ক্লাস্টার CL-1042)',
      mr: 'दृश्य ३: सिमेंटिक इश्यू क्लस्टरिंग (क्लस्टर CL-1042)',
      ta: 'காட்சி 3: பொதுவான சிக்கல் தொகுப்பு (Cluster CL-1042)',
      te: 'దృశ్యం 3: సమస్యల క్లస్టరింగ్ (Cluster CL-1042)',
      gu: 'દ્રશ્ય ૩: સમાન સમસ્યા ક્લસ્ટરિંગ (Cluster CL-1042)',
      kn: 'ದೃಶ್ಯ ೩: ಸಮಸ್ಯೆ ಕ್ಲಸ್ಟರಿಂಗ್ (Cluster CL-1042)',
      ml: 'രംഗം 3: സമാന പ്രശ്നങ്ങളുടെ ക്ലസ്റ്ററിംഗ് (Cluster CL-1042)',
      pa: 'ਦ੍ਰਿਸ਼ 3: ਸਾਂਝੀ ਸਮੱਸਿਆ ਕਲੱਸਟਰਿੰਗ (Cluster CL-1042)'
    },
    subtitle: {
      hi: '127 अलग-अलग शिकायतों को एक एकीकृत बुनियादी ढांचा समस्या में बदलना।',
      en: 'Transforming 127 individual citizen reports into one underlying infrastructure cluster.',
      bn: '১২৭টি পৃথক অভিযোগকে একটি সমন্বিত পরিকাঠামো সমস্যায় রূপান্তর করা।',
      mr: '१२७ स्वतंत्र तक्रारी एकात्मिक पायाभूत समस्येत रूपांतरित केल्या जातात.',
      ta: '127 தனித்தனி புகார்களை ஒரே உள்கட்டமைப்பு திட்டமாக ஒருங்கிணைக்கிறது.',
      te: '127 వ్యక్తిగత ఫిర్యాదులను ఒకే మౌలిక సదుపాయాల సమస్యగా మారుస్తుంది.',
      gu: '૧૨૭ અલગ ફરિયાદોને એક સંકલિત ઈન્ફ્રાસ્ટ્રક્ચર સમસ્યામાં રૂપાંતરિત કરવામાં આવે છે.',
      kn: '೧೨೭ ಪ್ರತ್ಯೇಕ ದೂರುಗಳನ್ನು ಒಂದು ಸಮಗ್ರ ಯೋಜನೆಯಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.',
      ml: '127 പരാതികളെ ഒരു സമഗ്ര പശ്ചാത്തല പ്രശ്നമായി മാറ്റുന്നു.',
      pa: '127 ਵੱਖ-ਵੱਖ ਸ਼ਿਕਾਇਤਾਂ ਨੂੰ ਇੱਕ ਸਾਂਝੀ ਸਮੱਸਿਆ ਵਿੱਚ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ।'
    },
    audioText: {
      hi: 'सिस्टम अलग-अलग शिकायतों के बजाय समझता है कि जलभराव और टूटी सड़क एक ही नाले की खराबी से जुड़ी हैं।',
      en: 'Instead of isolated complaints, JanNiti AI detects that road damage and waterlogging share a single clogged stormwater root cause.',
      bn: 'সিস্টেম বোঝে যে রাস্তার ক্ষতি এবং জল জমা একই নিষ্কাশন সমস্যার সাথে সম্পর্কিত।',
      mr: 'यंत्रणा समजून घेते की पाण्याचा निचरा न होणे आणि खड्डे एकाच समस्येशी जोडलेले आहेत.',
      ta: 'சாலை சேதமும் தண்ணீர் தேங்குவதும் ஒரே வடிகால் பிரச்சனையின் மூல காரணம் என்பதை கணினி அறிகிறது.',
      te: 'రోడ్డు డ్యామేజ్ మరియు నీటి నిల్వ ఒకే డ్రైనేజీ సమస్యకు సంబంధించినవని వ్యవస్థ గుర్తిస్తుంది.',
      gu: 'સિસ્ટમ સમજે છે કે રસ્તાની ખરાબી અને પાણી ભરાવું એ એક જ ડ્રેનેજ સમસ્યા સાથે જોડાયેલા છે.',
      kn: 'ರಸ್ತೆ ಹಾನಿ ಮತ್ತು ನೀರು ನಿಲ್ಲುವುದು ಒಂದೇ ಚರಂಡಿ ಸಮಸ್ಯೆಯಿಂದಾಗಿದೆ ಎಂದು ಸಿಸ್ಟಮ್ ಗುರುತಿಸುತ್ತದೆ.',
      ml: 'റോഡ് തകർച്ചയും വെള്ളക്കെട്ടും ഒരൊറ്റ ഡ്രെയിനേജ് തകരാർ കൊണ്ടാണെന്ന് സിസ്റ്റം മനസ്സിലാക്കുന്നു.',
      pa: 'ਸਿਸਟਮ ਸਮਝਦਾ ਹੈ ਕਿ ਸੜਕ ਦਾ ਨੁਕਸਾਨ ਅਤੇ ਪਾਣੀ ਭਰਨਾ ਇੱਕੋ ਡਰੇਨੇਜ ਦੀ ਸਮੱਸਿਆ ਨਾਲ ਜੁੜੇ ਹਨ।'
    },
    keyHighlight: {
      hi: 'क्लस्टर ID: CL-1042 • 94% कॉन्फिडेंस • 18,400 प्रभावित आबादी',
      en: 'Cluster ID: CL-1042 • 94% Cluster Confidence • ~18,400 Catchment Population',
      bn: 'ক্লাস্টার ID: CL-1042 • ৯৪% আত্মবিশ্বাস • ১৮,৪০০ জনসংখ্যা',
      mr: 'क्लस्टर ID: CL-1042 • ९४% आत्मविश्वास • १८,४०० बाधित लोकसंख्या',
      ta: 'Cluster ID: CL-1042 • 94% உறுதிப்பாடு • 18,400 மக்கள்',
      te: 'క్లస్టర్ ID: CL-1042 • 94% విశ్వసనీయత • 18,400 జనాభా',
      gu: 'ક્લસ્ટર ID: CL-1042 • 94% વિશ્વાસ • ૧૮,૪૦૦ વસ્તી',
      kn: 'ಕ್ಲಸ್ಟರ್ ID: CL-1042 • 94% ನಿಖರತೆ • ೧೮,೪೦೦ ಜನಸಂಖ್ಯೆ',
      ml: 'ക്ലസ്റ്റർ ID: CL-1042 • 94% ആത്മവിശ്വാസം • 18,400 ജനങ്ങൾ',
      pa: 'ਕਲੱਸਟਰ ID: CL-1042 • 94% ਭਰੋਸਾ • 18,400 ਆਬਾਦੀ'
    },
    visualScene: 'issue_clustering'
  },
  {
    id: 4,
    stageNumber: '04 / 06',
    duration: 7,
    title: {
      hi: 'चरण 4: 10-स्तरीय एविडेंस फ्यूज़न एवं 30-दिवसीय मानसून पूर्वानुमान',
      en: 'Scene 4: 10-Layer Evidence Fusion & 30-Day Monsoon Demand Forecast',
      bn: 'দৃশ্য ৪: ১০-স্তরীয় তথ্য সংমিশ্রণ ও ৩০-দিনের পূর্বাভাস',
      mr: 'दृश्य ४: १०-स्तरीय पुरावा संकलन आणि ३०-दिवसीय अंदाज',
      ta: 'காட்சி 4: 10-அடுக்கு சான்று ஒருங்கிணைப்பு & 30-நாள் முன்னறிவிப்பு',
      te: 'దృశ్యం 4: 10-లేయర్ సాక్ష్యాల సమ్మేళనం & 30-రోజుల అంచనా',
      gu: 'દ્રશ્ય ૪: ૧૦-સ્તરીય પુરાવા સંગ્રહ અને ૩૦-દિવસીય આગાહી',
      kn: 'ದೃಶ್ಯ ೪: ೧೦-ಹಂತದ ಸಾಕ್ಷ್ಯ ಸಂಯೋಜನೆ ಮತ್ತು ೩೦-ದಿನಗಳ ಮುನ್ಸೂಚನೆ',
      ml: 'രംഗം 4: 10-തല തെളിവ് സംയോജനവും 30 ദിവസത്തെ പ്രവചനവും',
      pa: 'ਦ੍ਰਿਸ਼ 4: 10-ਪੱਧਰੀ ਸਬੂਤ ਸੰਕਲਨ ਅਤੇ 30-ਦਿਨਾਂ ਦਾ ਪੂਰਵ ਅਨੁਮਾਨ'
    },
    subtitle: {
      hi: 'जनगणना डेटा, पीएम गतिशक्ति और मौसमी बारिश के जोखिम को मिलाकर प्राथमिकता तय करना।',
      en: 'Combining Census demographics, GatiShakti infrastructure gaps, and seasonal rainfall surge velocity.',
      bn: 'আদমশুমারি তথ্য এবং পরিকাঠামো ঘাটতির ভিত্তিতে সিদ্ধান্ত গ্রহণ।',
      mr: 'जनगणना डेटा आणि हवामान अंदाज एकत्रित करून प्राधान्य ठरवले जाते.',
      ta: 'மக்கள் தொகை கணக்கெடுப்பு மற்றும் உள்கட்டமைப்பு இடைவெளியை இணைத்து திட்டமிடுதல்.',
      te: 'జనాభా వివరాలు మరియు మౌలిక సదుపాయాల లోటును అనుసంధానించడం.',
      gu: 'વસ્તી ગણતરી ડેટા અને ઈન્ફ્રાસ્ટ્રક્ચર ખાધના આધારે નિર્ણય.',
      kn: 'ಜನಗಣತಿ ಮಾಹಿತಿ ಮತ್ತು ಮೌಲಿಕ ಕೊರತೆಗಳ ಆಧಾರದ ಮೇಲೆ ಆದ್ಯತೆ.',
      ml: 'ജനസംഖ്യാ വിവരങ്ങളും അടിസ്ഥാന സൗകര്യ വിടവുകളും സംയോജിപ്പിക്കുന്നു.',
      pa: 'ਮਰਦਮਸ਼ੁਮਾਰੀ ਡੇਟਾ ਅਤੇ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੇ ਪਾੜੇ ਦੇ ਆਧਾਰ ਤੇ ਫੈਸਲਾ।'
    },
    audioText: {
      hi: 'एविडेंस फ्यूज़न पैनल नागरिक मांग, बुनियादी ढांचा घाटे और आगामी मानसून के 34 प्रतिशत वृद्धि जोखिम को जोड़ता है।',
      en: 'The Evidence Fusion Panel combines citizen volume (92%), infrastructure deficit (88%), and a projected +34% pre-monsoon surge risk.',
      bn: 'তথ্য সংমিশ্রণ নাগরিক চাহিদা এবং আসন্ন বর্ষার ৩৪ শতাংশ ঝুঁকির হিসাব করে।',
      mr: 'पुरावा संकलन नागरिक मागणी आणि पावसाळ्यातील ३४ टक्के वाढीचा धोका जोडते.',
      ta: 'சான்று குழு குடிமக்கள் தேவை மற்றும் 34% பருவமழை அபாயத்தை ஒருங்கிணைக்கிறது.',
      te: 'సాక్ష్యాల ప్యానెల్ పౌరుల డిమాండ్ మరియు 34% వర్షాకాల పెరుగుదల అంచనాను చూపుతుంది.',
      gu: 'પુરાવા પેનલ નાગરિક માંગ અને ચોમાસાના ૩૪ ટકા જોખમને જોડે છે.',
      kn: 'ಸಾಕ್ಷ್ಯ ಫಲಕವು ನಾಗರಿಕ ಬೇಡಿಕೆ ಮತ್ತು ಮುಂಗಾರಿನ ೩೪% ಹೆಚ್ಚಳದ ಅಪಾಯವನ್ನು ತೋರಿಸುತ್ತದೆ.',
      ml: 'തെളിവ് പാനൽ പൗരന്മാരുടെ ആവശ്യവും 34% മഴക്കാല അപകടസാധ്യതയും പരിശോധിക്കുന്നു.',
      pa: 'ਸਬੂਤ ਪੈਨਲ ਨਾਗਰਿਕ ਮੰਗ ਅਤੇ ਮਾਨਸੂਨ ਦੇ 34 ਪ੍ਰਤੀਸ਼ਤ ਜੋਖਮ ਨੂੰ ਜੋੜਦਾ ਹੈ।'
    },
    keyHighlight: {
      hi: 'प्रायोरिटी स्कोर: 91/100 • मानसून रिस्क: +34% • हाई कॉन्फिडेंस',
      en: 'Priority Score: 91/100 • Monsoon Surge: +34% • High Confidence Tier',
      bn: 'অগ্রাধিকার স্কোর: ৯১/১০০ • বর্ষা ঝুঁকি: +৩৪%',
      mr: 'प्राधान्य स्कोअर: ९१/१०० • पावसाळा धोका: +३४%',
      ta: 'முன்னுரிமை: 91/100 • பருவமழை அபாயம்: +34%',
      te: 'ప్రాధాన్యత స్కోరు: 91/100 • వర్షాకాల ప్రమాదం: +34%',
      gu: 'પ્રાથમિકતા સ્કોર: ૯૧/૧૦૦ • ચોમાસાનું જોખમ: +૩૪%',
      kn: 'ಆದ್ಯತೆ ಸ್ಕೋರ್: ೯೧/೧೦೦ • ಮುಂಗಾರು ಅಪಾಯ: +೩೪%',
      ml: 'മുൻഗണനാ സ്കോർ: 91/100 • മഴക്കാല സാധ്യത: +34%',
      pa: 'ਤਰਜੀਹ ਸਕੋਰ: 91/100 • ਮਾਨਸੂਨ ਖਤਰਾ: +34%'
    },
    visualScene: 'evidence_fusion'
  },
  {
    id: 5,
    stageNumber: '05 / 06',
    duration: 7,
    title: {
      hi: 'चरण 5: व्हाट-इफ पॉलिसी सिम्युलेटर एवं 10 करोड़ बजट ऑप्टिमाइज़र',
      en: 'Scene 5: What-If Policy Simulator & ₹10 Cr Budget Optimizer',
      bn: 'দৃশ্য ৫: নীতি সিমুলেটর এবং বাজেট অপ্টিমাইজার',
      mr: 'दृश्य ५: पॉलिसी सिम्युलेटर आणि १० कोटी बजेट ऑप्टिमायझर',
      ta: 'காட்சி 5: கொள்கை சிமுலேட்டர் & ₹10 கோடி நிதி உகப்பாக்கம்',
      te: 'దృశ్యం 5: పాలసీ సిమ్యులేటర్ & ₹10 కోట్ల బడ్జెట్ ఆప్టిమైజర్',
      gu: 'દ્રશ્ય ૫: નીતિ સિમ્યુલેટર અને ૧૦ કરોડ બજેટ ઑપ્ટિમાઇઝર',
      kn: 'ದೃಶ್ಯ ೫: ನೀತಿ ಸಿಮ್ಯುಲೇಟರ್ ಮತ್ತು ₹೧೦ ಕೋಟಿ ಬಜೆಟ್ ಆಪ್ಟಿಮೈಜರ್',
      ml: 'രംഗം 5: പോളിസി സിമുലേറ്ററും ₹10 കോടി ബജറ്റ് ഒപ്റ്റിമൈസറും',
      pa: 'ਦ੍ਰਿਸ਼ 5: ਪਾਲਿਸੀ ਸਿਮੂਲੇਟਰ ਅਤੇ ₹10 ਕਰੋੜ ਬਜਟ ਆਪਟੀਮਾਈਜ਼ਰ'
    },
    subtitle: {
      hi: 'विकल्प A (सड़क पैचवर्क) बनाम विकल्प C (एकीकृत सड़क + नाला निर्माण) का तुलनात्मक प्रभाव।',
      en: 'Comparing Option A (surface patch) vs Option C (integrated road + RCC drainage corridor).',
      bn: 'বিকল্প A বনাম সমন্বিত বিকল্প C এর প্রভাব তুলনা করা।',
      mr: 'पर्याय A (तात्पुरती दुरुस्ती) विरुद्ध पर्याय C (एकात्मिक रस्ता + ड्रेनेज) ची तुलना.',
      ta: 'விருப்பம் A மற்றும் ஒருங்கிணைந்த விருப்பம் C ஒப்பீடு.',
      te: 'ఆప్షన్ A మరియు సమీకృత ఆప్షన్ C ప్రభావాల పోలిక.',
      gu: 'વિકલ્પ A અને સંકલિત વિકલ્પ C ની અસરોની સરખામણી.',
      kn: 'ಆಯ್ಕೆ A ಮತ್ತು ಸಮಗ್ರ ಆಯ್ಕೆ C ಗಳ ಪ್ರಭಾವ ಹೋಲಿಕೆ.',
      ml: 'ഓപ്ഷൻ A യും സംയോജിത ഓപ്ഷൻ C യും തമ്മിലുള്ള താരതമ്യം.',
      pa: 'ਵਿਕਲਪ A ਅਤੇ ਏਕੀਕ੍ਰਿਤ ਵਿਕਲਪ C ਦੀ ਤੁਲਨਾ।'
    },
    audioText: {
      hi: 'नीति निर्माता 10 करोड़ के बजट में अधिकतम जनता तक लाभ पहुंचाने वाला अनुकूलित पोर्टफोलियो चुनते हैं।',
      en: 'Policymakers simulate interventions under a ₹10 Crore envelope, optimizing for maximum citizen impact per crore allocated.',
      bn: 'নীতি নির্ধারকরা ১০ কোটি বাজেটে সর্বাধিক প্রভাবসম্পন্ন প্রকল্প নির্বাচন করেন।',
      mr: 'धोरणकर्ते १० कोटींच्या बजेटमध्ये जास्तीत जास्त जनतेला फायदा देणारे प्रकल्प निवडतात.',
      ta: 'கொள்கை வகுப்பாளர்கள் ₹10 கோடி பட்ஜெட்டில் அதிக பயன் தரும் திட்டங்களைத் தேர்ந்தெடுக்கின்றனர்.',
      te: 'విధాన రూపకర్తలు ₹10 కోట్ల బడ్జెట్‌లో గరిష్ట ప్రయోజనం చేకూర్చే ప్రాజెక్టులను ఎంచుకుంటారు.',
      gu: 'નીતિ ઘડવૈયાઓ ૧૦ કરોડના બજેટમાં મહત્તમ લોકો માટે અસરકારક પ્રોજેક્ટ પસંદ કરે છે.',
      kn: 'ನೀತಿ ನಿರೂಪಕರು ₹೧೦ ಕೋಟಿ ಬಜೆಟ್‌ನಲ್ಲಿ ಗರಿಷ್ಠ ಪ್ರಯೋಜನ ನೀಡುವ ಯೋಜನೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡುತ್ತಾರೆ.',
      ml: 'നയരൂപകർത്താക്കൾ ₹10 കോടി ബജറ്റിൽ പരമാവധി ജനങ്ങൾക്ക് പ്രയോജനപ്പെടുന്ന പദ്ധതികൾ തിരഞ്ഞെടുക്കുന്നു.',
      pa: 'ਨੀਤੀ ਘੜਨ ਵਾਲੇ ₹10 ਕਰੋੜ ਦੇ ਬਜਟ ਵਿੱਚ ਵੱਧ ਤੋਂ ਵੱਧ ਲੋਕਾਂ ਦੇ ਫਾਇਦੇ ਵਾਲੇ ਪ੍ਰੋਜੈਕਟ ਚੁਣਦੇ ਹਨ।'
    },
    keyHighlight: {
      hi: 'विकल्प C स्वीकृत • 82% शिकायत कमी • ₹3.2 Cr लागत • 18,400 लाभार्थी',
      en: 'Option C Selected • -82% Grievance Reduction • ₹3.2 Cr Outlay • 18,400 Citizens',
      bn: 'বিকল্প C নির্বাচিত • ৮২% অভিযোগ হ্রাস • ১৮,৪০০ সুবিধাভোগী',
      mr: 'पर्याय C मंजूर • ८२% तक्रारी कमी • १८,४०० लाभार्थी',
      ta: 'விருப்பம் C தேர்வு • 82% குறைப்பு • 18,400 பயனாளிகள்',
      te: 'ఆప్షన్ C ఎంపిక • 82% ఫిర్యాదుల తగ్గింపు • 18,400 మంది లబ్ధిదారులు',
      gu: 'વિકલ્પ C મંજૂર • ૮૨% ફરિયાદ ઘટાડો • ૧૮,૪૦૦ લાભાર્થીઓ',
      kn: 'ಆಯ್ಕೆ C ಆಯ್ಕೆ • ೮೨% ದೂರು ಇಳಿಕೆ • ೧೮,೪೦೦ ಫಲಾನುಭವಿಗಳು',
      ml: 'ഓപ്ഷൻ C തിരഞ്ഞെടുത്തു • 82% പരാതി കുറവ് • 18,400 ഗുണഭോക്താക്കൾ',
      pa: 'ਵਿਕਲਪ C ਚੁਣਿਆ • 82% ਸ਼ਿਕਾਇਤਾਂ ਘੱਟ • 18,400 ਲਾਭਪਾਤਰੀ'
    },
    visualScene: 'policy_simulation'
  },
  {
    id: 6,
    stageNumber: '06 / 06',
    duration: 7,
    title: {
      hi: 'चरण 6: ऑडिट लॉग में स्वीकृति एवं नागरिक फीडबैक से सत्यापन',
      en: 'Scene 6: Human Sanction in Audit Log & Closed-Loop Impact Verification',
      bn: 'দৃশ্য ৬: অডিট লগে অনুমোদন ও প্রভাব যাচাইকরণ',
      mr: 'दृश्य ६: ऑडिट लॉगमध्ये मान्यता आणि परिणाम पडताळणी',
      ta: 'காட்சி 6: தணிக்கை பதிவில் ஒப்புதல் & தாக்க சரிபார்ப்பு',
      te: 'దృశ్యం 6: ఆడిట్ లాగ్‌లో ఆమోదం & ఫలితాల ధృవీకరణ',
      gu: 'દ્રશ્ય ૬: ઑડિટ લૉગમાં મંજૂરી અને અસર ચકાસણી',
      kn: 'ದೃಶ್ಯ ೬: ಆಡಿಟ್ ಲಾಗ್‌ನಲ್ಲಿ ಅನುಮೋದನೆ ಮತ್ತು ಪ್ರಭಾವ ಪರಿಶೀಲನೆ',
      ml: 'രംഗം 6: ഓഡിറ്റ് ലോഗിലെ അംഗീകാരവും ഫല പരിശോധനയും',
      pa: 'ਦ੍ਰਿਸ਼ 6: ਆਡਿਟ ਲੌਗ ਵਿੱਚ ਪ੍ਰਵਾਨਗੀ ਅਤੇ ਪ੍ਰਭਾਵ ਦੀ ਪੁਸ਼ਟੀ'
    },
    subtitle: {
      hi: 'परियोजना पूर्ण होने के बाद 52% सुधार दर्ज, नागरिकों ने दिया 88% संतुष्टि फीडबैक।',
      en: 'Post-completion metrics show 52% grievance drop with 88% positive citizen satisfaction ratings.',
      bn: 'প্রকল্প শেষ হওয়ার পর ৫২% উন্নতি এবং ৮৮% নাগরিক সন্তুষ্টি রেকর্ড করা হয়েছে।',
      mr: 'काम पूर्ण झाल्यावर ५२% सुधारणा आणि नागरिकांचा ८८% समाधान प्रतिसाद.',
      ta: 'திட்டம் முடிந்ததும் 52% முன்னேற்றம் மற்றும் 88% மக்கள் திருப்தி பதிவு.',
      te: 'ప్రాజెక్ట్ పూర్తయిన తర్వాత 52% మెరుగుదల మరియు 88% పౌరుల సంతృప్తి.',
      gu: 'પ્રોજેક્ટ પૂર્ણ થતાં ૫૨% સુધારો અને નાગરિકોનો ૮૮% સંતોષ પ્રતિસાદ.',
      kn: 'ಯೋಜನೆ ಪೂರ್ಣಗೊಂಡ ನಂತರ ೫೨% ಸುಧಾರಣೆ ಮತ್ತು ೮೮% ನಾಗರಿಕರ ತೃಪ್ತಿ.',
      ml: 'പദ്ധതി പൂർത്തിയായതോടെ 52% പുരോഗതിയും 88% ജനസംതൃപ്തിയും.',
      pa: 'ਪ੍ਰੋਜੈਕਟ ਪੂਰਾ ਹੋਣ ਤੇ 52% ਸੁਧਾਰ ਅਤੇ 88% ਨਾਗਰਿਕ ਸੰਤੁਸ਼ਟੀ ਦਰਜ।'
    },
    audioText: {
      hi: 'अधिकारी के निर्णय का ऑडिट लॉग रिकॉर्ड होता है। काम पूरा होने के बाद नागरिक रेटिंग से वास्तविक प्रभाव सत्यापित होता है।',
      en: 'The administrative sanction is preserved in the immutable audit log. Post-execution citizen feedback closes the loop with verifiable public impact.',
      bn: 'সরকারি সিদ্ধান্ত অডিট লগে সংরক্ষিত হয় এবং নাগরিক প্রতিক্রিয়ার মাধ্যমে প্রভাব যাচাই করা হয়।',
      mr: 'अधिकाऱ्यांचा निर्णय ऑडिट लॉगमध्ये नोंदवला जातो आणि नागरिक प्रतिसादाने पडताळला जातो.',
      ta: 'அதிகாரியின் முடிவு தணிக்கை பதிவில் சேமிக்கப்பட்டு மக்கள் கருத்தால் சரிபார்க்கப்படுகிறது.',
      te: 'అధికారి నిర్ణయం ఆడిట్ లాగ్‌లో నమోదవుతుంది మరియు పౌరుల ఫీడ్‌బ్యాక్‌తో ధృవీకరించబడుతుంది.',
      gu: 'અધિકારીનો નિર્ણય ઑડિટ લૉગમાં નોંધાય છે અને નાગરિક પ્રતિસાદથી ચકાસાય છે.',
      kn: 'ಅಧಿಕಾರಿಯ ನಿರ್ಧಾರವು ಆಡಿಟ್ ಲಾಗ್‌ನಲ್ಲಿ ದಾಖಲಾಗುತ್ತದೆ ಮತ್ತು ನಾಗರಿಕರ ಪ್ರತಿಕ್ರಿಯೆಯಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಡುತ್ತದೆ.',
      ml: 'തീരുമാനം ഓഡിറ്റ് ലോഗിൽ രേഖപ്പെടുത്തുകയും ജനങ്ങളുടെ പ്രതികരണത്തിലൂടെ സ്ഥിരീകരിക്കുകയും ചെയ്യുന്നു.',
      pa: 'ਅਧਿਕਾਰੀ ਦਾ ਫੈਸਲਾ ਆਡਿਟ ਲੌਗ ਵਿੱਚ ਦਰਜ ਹੁੰਦਾ ਹੈ ਅਤੇ ਨਾਗਰਿਕ ਫੀਡਬੈਕ ਨਾਲ ਪੁਸ਼ਟੀ ਹੁੰਦੀ ਹੈ।'
    },
    keyHighlight: {
      hi: 'शिकायतें: 820 → 410 (52% कमी) • गैप स्कोर: 86 → 51 • 88% नागरिक संतुष्टि',
      en: 'Complaints: 820 → 410 (-52%) • Gap Score: 86 → 51 • 88% Citizen Satisfaction',
      bn: 'অভিযোগ: ৮২০ → ৪১০ (-৫২%) • ৮৮% নাগরিক সন্তুষ্টি',
      mr: 'तक्रारी: ८२० → ४१० (-५२%) • ८८% नागरिक समाधान',
      ta: 'புகார்கள்: 820 → 410 (-52%) • 88% மக்கள் திருப்தி',
      te: 'ఫిర్యాదులు: 820 → 410 (-52%) • 88% పౌరుల సంతృప్తి',
      gu: 'ફરિયાદો: ૮૨૦ → ૪૧૦ (-૫૨%) • ૮૮% નાગરિક સંતોષ',
      kn: 'ದೂರುಗಳು: ೮೨೦ → ೪೧೦ (-೫೨%) • ೮೮% ನಾಗರಿಕ ತೃಪ್ತಿ',
      ml: 'പരാതികൾ: 820 → 410 (-52%) • 88% ജനസംതൃപ്തി',
      pa: 'ਸ਼ਿਕਾਇਤਾਂ: 820 → 410 (-52%) • 88% ਨਾਗਰਿਕ ਸੰਤੁਸ਼ਟੀ'
    },
    visualScene: 'impact_verification'
  }
];

export const MultilingualStoryVideo: React.FC<MultilingualStoryVideoProps> = ({
  isOpen,
  onClose,
  initialLanguage = 'hi',
  onNavigateToTab
}) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(initialLanguage);
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isVoiceoverEnabled, setIsVoiceoverEnabled] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const activeScene = STORY_SCENES[activeSceneIdx];

  // Speech Synthesis Controller
  useEffect(() => {
    if (!isOpen) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (isVoiceoverEnabled && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.cancel();
      const textToSpeak = activeScene.audioText[currentLang] || activeScene.audioText.en;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Find matching language speech code
      const langOption = LANGUAGES.find(l => l.code === currentLang);
      utterance.lang = langOption ? langOption.speechCode : 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen, activeSceneIdx, currentLang, isVoiceoverEnabled, isPlaying]);

  // Timeline Auto-Progress Controller
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const intervalTime = 100;
    const stepIncrement = (intervalTime / (activeScene.duration * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeSceneIdx < STORY_SCENES.length - 1) {
            setActiveSceneIdx((idx) => idx + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, activeSceneIdx, activeScene.duration]);

  if (!isOpen) return null;

  const handleSelectScene = (idx: number) => {
    setActiveSceneIdx(idx);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setCurrentLang(newLang);
    setProgress(0);
  };

  const handleJumpToLiveApp = () => {
    onClose();
    if (onNavigateToTab) {
      if (activeScene.visualScene === 'voice_input' || activeScene.visualScene === 'multimodal_ai') {
        onNavigateToTab('citizen');
      } else if (activeScene.visualScene === 'issue_clustering') {
        onNavigateToTab('intelligence');
      } else if (activeScene.visualScene === 'evidence_fusion') {
        onNavigateToTab('areaintelligence');
      } else if (activeScene.visualScene === 'policy_simulation') {
        onNavigateToTab('simulator');
      } else {
        onNavigateToTab('impact');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[95vh] text-white">
        
        {/* TOP BAR: Title & Multilingual In-Player Language Selector */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  JanNiti AI Multilingual Story Walkthrough
                </h3>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {activeScene.stageNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive Animated Decision Journey in 10 Indian Languages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* In-Player Language Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-700 text-xs shadow-inner">
              <Globe2 className="w-3.5 h-3.5 text-cyan-300" />
              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CINEMATIC ANIMATION STAGE */}
        <div className="relative bg-slate-950 p-6 sm:p-8 flex-1 min-h-[320px] flex flex-col justify-center items-center overflow-hidden">
          {/* Subtle Ambient Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf812_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* SCENE 1 VISUAL: VOICE INPUT & WAVEFORM */}
          {activeScene.visualScene === 'voice_input' && (
            <div className="relative z-10 w-full max-w-xl space-y-4 text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold shadow-md">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Google Cloud STT Dialect Recognition (10+ Languages)</span>
              </div>

              {/* Dynamic Live Audio Waveform Bars */}
              <div className="flex items-center justify-center gap-1.5 py-4">
                {[35, 60, 85, 40, 95, 70, 50, 90, 65, 80, 45, 75, 95, 35, 80, 55, 90, 45].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full bg-gradient-to-t from-cyan-500 to-indigo-500 animate-pulse shadow-sm"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 70}ms`,
                      animationDuration: '1.1s'
                    }}
                  />
                ))}
              </div>

              {/* Citizen Card Sample */}
              <div className="p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
                    Live Citizen Voice (Lucknow, UP)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">ID: JN-UP-1042</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  "हमारे इलाके में बारिश के समय सड़क पर बहुत पानी भर जाता है और सड़क पूरी तरह टूट जाती है।"
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">AI Intent: <strong className="text-cyan-300">Roads & Stormwater Inundation</strong></span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-400/30">Urgency: Critical</span>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 2 VISUAL: MULTIMODAL GEMINI SCAN */}
          {activeScene.visualScene === 'multimodal_ai' && (
            <div className="relative z-10 w-full max-w-xl space-y-4 animate-in zoom-in-95 duration-300">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Gemini 1.5 Flash Multimodal Vision & Feature Extraction</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                {/* Photo with Scanning Laser Overlay */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
                    alt="Potholes"
                    className="w-full h-full object-cover opacity-80"
                  />
                  {/* High tech scanning laser line */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce shadow-[0_0_12px_#22d3ee]" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                    Visual Damage Telemetry
                  </span>
                </div>

                {/* Extracted Advisory Attributes */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">AI Extracted Features</span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>Surface Disintegration:</span>
                      <strong className="text-rose-400 font-bold">Severe Cratering</strong>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>Stagnant Stormwater:</span>
                      <strong className="text-amber-400 font-bold">Detected (&gt;10cm)</strong>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>Subgrade Erosion:</span>
                      <strong className="text-rose-400 font-bold">Critical Risk</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic">
                    * AI-assisted advisory inspection only.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 3 VISUAL: ISSUE CLUSTERING */}
          {activeScene.visualScene === 'issue_clustering' && (
            <div className="relative z-10 w-full max-w-xl space-y-4 text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold shadow-md">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Unsupervised Spatial & Semantic Clustering Engine</span>
              </div>

              {/* 3 Converging Reports to 1 Cluster */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-1 text-left">
                <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <div className="text-[10px] text-slate-500 font-mono">Report #1041</div>
                  "Potholes on road"
                </div>
                <div className="p-3 bg-indigo-950/60 rounded-xl border border-indigo-500 text-xs text-white ring-2 ring-indigo-400/40 shadow-xl">
                  <div className="text-[10px] text-amber-300 font-bold">Cluster Synthesized</div>
                  <strong className="text-sm text-cyan-300 block">CL-1042</strong>
                  <div className="text-[10px] text-slate-300">127 Related Reports</div>
                </div>
                <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <div className="text-[10px] text-slate-500 font-mono">Report #1043</div>
                  "Drain waterlogging"
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left space-y-1">
                <div><strong className="text-amber-300">Synthesized Underlying Problem:</strong> Road surface disintegration accelerated by stormwater sub-base inundation.</div>
                <div className="text-[11px] text-slate-400">Lead Department: <strong className="text-indigo-400">Public Works Department (PWD) + Stormwater Drainage</strong></div>
              </div>
            </div>
          )}

          {/* SCENE 4 VISUAL: EVIDENCE FUSION & RADAR */}
          {activeScene.visualScene === 'evidence_fusion' && (
            <div className="relative z-10 w-full max-w-xl space-y-3.5 animate-in zoom-in-95 duration-300">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold shadow-md">
                  <Layers className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Multi-Source Evidence Fusion & 10-Sector Gap Diagnostic</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {/* 5-Bar Evidence Breakdown */}
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-400">Citizen Demand Density</span>
                      <strong className="text-cyan-300">92%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-400">Infrastructure Deficit Gap</span>
                      <strong className="text-rose-400">88%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: '88%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-400">Population Reach (~18.4k)</span>
                      <strong className="text-sky-300">81%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400" style={{ width: '81%' }} />
                    </div>
                  </div>
                </div>

                {/* Radar & Predictive Surge Box */}
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Predictive Surge Telemetry</span>
                    <div className="text-xl font-extrabold text-white mt-1">+34% Monsoon Surge</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Historical risk index forecasts rapid pavement failure if drainage is unaddressed.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Composite Priority:</span>
                    <span className="text-emerald-400 text-sm">91 / 100 (Critical)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 5 VISUAL: POLICY SIMULATION */}
          {activeScene.visualScene === 'policy_simulation' && (
            <div className="relative z-10 w-full max-w-xl space-y-3.5 animate-in zoom-in-95 duration-300 text-left">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold shadow-md">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Intervention Simulator & Capital Budget Allocator</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-1.5 text-xs opacity-75">
                  <div className="flex items-center justify-between font-bold text-slate-300">
                    <span>Option A: Patch Repair</span>
                    <span className="text-slate-400">₹0.9 Cr</span>
                  </div>
                  <div className="text-rose-400 font-bold text-[11px]">-24% Short-Term Relief</div>
                  <p className="text-[10px] text-slate-500">Recurring failure within 6 months due to drainage defect.</p>
                </div>

                <div className="p-3.5 bg-indigo-950/70 rounded-2xl border border-indigo-500 space-y-1.5 text-xs ring-2 ring-indigo-400/40 shadow-xl">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="text-cyan-300">Option C: Integrated DPI Upgrade</span>
                    <span className="text-amber-300">₹3.2 Cr</span>
                  </div>
                  <div className="text-emerald-400 font-black text-[11px]">-82% Long-Term Grievance Drop</div>
                  <p className="text-[10px] text-slate-300">Permanent RCC drainage + asphalt corridor for 18,400 citizens.</p>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 6 VISUAL: IMPACT VERIFICATION */}
          {activeScene.visualScene === 'impact_verification' && (
            <div className="relative z-10 w-full max-w-xl space-y-3.5 animate-in zoom-in-95 duration-300 text-left">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Closed-Loop Impact Verification & Citizen Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Before Upgrade</span>
                  <div className="text-lg sm:text-xl font-bold text-rose-400">820 Grievances/mo</div>
                  <div className="text-[11px] text-slate-400">Gap: 86/100 (Critical)</div>
                </div>

                <div className="p-3.5 bg-emerald-950/50 rounded-2xl border border-emerald-500/60 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">After DPI Upgrade</span>
                  <div className="text-lg sm:text-xl font-bold text-emerald-300">410 Grievances/mo</div>
                  <div className="text-[11px] text-emerald-400">88% Citizen Satisfaction</div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Verified Improvement:</span>
                <strong className="text-emerald-400 text-sm">+52% Net Civic Relief</strong>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS & TIMELINE SCRUBBER */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase block">
                {activeScene.keyHighlight[currentLang] || activeScene.keyHighlight.en}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {activeScene.title[currentLang] || activeScene.title.en}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {activeScene.subtitle[currentLang] || activeScene.subtitle.en}
              </p>
            </div>

            {/* Playback & Audio Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Voiceover Narrator Toggle */}
              <button
                onClick={() => setIsVoiceoverEnabled(!isVoiceoverEnabled)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isVoiceoverEnabled
                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={isVoiceoverEnabled ? 'Mute Voiceover Narration' : 'Enable Voiceover Narration'}
              >
                {isVoiceoverEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <span className="hidden sm:inline text-[11px]">{isVoiceoverEnabled ? 'Voice On' : 'Voice Off'}</span>
              </button>

              <button
                onClick={() => {
                  if (activeSceneIdx > 0) handleSelectScene(activeSceneIdx - 1);
                }}
                disabled={activeSceneIdx === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white"
                title="Previous Scene"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => {
                  if (activeSceneIdx < STORY_SCENES.length - 1) {
                    handleSelectScene(activeSceneIdx + 1);
                  } else {
                    handleSelectScene(0);
                  }
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                title="Next Scene"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Jump to Live Web App Button */}
              <button
                onClick={handleJumpToLiveApp}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md ml-1"
              >
                <span>Try Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 6-Scene Timeline Scrubber Bar */}
          <div className="grid grid-cols-6 gap-2 pt-1">
            {STORY_SCENES.map((sc, idx) => (
              <div
                key={sc.id}
                onClick={() => handleSelectScene(idx)}
                className="cursor-pointer group space-y-1"
              >
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-100"
                    style={{
                      width: idx < activeSceneIdx ? '100%' : (idx === activeSceneIdx ? `${progress}%` : '0%')
                    }}
                  />
                </div>
                <div className={`text-[10px] font-semibold truncate transition-colors ${
                  idx === activeSceneIdx ? 'text-cyan-300 font-bold' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {idx + 1}. {(sc.title[currentLang] || sc.title.en).split(':')[1] || sc.title.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
