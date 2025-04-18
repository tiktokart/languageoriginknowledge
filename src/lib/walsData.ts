
// WALS (World Atlas of Language Structures) data service
// This handles loading and processing language data

export type Language = {
  id: string;
  name: string;
  family: string;
  latitude: number;
  longitude: number;
  isoCode?: string;
  genera?: string;
  macroarea?: string;
  countryCode?: string;
  features?: Record<string, any>;
  speakers?: number; // Add speakers property as optional
};

// Actual WALS categories for language features
export const featureCategories = [
  "Phonology",
  "Morphology",
  "Nominal Categories",
  "Nominal Syntax",
  "Verbal Categories",
  "Word Order",
  "Simple Clauses",
  "Complex Sentences",
  "Lexicon",
  "Other"
];

// Major world regions (macroareas) from WALS
export const macroareas = [
  "Africa",
  "Australia",
  "Eurasia",
  "North America",
  "Papunesia",
  "South America"
];

// Major language families from WALS
export const languageFamilies = [
  "Afro-Asiatic",
  "Algic",
  "Altaic",
  "Arawakan",
  "Athabaskan",
  "Atlantic-Congo",
  "Austroasiatic",
  "Austronesian",
  "Aymaran",
  "Carib",
  "Chibchan",
  "Dravidian",
  "Eskimo-Aleut",
  "Indo-European",
  "Iroquoian",
  "Japonic",
  "Koreanic",
  "Mande",
  "Mayan",
  "Mixe-Zoque",
  "Mongolic",
  "Na-Dene",
  "Niger-Congo",
  "Nilo-Saharan",
  "Otomanguean",
  "Pama-Nyungan",
  "Quechuan",
  "Salishan",
  "Sino-Tibetan",
  "Siouan",
  "Tai-Kadai",
  "Tupian",
  "Turkic",
  "Uralic",
  "Uto-Aztecan"
];

// This function generates a realistic dataset based on actual WALS properties
export const generateWalsLanguageData = (count: number = 300): Language[] => {
  // A selection of real languages from WALS with correct language families
  const realLanguages = [
    { name: 'English', family: 'Indo-European', lat: 52.0, lng: 0.0, iso: 'eng' },
    { name: 'Spanish', family: 'Indo-European', lat: 40.0, lng: -4.0, iso: 'spa' },
    { name: 'Mandarin Chinese', family: 'Sino-Tibetan', lat: 34.0, lng: 110.0, iso: 'cmn' },
    { name: 'Arabic', family: 'Afro-Asiatic', lat: 25.0, lng: 35.0, iso: 'ara' },
    { name: 'Hindi', family: 'Indo-European', lat: 25.0, lng: 77.0, iso: 'hin' },
    { name: 'Bengali', family: 'Indo-European', lat: 24.0, lng: 90.0, iso: 'ben' },
    { name: 'Portuguese', family: 'Indo-European', lat: 38.7, lng: -9.0, iso: 'por' },
    { name: 'Russian', family: 'Indo-European', lat: 56.0, lng: 38.0, iso: 'rus' },
    { name: 'Japanese', family: 'Japonic', lat: 35.0, lng: 135.0, iso: 'jpn' },
    { name: 'German', family: 'Indo-European', lat: 52.0, lng: 10.0, iso: 'deu' },
    { name: 'Swahili', family: 'Niger-Congo', lat: -6.0, lng: 35.0, iso: 'swh' },
    { name: 'French', family: 'Indo-European', lat: 48.0, lng: 2.0, iso: 'fra' },
    { name: 'Korean', family: 'Koreanic', lat: 37.0, lng: 127.0, iso: 'kor' },
    { name: 'Italian', family: 'Indo-European', lat: 43.0, lng: 12.0, iso: 'ita' },
    { name: 'Turkish', family: 'Turkic', lat: 39.0, lng: 35.0, iso: 'tur' },
    { name: 'Polish', family: 'Indo-European', lat: 52.0, lng: 19.0, iso: 'pol' },
    { name: 'Ukrainian', family: 'Indo-European', lat: 49.0, lng: 32.0, iso: 'ukr' },
    { name: 'Persian', family: 'Indo-European', lat: 32.0, lng: 53.0, iso: 'fas' },
    { name: 'Thai', family: 'Tai-Kadai', lat: 15.0, lng: 100.0, iso: 'tha' },
    { name: 'Greek', family: 'Indo-European', lat: 39.0, lng: 22.0, iso: 'ell' },
    { name: 'Finnish', family: 'Uralic', lat: 62.0, lng: 26.0, iso: 'fin' },
    { name: 'Hungarian', family: 'Uralic', lat: 47.0, lng: 19.0, iso: 'hun' },
    { name: 'Vietnamese', family: 'Austroasiatic', lat: 16.0, lng: 107.0, iso: 'vie' },
    { name: 'Tagalog', family: 'Austronesian', lat: 14.0, lng: 121.0, iso: 'tgl' },
    { name: 'Yoruba', family: 'Niger-Congo', lat: 8.0, lng: 4.0, iso: 'yor' },
    { name: 'Igbo', family: 'Niger-Congo', lat: 6.0, lng: 7.0, iso: 'ibo' },
    { name: 'Zulu', family: 'Niger-Congo', lat: -28.0, lng: 31.0, iso: 'zul' },
    { name: 'Xhosa', family: 'Niger-Congo', lat: -32.0, lng: 27.0, iso: 'xho' },
    { name: 'Amharic', family: 'Afro-Asiatic', lat: 9.0, lng: 38.0, iso: 'amh' },
    { name: 'Somali', family: 'Afro-Asiatic', lat: 5.0, lng: 46.0, iso: 'som' },
    { name: 'Hausa', family: 'Afro-Asiatic', lat: 11.0, lng: 8.0, iso: 'hau' },
    { name: 'Oromo', family: 'Afro-Asiatic', lat: 7.0, lng: 40.0, iso: 'orm' },
    { name: 'Quechua', family: 'Quechuan', lat: -13.0, lng: -74.0, iso: 'que' },
    { name: 'Guarani', family: 'Tupian', lat: -25.0, lng: -57.0, iso: 'grn' },
    { name: 'Navajo', family: 'Na-Dene', lat: 36.0, lng: -109.0, iso: 'nav' },
    { name: 'Hawaiian', family: 'Austronesian', lat: 19.0, lng: -155.0, iso: 'haw' },
    { name: 'Inuktitut', family: 'Eskimo-Aleut', lat: 63.0, lng: -68.0, iso: 'iku' },
    { name: 'Maori', family: 'Austronesian', lat: -40.0, lng: 176.0, iso: 'mri' },
    { name: 'Samoan', family: 'Austronesian', lat: -13.0, lng: -172.0, iso: 'smo' },
    { name: 'Tongan', family: 'Austronesian', lat: -21.0, lng: -175.0, iso: 'ton' },
    { name: 'Fijian', family: 'Austronesian', lat: -18.0, lng: 178.0, iso: 'fij' },
    { name: 'Dutch', family: 'Indo-European', lat: 52.0, lng: 5.0, iso: 'nld' },
    { name: 'Swedish', family: 'Indo-European', lat: 59.0, lng: 15.0, iso: 'swe' },
    { name: 'Norwegian', family: 'Indo-European', lat: 61.0, lng: 8.0, iso: 'nor' },
    { name: 'Danish', family: 'Indo-European', lat: 56.0, lng: 10.0, iso: 'dan' },
    { name: 'Icelandic', family: 'Indo-European', lat: 65.0, lng: -19.0, iso: 'isl' },
    { name: 'Irish', family: 'Indo-European', lat: 53.0, lng: -8.0, iso: 'gle' },
    { name: 'Welsh', family: 'Indo-European', lat: 52.0, lng: -3.0, iso: 'cym' },
    { name: 'Basque', family: 'Language Isolate', lat: 43.0, lng: -2.0, iso: 'eus' },
    { name: 'Catalan', family: 'Indo-European', lat: 41.0, lng: 2.0, iso: 'cat' },
    { name: 'Kannada', family: 'Dravidian', lat: 13.0, lng: 77.0, iso: 'kan' },
    { name: 'Tamil', family: 'Dravidian', lat: 11.0, lng: 79.0, iso: 'tam' },
    { name: 'Telugu', family: 'Dravidian', lat: 16.0, lng: 80.0, iso: 'tel' },
    { name: 'Malayalam', family: 'Dravidian', lat: 10.0, lng: 76.0, iso: 'mal' },
    { name: 'Punjabi', family: 'Indo-European', lat: 30.0, lng: 75.0, iso: 'pan' },
    { name: 'Gujarati', family: 'Indo-European', lat: 23.0, lng: 72.0, iso: 'guj' },
    { name: 'Mongolian', family: 'Mongolic', lat: 46.0, lng: 105.0, iso: 'mon' },
    { name: 'Tibetan', family: 'Sino-Tibetan', lat: 31.0, lng: 88.0, iso: 'bod' },
    { name: 'Khmer', family: 'Austroasiatic', lat: 12.0, lng: 105.0, iso: 'khm' },
    { name: 'Burmese', family: 'Sino-Tibetan', lat: 21.0, lng: 96.0, iso: 'mya' },
    { name: 'Lao', family: 'Tai-Kadai', lat: 18.0, lng: 103.0, iso: 'lao' }
  ];

  // Additional realistic language names by region to use instead of "Language {id}"
  const additionalLanguages = {
    "Africa": [
      "Wolof", "Maasai", "Kikuyu", "Berber", "Lingala", "Twi", "Ndebele", "Tswana", 
      "Tigrinya", "Kinyarwanda", "Shona", "Bambara", "Kanuri", "Sesotho", "Luganda"
    ],
    "Europe": [
      "Breton", "Occitan", "Frisian", "Luxembourgish", "Corsican", "Romani", "Sami", 
      "Sardinian", "Galician", "Faroese", "Maltese", "Gagauz", "Aromanian"
    ],
    "Asia": [
      "Uyghur", "Sindhi", "Pashto", "Balochi", "Hakka", "Assamese", "Rajasthani", 
      "Marathi", "Konkani", "Kashmiri", "Meitei", "Tulu", "Dzongkha", "Nepali",
      "Sinhala", "Lhasa", "Bhojpuri", "Maithili", "Wu", "Cantonese"
    ],
    "North America": [
      "Cree", "Ojibwe", "Sioux", "Cherokee", "Comanche", "Mohawk", "Nez Perce", 
      "Yupik", "Tlingit", "Haida", "Hopi", "Apache", "Choctaw", "Chickasaw"
    ],
    "South America": [
      "Aymara", "Mapudungun", "Kichwa", "Wayuu", "Nahuatl", "Toba", "Mapuche", 
      "Tupi", "Taíno", "Huichol", "Mixtec", "Tzotzil", "Zapotec", "Yanomami"
    ],
    "Oceania": [
      "Tok Pisin", "Hiri Motu", "Tetum", "Tahitian", "Chamorro", "Marshallese", 
      "Palauan", "Gilbertese", "Bislama", "Nauruan", "Chuukese", "Kosraean", 
      "Rapanui", "Niuean", "Tuvaluan"
    ]
  };

  // Generate realistic WALS-like features based on actual WALS parameters
  const generateFeatures = (): Record<string, any> => {
    const features: Record<string, any> = {};
    
    // Actual WALS features with their documented values
    const walsFeatures = [
      { 
        category: "Phonology", 
        name: "Consonant-Vowel Ratio", 
        values: ["Low", "Moderately low", "Average", "Moderately high", "High"] 
      },
      { 
        category: "Phonology", 
        name: "Vowel Quality Inventory", 
        values: ["Small (2-4)", "Medium (5-6)", "Large (7-14)", "Very large (>14)"] 
      },
      { 
        category: "Phonology", 
        name: "Consonant Inventory", 
        values: ["Small", "Moderately small", "Average", "Moderately large", "Large"] 
      },
      { 
        category: "Phonology", 
        name: "Tone System", 
        values: ["No tones", "Simple tone system", "Complex tone system"] 
      },
      { 
        category: "Morphology", 
        name: "Prefixing vs. Suffixing", 
        values: ["Strongly suffixing", "Weakly suffixing", "Equal prefixing and suffixing", "Weakly prefixing", "Strongly prefixing"] 
      },
      { 
        category: "Morphology", 
        name: "Fusion of Selected Inflectional Formatives", 
        values: ["Exclusively concatenative", "Predominantly concatenative", "Mixture of concatenative and fusion", "Predominantly fusional", "Exclusively fusional"] 
      },
      { 
        category: "Word Order", 
        name: "Order of Subject, Object and Verb", 
        values: ["SOV", "SVO", "VSO", "VOS", "OVS", "OSV", "No dominant order"] 
      },
      { 
        category: "Word Order", 
        name: "Order of Adjective and Noun", 
        values: ["Adjective-Noun", "Noun-Adjective", "No dominant order", "Both orders with neither dominant"] 
      },
      { 
        category: "Nominal Categories", 
        name: "Definite Articles", 
        values: ["No definite article", "Definite word distinct from demonstrative", "Definite affix", "Demonstrative used as definite article"] 
      },
      { 
        category: "Nominal Categories", 
        name: "Number of Genders", 
        values: ["None", "Two", "Three", "Four", "Five or more"] 
      },
      { 
        category: "Nominal Syntax", 
        name: "Possessive Classification", 
        values: ["None", "Two classes", "Three to five classes", "Six or more classes"] 
      },
      { 
        category: "Verbal Categories", 
        name: "Perfective/Imperfective Aspect", 
        values: ["No grammatical marking", "Grammatical marking", "Perfective/imperfective distinct"] 
      },
      { 
        category: "Simple Clauses", 
        name: "Alignment of Case Marking of Full Noun Phrases", 
        values: ["Nominative - accusative", "Ergative - absolutive", "Active - stative", "Tripartite", "Neutral"] 
      }
    ];
    
    // Choose a subset of features (5-10)
    const numFeatures = Math.floor(Math.random() * 6) + 5;
    const selectedFeatures = [...walsFeatures]
      .sort(() => 0.5 - Math.random())
      .slice(0, numFeatures);
    
    // Add the selected features with random values
    selectedFeatures.forEach(feature => {
      const value = feature.values[Math.floor(Math.random() * feature.values.length)];
      features[`${feature.category}: ${feature.name}`] = value;
    });
    
    return features;
  };

  // Start with real languages
  const languages: Language[] = realLanguages.map((lang, i) => ({
    id: `lang-${i}`,
    name: lang.name,
    family: lang.family,
    latitude: lang.lat,
    longitude: lang.lng,
    isoCode: lang.iso,
    features: generateFeatures(),
    speakers: Math.floor(Math.random() * 900000000) + 100000 // Random speaker count between 100k and 900M
  }));
  
  // Generate additional languages if needed
  if (count > realLanguages.length) {
    const additionalCount = count - realLanguages.length;
    
    // Create additional languages with realistic distribution
    const macroareaCoordinates = [
      { name: "Africa", lat: 5, lng: 20, radius: 30 },
      { name: "Europe", lat: 50, lng: 10, radius: 20 },
      { name: "Asia", lat: 35, lng: 100, radius: 40 },
      { name: "North America", lat: 40, lng: -100, radius: 30 },
      { name: "South America", lat: -20, lng: -60, radius: 30 },
      { name: "Oceania", lat: -25, lng: 135, radius: 40 }
    ];
    
    for (let i = 0; i < additionalCount; i++) {
      const langId = realLanguages.length + i;
      
      // Choose a region and generate coordinates within that region
      const region = macroareaCoordinates[Math.floor(Math.random() * macroareaCoordinates.length)];
      
      // Random offset within the region
      const randomAngle = Math.random() * Math.PI * 2;
      const randomDistance = Math.random() * region.radius;
      const latOffset = randomDistance * Math.cos(randomAngle);
      const lngOffset = randomDistance * Math.sin(randomAngle);
      
      const latitude = Math.min(85, Math.max(-85, region.lat + latOffset));
      const longitude = region.lng + lngOffset;
      
      // Choose a family that makes sense for the region
      let family: string;
      
      switch (region.name) {
        case "Africa":
          family = ["Niger-Congo", "Afro-Asiatic", "Nilo-Saharan"][Math.floor(Math.random() * 3)];
          break;
        case "Europe":
          family = ["Indo-European", "Uralic", "Turkic"][Math.floor(Math.random() * 3)];
          break;
        case "Asia":
          family = ["Sino-Tibetan", "Austroasiatic", "Japonic", "Koreanic", "Dravidian", "Tai-Kadai", "Turkic"][Math.floor(Math.random() * 7)];
          break;
        case "North America":
          family = ["Na-Dene", "Algic", "Iroquoian", "Uto-Aztecan", "Eskimo-Aleut"][Math.floor(Math.random() * 5)];
          break;
        case "South America":
          family = ["Arawakan", "Quechuan", "Tupian", "Carib", "Aymaran"][Math.floor(Math.random() * 5)];
          break;
        case "Oceania":
          family = ["Austronesian", "Pama-Nyungan"][Math.floor(Math.random() * 2)];
          break;
        default:
          family = languageFamilies[Math.floor(Math.random() * languageFamilies.length)];
      }
      
      // Select a language name from the appropriate region
      const regionKey = region.name === "Europe" || region.name === "Asia" ? 
        region.name : 
        region.name === "Oceania" ? "Oceania" : 
        region.name.includes("America") ? region.name : "Africa";
      
      const availableNames = additionalLanguages[regionKey as keyof typeof additionalLanguages];
      const nameIndex = i % availableNames.length;
      const languageName = availableNames[nameIndex];
      
      // Add a variant number if we have to reuse names
      const finalName = i >= availableNames.length ? 
        `${languageName} (Variant ${Math.floor(i / availableNames.length) + 1})` : 
        languageName;
      
      languages.push({
        id: `lang-${langId}`,
        name: finalName,
        family,
        latitude,
        longitude,
        macroarea: region.name,
        features: generateFeatures(),
        speakers: Math.floor(Math.random() * 10000000) + 10000 // Random speaker count between 10k and 10M for lesser-known languages
      });
    }
  }
  
  return languages;
};

// Function to fetch WALS data
// In a real implementation, this would fetch from an API or parse actual WALS data files
export const fetchWalsLanguages = async (): Promise<Language[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateWalsLanguageData(300));
    }, 1500);
  });
};
