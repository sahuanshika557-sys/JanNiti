import { calculatePriorityScore } from '../analytics/priorityEngine';
import { CitizenRequest, DatasetTransparencyItem, GapLevel, UrgencyLevel } from '../types';

export const DATASET_TRANSPARENCY_REGISTRY: DatasetTransparencyItem[] = [
  {
    id: 'data-gov-in-pmgsy',
    name: 'PMGSY Habitation Connectivity & Road Condition Benchmark',
    source: 'data.gov.in / Ministry of Rural Development, GoI',
    purpose: 'Habitation level rural road connectivity status and all-weather pavement indicators',
    coverage: 'Pan-India (700+ Districts)',
    dataType: 'Spatial & Infrastructure Asset Register',
    status: 'BENCHMARK / OPEN GOV',
    lastUpdated: 'Q2 2024 / Live Pipeline'
  },
  {
    id: 'census-demographics-2011',
    name: 'District Demographics & Population Density Register',
    source: 'Office of the Registrar General & Census Commissioner, India',
    purpose: 'Baseline population, literacy rate, SC/ST demographic vulnerability weighting',
    coverage: 'All Indian States & Union Territories',
    dataType: 'Demographic Census Indicators',
    status: 'BENCHMARK / OPEN GOV',
    lastUpdated: 'Periodic Benchmark Standard'
  },
  {
    id: 'jal-jeevan-mission-dashboard',
    name: 'Jal Jeevan Mission Har Ghar Jal Tap Water Status',
    source: 'Department of Drinking Water and Sanitation, Ministry of Jal Shakti',
    purpose: 'Household tap connection saturation % and water quality baseline',
    coverage: 'National / District Level',
    dataType: 'Water Utility Coverage Telemetry',
    status: 'BENCHMARK / OPEN GOV',
    lastUpdated: 'Live National Open API'
  },
  {
    id: 'niti-aayog-aspirational-districts',
    name: 'NITI Aayog Aspirational Districts Baseline Deficit Index',
    source: 'NITI Aayog (Champions of Change Portal)',
    purpose: 'Composite socio-economic development and infrastructure gap ranking',
    coverage: '112 Selected Aspirational Districts across India',
    dataType: 'Composite Deficit Scoring Index',
    status: 'BENCHMARK / OPEN GOV',
    lastUpdated: 'Monthly Government Bulletin'
  },
  {
    id: 'janniti-citizen-telemetry',
    name: 'JanNiti AI Citizen Voice & Multilingual Feedback Repository',
    source: 'Direct Citizen Submissions (Voice, Text, Mobile App & Web Portal)',
    purpose: 'Real-time ground truth infrastructure grievance and demand intelligence',
    coverage: 'Pan-India Multilingual Citizen Submissions (10+ Languages)',
    dataType: 'Citizen Voice & Geocoded Submissions',
    status: 'SAMPLE DATA',
    lastUpdated: 'Real-time Live Sync (Active Session)'
  }
];

interface LocationSeed {
  state: string;
  district: string;
  subDistricts: string[];
  lat: number;
  lng: number;
  primaryLang: string;
}

const DISTRICT_LOCATIONS: LocationSeed[] = [
  // Uttar Pradesh (Key demo cluster)
  { state: 'Uttar Pradesh', district: 'Lucknow', subDistricts: ['Alambagh', 'Gomti Nagar', 'Bakshi Ka Talab', 'Mohanlalganj', 'Sarojini Nagar', 'Chinhat', 'Hazratganj'], lat: 26.8467, lng: 80.9462, primaryLang: 'Hindi' },
  { state: 'Uttar Pradesh', district: 'Kanpur Nagar', subDistricts: ['Kalyanpur', 'Govind Nagar', 'Ghatampur', 'Bilhaur', 'Chakeri'], lat: 26.4499, lng: 80.3319, primaryLang: 'Hindi' },
  { state: 'Uttar Pradesh', district: 'Varanasi', subDistricts: ['Pindra', 'Shivpur', 'Rohaniya', 'Kashi', 'Ramnagar'], lat: 25.3176, lng: 82.9739, primaryLang: 'Hindi' },
  { state: 'Uttar Pradesh', district: 'Prayagraj', subDistricts: ['Naini', 'Phulpur', 'Soraon', 'Koraon'], lat: 25.4358, lng: 81.8463, primaryLang: 'Hindi' },
  
  // Maharashtra
  { state: 'Maharashtra', district: 'Pune', subDistricts: ['Haveli', 'Baramati', 'Shirur', 'Khed', 'Pimpri-Chinchwad'], lat: 18.5204, lng: 73.8567, primaryLang: 'Marathi' },
  { state: 'Maharashtra', district: 'Thane', subDistricts: ['Kalyan', 'Bhiwandi', 'Ulhasnagar', 'Ambernath'], lat: 19.2183, lng: 72.9781, primaryLang: 'Marathi' },
  { state: 'Maharashtra', district: 'Nagpur', subDistricts: ['Kamptee', 'Hingna', 'Katol', 'Ramtek'], lat: 21.1458, lng: 79.0882, primaryLang: 'Marathi' },

  // Bihar
  { state: 'Bihar', district: 'Patna', subDistricts: ['Danapur', 'Phulwari Sharif', 'Fatwah', 'Bakhtiyarpur', 'Maner'], lat: 25.5941, lng: 85.1376, primaryLang: 'Hindi' },
  { state: 'Bihar', district: 'Muzaffarpur', subDistricts: ['Kanti', 'Motipur', 'Sakra', 'Kurhani'], lat: 26.1209, lng: 85.3647, primaryLang: 'Hindi' },
  { state: 'Bihar', district: 'Gaya', subDistricts: ['Bodh Gaya', 'Sherghati', 'Tekari', 'Wazirganj'], lat: 24.7955, lng: 85.0002, primaryLang: 'Hindi' },

  // Tamil Nadu
  { state: 'Tamil Nadu', district: 'Madurai', subDistricts: ['Melur', 'Vadipatti', 'Thirumangalam', 'Usilampatti'], lat: 9.9252, lng: 78.1198, primaryLang: 'Tamil' },
  { state: 'Tamil Nadu', district: 'Coimbatore', subDistricts: ['Pollachi', 'Mettupalayam', 'Sulur', 'Annur'], lat: 11.0168, lng: 76.9558, primaryLang: 'Tamil' },
  { state: 'Tamil Nadu', district: 'Chennai', subDistricts: ['Ambattur', 'Tondiarpet', 'Guindy', 'Sholinganallur'], lat: 13.0827, lng: 80.2707, primaryLang: 'Tamil' },

  // West Bengal
  { state: 'West Bengal', district: 'North 24 Parganas', subDistricts: ['Barasat', 'Basirhat', 'Bongaon', 'Barrackpore'], lat: 22.7234, lng: 88.4811, primaryLang: 'Bengali' },
  { state: 'West Bengal', district: 'Murshidabad', subDistricts: ['Berhampore', 'Lalgola', 'Kandi', 'Jangipur'], lat: 24.1759, lng: 88.2802, primaryLang: 'Bengali' },

  // Karnataka
  { state: 'Karnataka', district: 'Bengaluru Urban', subDistricts: ['Anekal', 'Yelahanka', 'K.R. Puram', 'Electronic City'], lat: 12.9716, lng: 77.5946, primaryLang: 'Kannada' },
  { state: 'Karnataka', district: 'Mysuru', subDistricts: ['Nanjangud', 'Hunsur', 'H.D. Kote', 'T. Narasipura'], lat: 12.2958, lng: 76.6394, primaryLang: 'Kannada' },

  // Rajasthan
  { state: 'Rajasthan', district: 'Jaipur', subDistricts: ['Sanganer', 'Amber', 'Chomu', 'Basssi'], lat: 26.9124, lng: 75.7873, primaryLang: 'Hindi' },
  { state: 'Rajasthan', district: 'Jodhpur', subDistricts: ['Bilara', 'Osian', 'Bhopalgarh', 'Luni'], lat: 26.2389, lng: 73.0243, primaryLang: 'Hindi' },

  // Gujarat
  { state: 'Gujarat', district: 'Ahmedabad', subDistricts: ['Sanand', 'Daskroi', 'Dholka', 'Bavla'], lat: 23.0225, lng: 72.5714, primaryLang: 'Gujarati' },
  { state: 'Gujarat', district: 'Surat', subDistricts: ['Olpad', 'Choryasi', 'Bardoli', 'Kamrej'], lat: 21.1702, lng: 72.8311, primaryLang: 'Gujarati' },

  // Kerala
  { state: 'Kerala', district: 'Wayanad', subDistricts: ['Mananthavady', 'Sulthan Bathery', 'Vythiri'], lat: 11.6854, lng: 76.1320, primaryLang: 'Malayalam' },

  // Telangana
  { state: 'Telangana', district: 'Hyderabad', subDistricts: ['Secunderabad', 'Charminar', 'Serilingampally', 'LB Nagar'], lat: 17.3850, lng: 78.4867, primaryLang: 'Telugu' },

  // Punjab
  { state: 'Punjab', district: 'Ludhiana', subDistricts: ['Khanna', 'Jagraon', 'Samrala', 'Payal'], lat: 30.9010, lng: 75.8573, primaryLang: 'Punjabi' }
];

interface TemplateCategory {
  category: string;
  subCategories: string[];
  templates: {
    text: string;
    lang: string;
    urgency: UrgencyLevel;
    gap: GapLevel;
    popEst: number;
    summary: string;
    action: string;
  }[];
}

const CATEGORY_TEMPLATES: TemplateCategory[] = [
  {
    category: 'Road Infrastructure',
    subCategories: ['Severely Damaged Road', 'Potholed Arterial Corridor', 'Missing Bridge Culvert', 'Unpaved Village Approach'],
    templates: [
      {
        text: 'हमारे गांव में बारिश के समय सड़क पूरी तरह खराब हो जाती है और मुख्य बाजार जाना असंभव हो जाता है।',
        lang: 'Hindi',
        urgency: 'High',
        gap: 'High',
        popEst: 32000,
        summary: 'Village road becomes completely impassable during rains, isolating local market access.',
        action: 'Undertake bituminous all-weather road reconstruction with edge drainage.'
      },
      {
        text: 'The main connecting road has massive deep potholes causing continuous traffic jams and vehicle damage daily.',
        lang: 'English',
        urgency: 'High',
        gap: 'High',
        popEst: 45000,
        summary: 'Deep potholes on major arterial corridor cause frequent congestion and safety hazards.',
        action: 'Re-carpet critical 5km corridor with high-grade asphalt overlay.'
      },
      {
        text: 'आमच्या गावातील रस्ता पावसाळ्यात चिखलमय होतो, शाळकरी मुलांना जाणे खूप कठीण होते.',
        lang: 'Marathi',
        urgency: 'High',
        gap: 'High',
        popEst: 22000,
        summary: 'Muddy unpaved village road severely hinders school children transit during rains.',
        action: 'Pave standard concrete road with side ditches under PMGSY.'
      },
      {
        text: 'இந்த சாலையில் கடுமையான பள்ளங்கள் உள்ளன, அவசர ஆம்புலன்ஸ் கூட வர முடிவதில்லை.',
        lang: 'Tamil',
        urgency: 'Critical',
        gap: 'Critical',
        popEst: 40000,
        summary: 'Severe road craters prevent emergency ambulance access to rural settlements.',
        action: 'Emergency patch repairs followed by full corridor widening.'
      },
      {
        text: 'বর্ষার সময় রাস্তাটি পুরোপুরি খানাখন্দে ভরে যায় এবং কোনো গাড়ি চলাচল করতে পারে না।',
        lang: 'Bengali',
        urgency: 'High',
        gap: 'High',
        popEst: 28000,
        summary: 'Monsoon flooding creates dangerous craters halting vehicle movement.',
        action: 'Upgrade road base and install concrete box culverts.'
      }
    ]
  },
  {
    category: 'Drainage & Flood Control',
    subCategories: ['Stormwater Overflow', 'Blocked Main Drain', 'Low-Lying Waterlogging', 'Missing Pucca Nullah'],
    templates: [
      {
        text: 'हमारे मोहल्ले में नाली की कोई व्यवस्था नहीं है और हर बारिश में घरों में पानी भर जाता है।',
        lang: 'Hindi',
        urgency: 'Critical',
        gap: 'Critical',
        popEst: 25000,
        summary: 'Absence of stormwater drains causes recurring dirty water ingress into residences.',
        action: 'Construct covered RCC stormwater trunk line with pump station.'
      },
      {
        text: 'Severe waterlogging for 48 hours after every moderate rain; open nullah is choked with silt.',
        lang: 'English',
        urgency: 'High',
        gap: 'High',
        popEst: 35000,
        summary: 'Choked open drainage causes severe multi-day stagnation and vector disease outbreak risk.',
        action: 'Desilt main drainage canal and construct underground stormwater network.'
      },
      {
        text: 'వర్షపు నీరు డ్రైనేజీ లేకపోవడం వల్ల వీధుల్లో నిలిచిపోతుంది, తీవ్ర ఇబ్బంది కలుగుతోంది.',
        lang: 'Telugu',
        urgency: 'High',
        gap: 'High',
        popEst: 20000,
        summary: 'Rainwater stagnates on streets due to absent drainage infrastructure.',
        action: 'Install interconnected underground drainage grid.'
      },
      {
        text: 'ચોમાસામાં ગામમાં પાણી ભરાઈ જવાની મોટી સમસ્યા છે, ગટરની લાઈન તૂટેલી છે.',
        lang: 'Gujarati',
        urgency: 'High',
        gap: 'High',
        popEst: 18000,
        summary: 'Broken sewage pipeline causes heavy street water accumulation during monsoon.',
        action: 'Replace damaged pipes and expand stormwater discharge basin.'
      }
    ]
  },
  {
    category: 'Water & Sanitation',
    subCategories: ['Pipeline Disruption', 'Contaminated Drinking Water', 'Dry Borewells', 'No Piped Connection'],
    templates: [
      {
        text: 'हमारे गांव में पिछले 3 महीने से पीने का साफ पानी नहीं आ रहा है, हैंडपंप भी खराब हैं।',
        lang: 'Hindi',
        urgency: 'Critical',
        gap: 'Critical',
        popEst: 18000,
        summary: 'Acute potable water deficit for 3 months with non-functional handpumps.',
        action: 'Deploy emergency water tankers and fast-track Jal Jeevan Mission piped supply.'
      },
      {
        text: 'Pipelines are leaking contaminated brown water mixed with sewage; severe jaundice risk.',
        lang: 'English',
        urgency: 'Critical',
        gap: 'Critical',
        popEst: 29000,
        summary: 'Contaminated tap water supply posing imminent public health emergency.',
        action: 'Immediate pipe isolation, replacement, and community water testing.'
      },
      {
        text: 'ಗ್ರಾಮದಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್‌ಲೈನ್ ಇಲ್ಲ, ಜನರು ೨ ಕಿ.ಮೀ ದೂರ ಹೋಗಬೇಕಾಗಿದೆ.',
        lang: 'Kannada',
        urgency: 'High',
        gap: 'High',
        popEst: 15000,
        summary: 'Lack of piped water forces residents to travel 2 km daily for drinking water.',
        action: 'Install overhead water storage tank and solar-powered distribution line.'
      },
      {
        text: 'പൈപ്പ് ലൈൻ പൊട്ടി കുടിവെള്ളം പാഴാകുന്നു, പല വീടുകളിലും വെള്ളം ലഭിക്കുന്നില്ല.',
        lang: 'Malayalam',
        urgency: 'Medium',
        gap: 'Medium',
        popEst: 12000,
        summary: 'Burst main pipeline results in heavy water loss and local supply shortage.',
        action: 'Repair pipeline joint and optimize pressure booster valves.'
      }
    ]
  },
  {
    category: 'Healthcare & Primary Health',
    subCategories: ['Primary Health Centre Deficit', 'Doctor & Staff Shortage', 'No Emergency Facility', 'Missing Maternity Ward'],
    templates: [
      {
        text: 'हमारे क्षेत्र में प्राथमिक स्वास्थ्य केंद्र में कोई डॉक्टर नहीं बैठता, आपातकाल में 25 किमी जाना पड़ता है।',
        lang: 'Hindi',
        urgency: 'Critical',
        gap: 'Critical',
        popEst: 50000,
        summary: 'Primary health sub-centre lacks resident medical officer, forcing 25km travel for emergencies.',
        action: 'Sanction dedicated Medical Officer and establish 24/7 Ayushman Arogya Mandir.'
      },
      {
        text: 'Local government clinic lacks basic diagnostic equipment and emergency oxygen support.',
        lang: 'English',
        urgency: 'High',
        gap: 'High',
        popEst: 38000,
        summary: 'Health centre lacks diagnostic infrastructure and essential emergency equipment.',
        action: 'Supply diagnostic kits, digital ECG, and deploy mobile health van.'
      },
      {
        text: 'ਸਾਡੇ ਇਲਾਕੇ ਦੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਵਿੱਚ ਐਮਰਜੈਂਸੀ ਸਹੂਲਤਾਂ ਦੀ ਭਾਰੀ ਕਮੀ ਹੈ।',
        lang: 'Punjabi',
        urgency: 'High',
        gap: 'High',
        popEst: 26000,
        summary: 'Rural government hospital severely lacks emergency critical care facilities.',
        action: 'Upgrade hospital infrastructure and deploy 108 ALS emergency ambulance.'
      }
    ]
  },
  {
    category: 'Electricity & Street Lighting',
    subCategories: ['Dark Spots & Missing Lights', 'Frequent Voltage Fluctuations', 'Damaged Transformer', 'Loose High-Tension Wire'],
    templates: [
      {
        text: 'हमारे गांव की मुख्य सड़क पर कोई स्ट्रीट लाइट नहीं है, रात में महिलाओं का निकलना सुरक्षित नहीं है।',
        lang: 'Hindi',
        urgency: 'High',
        gap: 'High',
        popEst: 16000,
        summary: 'Total darkness on main road creates severe safety and security vulnerability for women.',
        action: 'Install 50 smart solar LED street lights with automated dusk-to-dawn sensors.'
      },
      {
        text: 'Frequent 8-hour load shedding and dangling live wires over primary school corridor.',
        lang: 'English',
        urgency: 'Critical',
        gap: 'High',
        popEst: 22000,
        summary: 'Dangling live high-tension cables pose electrocution risk to school children.',
        action: 'Immediate cable insulation and transformer capacity augmentation.'
      }
    ]
  },
  {
    category: 'Waste Management & Environment',
    subCategories: ['Open Waste Dumping', 'No Door-to-Door Collection', 'Clogged Drainage Dumps', 'Polluted Water Body'],
    templates: [
      {
        text: 'गांव के बाहर कचरे का बड़ा ढेर लगा है जिससे भारी बदबू और मच्छर फैल रहे हैं।',
        lang: 'Hindi',
        urgency: 'High',
        gap: 'High',
        popEst: 19000,
        summary: 'Uncollected open solid waste dump spreading foul stench and vector diseases.',
        action: 'Deploy mechanical waste clearing and setup localized decentralized composting unit.'
      },
      {
        text: 'No municipal garbage pickup for 3 weeks; open plots turning into hazardous dumping zones.',
        lang: 'English',
        urgency: 'Medium',
        gap: 'Medium',
        popEst: 24000,
        summary: 'Irregular solid waste collection leading to unauthorized open garbage burning.',
        action: 'Institute scheduled daily waste collection trucks under Swachh Bharat Mission.'
      }
    ]
  },
  {
    category: 'Education & School Infrastructure',
    subCategories: ['Dilapidated School Building', 'Missing Girl Restroom', 'No Clean Drinking Water in School', 'Shortage of Desks'],
    templates: [
      {
        text: 'सरकारी प्राथमिक विद्यालय की छत से पानी टपकता है और बालिकाओं के लिए अलग शौचालय नहीं है।',
        lang: 'Hindi',
        urgency: 'Critical',
        gap: 'High',
        popEst: 8500,
        summary: 'Leaking primary school roof and absence of functional girl restrooms causing high dropouts.',
        action: 'Construct dedicated sanitation blocks and repair RCC school roof under Samagra Shiksha.'
      },
      {
        text: 'Village high school has no boundary wall and lacks clean drinking water facilities.',
        lang: 'English',
        urgency: 'Medium',
        gap: 'Medium',
        popEst: 6500,
        summary: 'School lacks boundary wall and purified drinking water station.',
        action: 'Construct perimeter security wall and install RO water filtration unit.'
      }
    ]
  },
  {
    category: 'Public Safety & Transport',
    subCategories: ['Missing Bus Shelter', 'Accident-Prone Intersection', 'No CCTV Surveillance', 'Unregulated Public Transit'],
    templates: [
      {
        text: 'हाईवे क्रॉसिंग पर कोई सिग्नल या स्पीड ब्रेकर नहीं है, आए दिन खतरनाक दुर्घटनाएं हो रही हैं।',
        lang: 'Hindi',
        urgency: 'Critical',
        gap: 'High',
        popEst: 35000,
        summary: 'Hazardous highway intersection lacking traffic calming signals triggers recurring fatal collisions.',
        action: 'Install pedestrian speed breakers, cautionary rumble strips, and solar blinker signals.'
      },
      {
        text: 'No bus shelter at key junction; hundreds of daily commuters stranded in rain and heat.',
        lang: 'English',
        urgency: 'Low',
        gap: 'Medium',
        popEst: 14000,
        summary: 'Absence of covered passenger transit shelter at primary junction.',
        action: 'Construct modern solar-powered bus shelter with seating and lighting.'
      }
    ]
  },
  {
    category: 'Digital Connectivity & Telecom',
    subCategories: ['Zero Mobile Network Coverage', 'No Broadband in Panchayat', 'Frequent Optical Fiber Cut'],
    templates: [
      {
        text: 'हमारे ग्राम पंचायत में मोबाइल नेटवर्क नहीं मिलता, ऑनलाइन पढ़ाई और सरकारी योजनाओं का काम रुक जाता है।',
        lang: 'Hindi',
        urgency: 'Medium',
        gap: 'High',
        popEst: 11000,
        summary: 'Zero cellular connectivity impedes digital public service delivery and student learning.',
        action: 'Commission 4G/5G mobile tower under BharatNet USOF initiative.'
      }
    ]
  }
];

export function generateSeedRequests(): CitizenRequest[] {
  const requests: CitizenRequest[] = [];
  let reqCounter = 1001;

  // Realistic cluster distribution across 20 districts:
  // Lucknow will have a prominent cluster (340+ requests in Roads/Drainage to demonstrate the exact prompt scenario: 127+ related reports in single issue cluster)
  // Kanpur, Patna, Pune, Gaya, Muzaffarpur, Madurai, Kolkata, Bengaluru, Jaipur, Jodhpur, etc.

  for (const loc of DISTRICT_LOCATIONS) {
    let targetVolume = 45;
    if (loc.district === 'Lucknow') targetVolume = 340; // Heavy concentration demo
    else if (loc.district === 'Kanpur Nagar') targetVolume = 180;
    else if (loc.district === 'Patna') targetVolume = 160;
    else if (loc.district === 'Pune') targetVolume = 145;
    else if (loc.district === 'Varanasi') targetVolume = 120;
    else if (loc.district === 'Prayagraj') targetVolume = 110;
    else if (loc.district === 'Bengaluru Urban') targetVolume = 135;
    else if (loc.district === 'Kolkata' || loc.district === 'North 24 Parganas') targetVolume = 130;
    else if (loc.district === 'Jaipur') targetVolume = 115;
    else if (loc.district === 'Jodhpur') targetVolume = 85;
    else if (loc.district === 'Madurai') targetVolume = 95;
    else if (loc.district === 'Coimbatore' || loc.district === 'Chennai') targetVolume = 90;
    else if (loc.district === 'Ahmedabad' || loc.district === 'Surat') targetVolume = 90;
    else if (loc.district === 'Gaya') targetVolume = 32; // Intentionally lower for Silent Need demonstration
    else if (loc.district === 'Muzaffarpur') targetVolume = 28; // Silent Need demo
    else if (loc.district === 'Wayanad') targetVolume = 35;
    else if (loc.district === 'Ludhiana') targetVolume = 60;
    else if (loc.district === 'Hyderabad') targetVolume = 110;

    for (let i = 0; i < targetVolume; i++) {
      let catTemplate: TemplateCategory;
      if (loc.district === 'Lucknow') {
        const rand = Math.random();
        if (rand < 0.45) catTemplate = CATEGORY_TEMPLATES[0]; // Road Infrastructure
        else if (rand < 0.75) catTemplate = CATEGORY_TEMPLATES[1]; // Drainage & Flood Control
        else if (rand < 0.88) catTemplate = CATEGORY_TEMPLATES[4]; // Street lighting
        else catTemplate = CATEGORY_TEMPLATES[Math.floor(Math.random() * CATEGORY_TEMPLATES.length)];
      } else if (loc.district === 'Jodhpur' || loc.district === 'Jaipur') {
        const rand = Math.random();
        if (rand < 0.50) catTemplate = CATEGORY_TEMPLATES[2]; // Water Supply
        else if (rand < 0.80) catTemplate = CATEGORY_TEMPLATES[5]; // Electricity
        else catTemplate = CATEGORY_TEMPLATES[Math.floor(Math.random() * CATEGORY_TEMPLATES.length)];
      } else {
        catTemplate = CATEGORY_TEMPLATES[Math.floor(Math.random() * CATEGORY_TEMPLATES.length)];
      }

      const t = catTemplate.templates[Math.floor(Math.random() * catTemplate.templates.length)];
      const subCat = catTemplate.subCategories[Math.floor(Math.random() * catTemplate.subCategories.length)];
      const subDistrict = loc.subDistricts[Math.floor(Math.random() * loc.subDistricts.length)];

      const latOffset = (Math.random() - 0.5) * 0.07;
      const lngOffset = (Math.random() - 0.5) * 0.07;
      const lat = Number((loc.lat + latOffset).toFixed(5));
      const lng = Number((loc.lng + lngOffset).toFixed(5));

      const scoreResult = calculatePriorityScore({
        urgency: t.urgency,
        affectedPopulation: t.popEst > 25000 ? 'High' : t.popEst > 10000 ? 'Medium' : 'Low',
        affectedPopulationEstimate: t.popEst,
        infrastructureGapLevel: t.gap,
        category: catTemplate.category,
        nearbySimilarCount: loc.district === 'Lucknow' ? 127 : 35
      });

      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);

      let status: CitizenRequest['status'] = 'AI Analysed';
      if (scoreResult.priorityScore > 88) status = 'Prioritized';
      else if (scoreResult.priorityScore > 78) status = 'Under Review';
      else if (scoreResult.priorityScore > 68) status = 'Recommended';
      if (Math.random() < 0.12) status = 'In Progress';
      if (Math.random() < 0.08) status = 'Completed';

      // Visual assessment for sample records
      let visualAssessment = undefined;
      if (catTemplate.category.includes('Road') || catTemplate.category.includes('Drainage')) {
        visualAssessment = {
          detectedIssues: ['Surface asphalt disintegration', 'Visible water accumulation', 'Sub-base erosion'],
          severityRating: scoreResult.priorityScore > 80 ? 'High' as const : 'Medium' as const,
          visibleWaterlogging: true,
          potholeSeverity: 'Deep cratering (>15cm depth)',
          structuralDamage: true,
          aiNote: 'AI-assisted visual assessment: Pothole clustering and stagnant stormwater detected. Advisory only.'
        };
      }

      requests.push({
        id: `req-${reqCounter}`,
        requestId: `JN-${loc.state.slice(0, 2).toUpperCase()}-${reqCounter}`,
        text: t.text,
        originalText: t.text,
        language: t.lang,
        translatedText: t.summary,
        category: catTemplate.category,
        subCategory: subCat,
        urgency: t.urgency,
        sentiment: t.urgency === 'Critical' ? 'Urgent' : 'Negative',
        affectedPopulation: t.popEst > 25000 ? 'High' : t.popEst > 10000 ? 'Medium' : 'Low',
        affectedPopulationEstimate: t.popEst,
        infrastructureGapLevel: t.gap,
        problemSummary: `${subDistrict}: ${t.summary}`,
        recommendedAction: t.action,
        priorityScore: scoreResult.priorityScore,
        scoreBreakdown: scoreResult.scoreBreakdown,
        location: {
          state: loc.state,
          district: loc.district,
          subDistrict,
          cityOrVillage: subDistrict,
          latitude: lat,
          longitude: lng,
          address: `${subDistrict}, ${loc.district}, ${loc.state}`
        },
        status,
        anonymous: true,
        imageUri: visualAssessment ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' : undefined,
        visualAssessment,
        aiConfidence: 0.94,
        isDemo: true,
        createdAt: date.toISOString()
      });

      reqCounter++;
    }
  }

  return requests;
}
