export interface ActiveIngredient {
  name: string;
  amount: string;
  purpose: string;
}

export type MedicationCategory =
  | 'pain-relief'
  | 'cold-respiratory'
  | 'digestive-wellness'
  | 'vitamins-supplements'
  | 'prescription-cardio';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: MedicationCategory;
  categoryLabel: string;
  type: 'bottle' | 'box' | 'spray' | 'blister' | 'amber-bottle';
  packageStyle: {
    primaryColor: string;
    secondaryColor: string;
    capColor: string;
    labelTextColor: string;
    accentGlow: string;
  };
  price: number;
  inStock: number;
  rating: number;
  reviewCount: number;
  badge?: 'OTC' | 'Rx Required' | 'Pharmacist Pick' | 'Fast Acting';
  requiresPrescription: boolean;
  dosageForm: string; // e.g. "20 Liquid Softgels", "100 Caplets", "120 Sprays"
  strength: string; // e.g. "200mg", "500mg"
  ndcCode: string; // National Drug Code format
  directions: string;
  warnings: string[];
  activeIngredients: ActiveIngredient[];
  indications: string[];
  drugInteractions: string[]; // List of generic drug names that conflict with this
  storage: string;
  // Spatial Shelf placement parameters
  shelfLocation: {
    aisle: number; // 1: Pain & Cold, 2: Digestive & Vitamins, 3: Rx Care
    tier: number;  // 0: bottom, 1: middle, 2: top
    slot: number;  // slot along the shelf
  };
}

export const MEDICATION_CATEGORIES: { id: MedicationCategory; label: string; icon: string; aisle: number; desc: string }[] = [
  { id: 'pain-relief', label: 'Pain & Fever Relief', icon: 'ShieldAlert', aisle: 1, desc: 'Analgesics, anti-inflammatories & muscle care' },
  { id: 'cold-respiratory', label: 'Cold, Sinus & Allergy', icon: 'Wind', aisle: 1, desc: 'Antihistamines, decongestants & cough solutions' },
  { id: 'digestive-wellness', label: 'Digestive & Gut Health', icon: 'HeartPulse', aisle: 2, desc: 'Acid reducers, probiotics & stomach soothing' },
  { id: 'vitamins-supplements', label: 'Vitamins & Immunity', icon: 'Sparkles', aisle: 2, desc: 'Essential daily nutrients, minerals & Omega-3' },
  { id: 'prescription-cardio', label: 'Prescription & Daily Care', icon: 'FileText', aisle: 3, desc: 'Blood pressure, glucose & cardiovascular therapy' },
];

export const MEDICATIONS: Medication[] = [
  // AISLE 1 - Shelf 1: PAIN & FEVER
  {
    id: 'advil-ultra',
    name: 'Advil Ultra Ibuprofen Liquid Gels',
    genericName: 'Ibuprofen',
    brand: 'Advil Healthcare',
    category: 'pain-relief',
    categoryLabel: 'Pain & Fever Relief',
    type: 'bottle',
    packageStyle: {
      primaryColor: '#0369a1',
      secondaryColor: '#f59e0b',
      capColor: '#ffffff',
      labelTextColor: '#ffffff',
      accentGlow: '#0ea5e9',
    },
    price: 12.49,
    inStock: 34,
    rating: 4.8,
    reviewCount: 312,
    badge: 'Fast Acting',
    requiresPrescription: false,
    dosageForm: '80 Solubilized Softgels',
    strength: '200 mg',
    ndcCode: 'NDC 00573-0164-40',
    directions: 'Take 1 softgel every 4 to 6 hours while symptoms persist. If pain or fever does not respond, 2 softgels may be used. Do not exceed 6 softgels in 24 hours.',
    warnings: [
      'Stomach bleeding warning: NSAID may cause severe stomach bleeding',
      'Do not take immediately before or after heart surgery',
      'Ask a doctor if you have high blood pressure or kidney disease'
    ],
    activeIngredients: [
      { name: 'Solubilized Ibuprofen', amount: '200mg', purpose: 'Pain reliever / Fever reducer (NSAID)' },
    ],
    indications: ['Headache', 'Toothache', 'Backache', 'Menstrual Cramps', 'Minor Arthritis Pain', 'Fever'],
    drugInteractions: ['Aspirin', 'Naproxen', 'Warfarin', 'Lisinopril'],
    storage: 'Store between 20-25°C (68-77°F). Avoid excessive heat above 40°C.',
    shelfLocation: { aisle: 1, tier: 2, slot: 0 },
  },
  {
    id: 'tylenol-extra',
    name: 'Tylenol Extra Strength Rapid Release',
    genericName: 'Acetaminophen',
    brand: 'Johnson & Johnson',
    category: 'pain-relief',
    categoryLabel: 'Pain & Fever Relief',
    type: 'bottle',
    packageStyle: {
      primaryColor: '#dc2626',
      secondaryColor: '#ffffff',
      capColor: '#b91c1c',
      labelTextColor: '#ffffff',
      accentGlow: '#ef4444',
    },
    price: 14.99,
    inStock: 48,
    rating: 4.9,
    reviewCount: 520,
    badge: 'Pharmacist Pick',
    requiresPrescription: false,
    dosageForm: '100 Laser-Drilled Gelcaps',
    strength: '500 mg',
    ndcCode: 'NDC 50580-496-01',
    directions: 'Adults: Take 2 gelcaps every 6 hours while symptoms last. Do not take more than 6 gelcaps in 24 hours, unless directed by a doctor.',
    warnings: [
      'Liver warning: Severe liver damage may occur if you take more than 4,000 mg in 24 hours',
      'Do not use with any other drug containing acetaminophen',
      'Do not consume 3 or more alcoholic drinks daily while using'
    ],
    activeIngredients: [
      { name: 'Acetaminophen', amount: '500mg', purpose: 'Pain reliever / Fever reducer' },
    ],
    indications: ['Migraines', 'Tension Headaches', 'Muscular Aches', 'Sore Throat', 'Common Cold Fever'],
    drugInteractions: ['Warfarin', 'Other Acetaminophen products'],
    storage: 'Store at controlled room temperature 20-25°C. Tamper-evident seal.',
    shelfLocation: { aisle: 1, tier: 2, slot: 1 },
  },
  {
    id: 'voltaren-arthritis',
    name: 'Voltaren Topical Arthritis Pain Relief',
    genericName: 'Diclofenac Sodium Gel',
    brand: 'GSK Consumer Health',
    category: 'pain-relief',
    categoryLabel: 'Pain & Fever Relief',
    type: 'box',
    packageStyle: {
      primaryColor: '#ea580c',
      secondaryColor: '#ffffff',
      capColor: '#c2410c',
      labelTextColor: '#ffffff',
      accentGlow: '#f97316',
    },
    price: 18.25,
    inStock: 19,
    rating: 4.7,
    reviewCount: 189,
    badge: 'OTC',
    requiresPrescription: false,
    dosageForm: '100g Medicated Emulgel Tube',
    strength: '1% w/w',
    ndcCode: 'NDC 0067-8144-01',
    directions: 'Apply 2g to 4g of gel to affected joint (hands, wrists, elbows, feet, ankles, knees) up to 4 times daily. Use dosing card provided.',
    warnings: [
      'For external use only. Do not apply to open wounds or infected skin',
      'NSAID absorption can cause cardiovascular or GI risks in rare cases'
    ],
    activeIngredients: [
      { name: 'Diclofenac Sodium', amount: '10mg/g', purpose: 'Nonsteroidal Anti-inflammatory Gel' },
    ],
    indications: ['Osteoarthritis Joint Pain', 'Stiff Knee Joints', 'Hand & Finger Arthritic Pain'],
    drugInteractions: ['Ibuprofen', 'Naproxen', 'Oral Diclofenac'],
    storage: 'Store between 20-25°C (68-77°F). Keep cap tightly closed.',
    shelfLocation: { aisle: 1, tier: 1, slot: 0 },
  },
  {
    id: 'aleve-naproxen',
    name: 'Aleve All-Day Back & Muscle Pain',
    genericName: 'Naproxen Sodium',
    brand: 'Bayer Healthcare',
    category: 'pain-relief',
    categoryLabel: 'Pain & Fever Relief',
    type: 'bottle',
    packageStyle: {
      primaryColor: '#1d4ed8',
      secondaryColor: '#60a5fa',
      capColor: '#ffffff',
      labelTextColor: '#ffffff',
      accentGlow: '#2563eb',
    },
    price: 11.89,
    inStock: 27,
    rating: 4.6,
    reviewCount: 204,
    badge: 'OTC',
    requiresPrescription: false,
    dosageForm: '50 Caplets',
    strength: '220 mg',
    ndcCode: 'NDC 0280-2100-50',
    directions: 'Take 1 caplet every 8 to 12 hours with a full glass of water. For first dose you may take 2 caplets in first hour.',
    warnings: [
      'Stomach bleeding warning: Do not take more than 2 caplets in any 8-to-12 hour period',
      'Consult physician if taking blood thinners'
    ],
    activeIngredients: [
      { name: 'Naproxen Sodium', amount: '220mg', purpose: 'Pain reliever / fever reducer' },
    ],
    indications: ['Lower Back Pain', 'Muscle Strains', 'Menstrual Cramps', 'Minor Joint Pain'],
    drugInteractions: ['Ibuprofen', 'Aspirin', 'Warfarin'],
    storage: 'Store at 20-25°C. Protect from high humidity.',
    shelfLocation: { aisle: 1, tier: 1, slot: 1 },
  },

  // AISLE 1 - Shelf 2: COLD, SINUS & ALLERGY
  {
    id: 'flonase-allergy',
    name: 'Flonase 24HR Allergy Relief Spray',
    genericName: 'Fluticasone Propionate',
    brand: 'Haleon',
    category: 'cold-respiratory',
    categoryLabel: 'Cold, Sinus & Allergy',
    type: 'spray',
    packageStyle: {
      primaryColor: '#047857',
      secondaryColor: '#facc15',
      capColor: '#065f46',
      labelTextColor: '#ffffff',
      accentGlow: '#10b981',
    },
    price: 23.99,
    inStock: 22,
    rating: 4.8,
    reviewCount: 410,
    badge: 'Pharmacist Pick',
    requiresPrescription: false,
    dosageForm: '14.4 mL (120 Metered Sprays)',
    strength: '50 mcg/spray',
    ndcCode: 'NDC 0135-0453-02',
    directions: 'Shake gently before each use. Prime before first use. Adults: 2 sprays in each nostril once daily. After 1-2 weeks, reduce to 1 spray daily.',
    warnings: [
      'Only for use in the nose. Do not spray into eyes or mouth',
      'Growth rate in some children may be decreased if used long-term'
    ],
    activeIngredients: [
      { name: 'Fluticasone Propionate (Glucocorticoid)', amount: '50mcg', purpose: 'Nasal allergy symptom reliever' },
    ],
    indications: ['Nasal Congestion', 'Sneezing', 'Runny Nose', 'Itchy, Watery Eyes'],
    drugInteractions: ['Ritonavir', 'Ketoconazole'],
    storage: 'Store between 4° and 30°C (39° and 86°F). Shake well before use.',
    shelfLocation: { aisle: 1, tier: 0, slot: 0 },
  },
  {
    id: 'dayquil-severe',
    name: 'DayQuil Severe Cold & Flu Max',
    genericName: 'Acetaminophen, Dextromethorphan, Guaifenesin, Phenylephrine',
    brand: 'Vicks Healthcare',
    category: 'cold-respiratory',
    categoryLabel: 'Cold, Sinus & Allergy',
    type: 'box',
    packageStyle: {
      primaryColor: '#ea580c',
      secondaryColor: '#0284c7',
      capColor: '#c2410c',
      labelTextColor: '#ffffff',
      accentGlow: '#f97316',
    },
    price: 15.49,
    inStock: 41,
    rating: 4.7,
    reviewCount: 290,
    badge: 'OTC',
    requiresPrescription: false,
    dosageForm: '24 Non-Drowsy LiquiCaps',
    strength: '325mg / 10mg / 200mg / 5mg',
    ndcCode: 'NDC 37000-482-24',
    directions: 'Take 2 LiquiCaps with water every 4 hours. Do not exceed 8 LiquiCaps per 24 hours.',
    warnings: [
      'Liver warning: Contains acetaminophen',
      'Do not use if you are now taking a prescription MAOI'
    ],
    activeIngredients: [
      { name: 'Acetaminophen', amount: '325mg', purpose: 'Pain reliever / fever reducer' },
      { name: 'Dextromethorphan HBr', amount: '10mg', purpose: 'Cough suppressant' },
      { name: 'Guaifenesin', amount: '200mg', purpose: 'Expectorant' },
      { name: 'Phenylephrine HCl', amount: '5mg', purpose: 'Nasal decongestant' },
    ],
    indications: ['Chest Congestion', 'Nasal Pressure', 'Coughing', 'Sore Throat', 'Fever'],
    drugInteractions: ['MAOI Antidepressants', 'Other Acetaminophen drugs', 'Blood pressure medications'],
    storage: 'Store at room temperature. Avoid excessive heat.',
    shelfLocation: { aisle: 1, tier: 0, slot: 1 },
  },
  {
    id: 'zyrtec-allergy',
    name: 'Zyrtec 24 Hour Allergy Relief',
    genericName: 'Cetirizine HCl',
    brand: 'Kenvue',
    category: 'cold-respiratory',
    categoryLabel: 'Cold, Sinus & Allergy',
    type: 'bottle',
    packageStyle: {
      primaryColor: '#16a34a',
      secondaryColor: '#ffffff',
      capColor: '#15803d',
      labelTextColor: '#ffffff',
      accentGlow: '#22c55e',
    },
    price: 21.99,
    inStock: 30,
    rating: 4.8,
    reviewCount: 380,
    badge: 'OTC',
    requiresPrescription: false,
    dosageForm: '60 Coated Tablets',
    strength: '10 mg',
    ndcCode: 'NDC 50580-726-60',
    directions: 'Adults and children 6 years and over: one 10 mg tablet once daily; do not take more than one 10 mg tablet in 24 hours.',
    warnings: [
      'Drowsiness may occur. Be careful when driving or operating machinery',
      'Alcohol, sedatives, and tranquilizers may increase drowsiness'
    ],
    activeIngredients: [
      { name: 'Cetirizine HCl', amount: '10mg', purpose: 'Antihistamine' },
    ],
    indications: ['Pollen & Grass Allergy', 'Dust Mite & Pet Dander', 'Itchy Nose & Throat', 'Hives'],
    drugInteractions: ['Sedatives', 'Alcohol'],
    storage: 'Store at 20° to 25°C (68° to 77°F).',
    shelfLocation: { aisle: 1, tier: 0, slot: 2 },
  },

  // AISLE 2 - Shelf 1: DIGESTIVE & GUT HEALTH
  {
    id: 'omeprazole-delayed',
    name: 'Omeprazole 24HR Acid Reducer',
    genericName: 'Omeprazole Delayed-Release',
    brand: 'Prilosec OTC',
    category: 'digestive-wellness',
    categoryLabel: 'Digestive & Gut Health',
    type: 'box',
    packageStyle: {
      primaryColor: '#7c3aed',
      secondaryColor: '#f43f5e',
      capColor: '#6d28d9',
      labelTextColor: '#ffffff',
      accentGlow: '#8b5cf6',
    },
    price: 26.50,
    inStock: 25,
    rating: 4.9,
    reviewCount: 367,
    badge: 'Pharmacist Pick',
    requiresPrescription: false,
    dosageForm: '42 Capsules (Three 14-Day Courses)',
    strength: '20 mg',
    ndcCode: 'NDC 0006-3331-42',
    directions: 'Take 1 capsule before morning breakfast every day for 14 days. Swallow whole; do not chew or crush. Repeat 14-day course no more than every 4 months.',
    warnings: [
      'Not intended for immediate relief of heartburn; may take 1 to 4 days for full effect',
      'Consult doctor if heartburn lasts longer than 3 months or accompanied by dizziness'
    ],
    activeIngredients: [
      { name: 'Omeprazole magnesium', amount: '20.6mg (equivalent to 20mg omeprazole)', purpose: 'Proton Pump Inhibitor (Acid reducer)' },
    ],
    indications: ['Frequent Heartburn occurring 2+ days a week', 'Acid Reflux', 'Sour Stomach'],
    drugInteractions: ['Clopidogrel (Plavix)', 'Citalopram', 'Diazepam', 'Iron supplements'],
    storage: 'Store at 20-25°C. Keep protected from moisture in original carton.',
    shelfLocation: { aisle: 2, tier: 2, slot: 0 },
  },
  {
    id: 'pepto-bismol',
    name: 'Pepto Bismol 5-Symptom Relief',
    genericName: 'Bismuth Subsalicylate',
    brand: 'Procter & Gamble',
    category: 'digestive-wellness',
    categoryLabel: 'Digestive & Gut Health',
    type: 'bottle',
    packageStyle: {
      primaryColor: '#db2777',
      secondaryColor: '#fef08a',
      capColor: '#be185d',
      labelTextColor: '#ffffff',
      accentGlow: '#ec4899',
    },
    price: 8.99,
    inStock: 53,
    rating: 4.8,
    reviewCount: 490,
    badge: 'OTC',
    requiresPrescription: false,
    dosageForm: '354 mL Liquid Suspension',
    strength: '525 mg / 30 mL',
    ndcCode: 'NDC 37000-025-12',
    directions: 'Shake well before use. Use dosing cup. Adults: 30 mL every 1/2 hour or 60 mL every hour as needed. Do not exceed 8 doses (240 mL) in 24 hours.',
    warnings: [
      'Reye syndrome warning: Children and teenagers recovering from chicken pox or flu should not use',
      'Contains salicylate: temporary darkening of the tongue or stool is harmless'
    ],
    activeIngredients: [
      { name: 'Bismuth Subsalicylate', amount: '525mg/30mL', purpose: 'Upset stomach reliever / Antidiarrheal' },
    ],
    indications: ['Nausea', 'Heartburn', 'Indigestion', 'Upset Stomach', 'Diarrhea'],
    drugInteractions: ['Aspirin', 'Tetracycline antibiotics', 'Blood thinners'],
    storage: 'Avoid excessive heat (over 104°F or 40°C). Do not freeze.',
    shelfLocation: { aisle: 2, tier: 2, slot: 1 },
  },
  {
    id: 'culturelle-probiotic',
    name: 'Culturelle Daily Probiotic Digestive Care',
    genericName: 'Lactobacillus rhamnosus GG (LGG)',
    brand: 'i-Health Inc',
    category: 'digestive-wellness',
    categoryLabel: 'Digestive & Gut Health',
    type: 'box',
    packageStyle: {
      primaryColor: '#0d9488',
      secondaryColor: '#f59e0b',
      capColor: '#0f766e',
      labelTextColor: '#ffffff',
      accentGlow: '#14b8a6',
    },
    price: 24.99,
    inStock: 35,
    rating: 4.7,
    reviewCount: 220,
    badge: 'Pharmacist Pick',
    requiresPrescription: false,
    dosageForm: '30 Vegetarian Capsules',
    strength: '10 Billion CFUs',
    ndcCode: 'NDC 86000-331-30',
    directions: 'For daily use, take 1 capsule per day. For optimal results, continued daily use is suggested.',
    warnings: [
      'If pregnant or immunocompromised, consult a physician before using',
      'Store in a cool dry place out of direct sunlight'
    ],
    activeIngredients: [
      { name: 'Lactobacillus rhamnosus GG', amount: '10 Billion CFUs', purpose: 'Probiotic digestive balance' },
      { name: 'Inulin (Prebiotic)', amount: '200mg', purpose: 'Prebiotic dietary fiber' },
    ],
    indications: ['Occasional Gas & Bloating', 'Digestive Regularity', 'Immune Balance'],
    drugInteractions: ['Antibiotics (take at least 2 hours apart)'],
    storage: 'Room temperature below 25°C. No refrigeration required.',
    shelfLocation: { aisle: 2, tier: 1, slot: 0 },
  },

  // AISLE 2 - Shelf 2: VITAMINS & IMMUNITY
  {
    id: 'nature-vitamin-d3',
    name: 'Nature Made Vitamin D3 2000 IU',
    genericName: 'Cholecalciferol (Vitamin D3)',
    brand: 'Nature Made',
    category: 'vitamins-supplements',
    categoryLabel: 'Vitamins & Immunity',
    type: 'amber-bottle',
    packageStyle: {
      primaryColor: '#d97706',
      secondaryColor: '#fef3c7',
      capColor: '#b45309',
      labelTextColor: '#ffffff',
      accentGlow: '#f59e0b',
    },
    price: 13.99,
    inStock: 62,
    rating: 4.9,
    reviewCount: 640,
    badge: 'Pharmacist Pick',
    requiresPrescription: false,
    dosageForm: '220 Softgels',
    strength: '2000 IU (50 mcg)',
    ndcCode: 'NDC 31604-026-20',
    directions: 'Adults: Take 1 softgel daily with water and a meal for optimal absorption.',
    warnings: [
      'Keep out of reach of children',
      'Consult your doctor if you have kidney disease or high calcium levels'
    ],
    activeIngredients: [
      { name: 'Vitamin D3 (as Cholecalciferol)', amount: '50mcg (2000 IU)', purpose: 'Bone, teeth, muscle & immune support' },
    ],
    indications: ['Immune System Support', 'Bone Strength', 'Calcium Absorption', 'Mood Balance'],
    drugInteractions: ['Digoxin', 'Thiazide diuretics'],
    storage: 'Keep bottle tightly closed. Store at room temperature in a dry place.',
    shelfLocation: { aisle: 2, tier: 0, slot: 0 },
  },
  {
    id: 'nordic-omega-3',
    name: 'Nordic Naturals Ultimate Omega Lemon',
    genericName: 'Purified Deep Sea Fish Oil',
    brand: 'Nordic Naturals',
    category: 'vitamins-supplements',
    categoryLabel: 'Vitamins & Immunity',
    type: 'amber-bottle',
    packageStyle: {
      primaryColor: '#0284c7',
      secondaryColor: '#fde047',
      capColor: '#0369a1',
      labelTextColor: '#ffffff',
      accentGlow: '#38bdf8',
    },
    price: 29.95,
    inStock: 28,
    rating: 4.9,
    reviewCount: 480,
    badge: 'OTC',
    requiresPrescription: false,
    dosageForm: '60 Softgels (Lemon Flavored)',
    strength: '1280 mg Omega-3s',
    ndcCode: 'NDC 72001-140-60',
    directions: 'Take 2 softgels daily with food, or as directed by your healthcare professional.',
    warnings: [
      'Consult with your physician before using if you are allergic to iodine or take blood thinners'
    ],
    activeIngredients: [
      { name: 'EPA (Eicosapentaenoic Acid)', amount: '650mg', purpose: 'Cardiovascular & cellular wellness' },
      { name: 'DHA (Docosahexaenoic Acid)', amount: '450mg', purpose: 'Brain & ocular health' },
    ],
    indications: ['Heart Health', 'Brain Function', 'Joint Mobility', 'Healthy Cellular Repair'],
    drugInteractions: ['Anticoagulants (Warfarin, Heparin)'],
    storage: 'Store in a cool, dry place, away from sunlight. Do not take if tamper-evident seal is broken.',
    shelfLocation: { aisle: 2, tier: 0, slot: 1 },
  },

  // AISLE 3 - Shelf 1: PRESCRIPTION & DAILY CARE (Behind Rx Counter)
  {
    id: 'lipitor-atorvastatin',
    name: 'Lipitor (Atorvastatin Calcium)',
    genericName: 'Atorvastatin Calcium',
    brand: 'Pfizer Labs',
    category: 'prescription-cardio',
    categoryLabel: 'Prescription & Daily Care',
    type: 'bottle',
    packageStyle: {
      primaryColor: '#0f766e',
      secondaryColor: '#ffffff',
      capColor: '#134e4a',
      labelTextColor: '#ffffff',
      accentGlow: '#14b8a6',
    },
    price: 32.50,
    inStock: 18,
    rating: 4.8,
    reviewCount: 140,
    badge: 'Rx Required',
    requiresPrescription: true,
    dosageForm: '30 White Elliptical Tablets',
    strength: '20 mg',
    ndcCode: 'NDC 0071-0156-23',
    directions: 'Take 1 tablet by mouth daily at the same time each day, with or without food as prescribed by your doctor.',
    warnings: [
      'Prescription Only: Federal law prohibits dispensing without prescription',
      'Avoid drinking large quantities of grapefruit juice (more than 1 quart daily)',
      'Notify your doctor immediately if you experience unexplained muscle pain or weakness'
    ],
    activeIngredients: [
      { name: 'Atorvastatin Calcium Trihydrate', amount: '20mg', purpose: 'HMG-CoA reductase inhibitor (Statin)' },
    ],
    indications: ['Hypercholesterolemia', 'Cardiovascular Risk Reduction', 'Atherosclerosis Prevention'],
    drugInteractions: ['Clarithromycin', 'Cyclosporine', 'Gemfibrozil', 'Grapefruit Juice'],
    storage: 'Store at 20° to 25°C (68° to 77°F). Controlled room temperature.',
    shelfLocation: { aisle: 3, tier: 2, slot: 0 },
  },
  {
    id: 'lisinopril-cardio',
    name: 'Lisinopril Tablets USP',
    genericName: 'Lisinopril',
    brand: 'AstraZeneca Pharmaceuticals',
    category: 'prescription-cardio',
    categoryLabel: 'Prescription & Daily Care',
    type: 'bottle',
    packageStyle: {
      primaryColor: '#4338ca',
      secondaryColor: '#a5b4fc',
      capColor: '#3730a3',
      labelTextColor: '#ffffff',
      accentGlow: '#6366f1',
    },
    price: 15.00,
    inStock: 42,
    rating: 4.7,
    reviewCount: 215,
    badge: 'Rx Required',
    requiresPrescription: true,
    dosageForm: '90 Round Pink Tablets',
    strength: '10 mg',
    ndcCode: 'NDC 0310-0131-10',
    directions: 'Take 1 tablet once daily with or without food. Follow doctor dosing adjustments.',
    warnings: [
      'Prescription Only: Do not use during pregnancy due to fetal toxicity risk',
      'May cause dry persistent cough or elevated potassium levels'
    ],
    activeIngredients: [
      { name: 'Lisinopril', amount: '10mg', purpose: 'ACE Inhibitor (Angiotensin-Converting Enzyme)' },
    ],
    indications: ['Hypertension (High Blood Pressure)', 'Heart Failure Adjunct', 'Post-Myocardial Infarction'],
    drugInteractions: ['Potassium supplements', 'NSAIDs (Ibuprofen, Naproxen)', 'Lithium'],
    storage: 'Store between 20° and 25°C (68° and 77°F). Dispense in tight container.',
    shelfLocation: { aisle: 3, tier: 2, slot: 1 },
  },
  {
    id: 'metformin-er',
    name: 'Glucophage XR (Metformin HCl)',
    genericName: 'Metformin Hydrochloride Extended-Release',
    brand: 'Merck Healthcare',
    category: 'prescription-cardio',
    categoryLabel: 'Prescription & Daily Care',
    type: 'box',
    packageStyle: {
      primaryColor: '#059669',
      secondaryColor: '#d1fae5',
      capColor: '#047857',
      labelTextColor: '#ffffff',
      accentGlow: '#10b981',
    },
    price: 19.80,
    inStock: 30,
    rating: 4.8,
    reviewCount: 165,
    badge: 'Rx Required',
    requiresPrescription: true,
    dosageForm: '60 White Oblong Tablets',
    strength: '500 mg',
    ndcCode: 'NDC 0087-6060-05',
    directions: 'Swallow whole with evening meal. Do not crush, cut, or chew the extended-release tablet.',
    warnings: [
      'Prescription Only: Lactic acidosis is a rare but serious metabolic complication',
      'Discontinue temporarily before iodinated contrast radiographic procedures'
    ],
    activeIngredients: [
      { name: 'Metformin Hydrochloride', amount: '500mg', purpose: 'Biguanide antihyperglycemic' },
    ],
    indications: ['Type 2 Diabetes Mellitus Glycemic Control', 'Insulin Sensitivity Management'],
    drugInteractions: ['Alcohol', 'Cimetidine', 'Contrast dye agents'],
    storage: 'Store at 20° to 25°C (68° to 77°F). Protect from light and moisture.',
    shelfLocation: { aisle: 3, tier: 1, slot: 0 },
  },
];
