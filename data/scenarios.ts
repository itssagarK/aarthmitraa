import { Choice, PlayerProfile } from '../types';

export interface PredefinedScenario {
  id: string;
  occupation: PlayerProfile['occupation'] | 'General';
  narrative_hook: string;
  choices: Choice[];
}

export const PREDEFINED_SCENARIOS: PredefinedScenario[] = [
  // --- FARMER SCENARIOS ---
  {
    id: 'farmer_pest_attack',
    occupation: 'Farmer',
    narrative_hook: "A swarm of locusts has been spotted in the neighboring village. They could destroy your crops by tomorrow.",
    choices: [
      { id: 'pest_chemical', text: "Buy strong chemical pesticide", emoji: "☠️", cost_label: "₹8,000", tag: "Guaranteed Safety", type: "expensive" },
      { id: 'pest_organic', text: "Spray Neem & Ash solution", emoji: "🌿", cost_label: "₹500", tag: "Eco-friendly", type: "cheap" },
      { id: 'pest_noise', text: "Beat drums to scare them", emoji: "🥁", cost_label: "Free", tag: "Traditional", type: "balanced" }
    ]
  },
  {
    id: 'farmer_tractor_breakdown',
    occupation: 'Farmer',
    narrative_hook: "Your tractor engine died halfway through ploughing. The sowing season ends in 3 days.",
    choices: [
      { id: 'tractor_rent', text: "Rent neighbor's tractor", emoji: "🚜", cost_label: "₹5,000", tag: "Quick fix", type: "balanced" },
      { id: 'tractor_repair', text: "Urgent repair mechanic", emoji: "🔧", cost_label: "₹12,000", tag: "Long term", type: "expensive" },
      { id: 'tractor_oxen', text: "Use oxen plough", emoji: "🐂", cost_label: "Free", tag: "Hard Labor", type: "cheap" }
    ]
  },
  {
    id: 'farmer_mandi_price',
    occupation: 'Farmer',
    narrative_hook: "The Mandi (market) prices have crashed. The agent is offering half the expected rate for your harvest.",
    choices: [
      { id: 'sell_now', text: "Sell at low price", emoji: "💸", cost_label: "Loss", tag: "Instant Cash", type: "cheap" },
      { id: 'cold_storage', text: "Store in Cold Storage", emoji: "❄️", cost_label: "₹3,000/mo", tag: "Wait for price", type: "balanced" },
      { id: 'direct_sell', text: "Travel to city to sell", emoji: "city", cost_label: "₹2,000 fuel", tag: "High Effort", type: "expensive" }
    ]
  },

  // --- SHOPKEEPER SCENARIOS ---
  {
    id: 'shop_festival_stock',
    occupation: 'Shopkeeper',
    narrative_hook: "Diwali is next week. Customers are asking for the latest fancy gift items which you don't have.",
    choices: [
      { id: 'stock_loan', text: "Take loan for heavy stock", emoji: "📦", cost_label: "₹50,000", tag: "High Risk/Reward", type: "expensive" },
      { id: 'stock_moderate', text: "Buy limited popular items", emoji: "🛍️", cost_label: "₹15,000", tag: "Safe Bet", type: "balanced" },
      { id: 'stock_old', text: "Polish and sell old stock", emoji: "✨", cost_label: "Free", tag: "Reputation Risk", type: "cheap" }
    ]
  },
  {
    id: 'shop_competitor',
    occupation: 'Shopkeeper',
    narrative_hook: "A new 'Super Mart' opened down the street giving 20% discounts. Your regular customers are curious.",
    choices: [
      { id: 'comp_renovate', text: "Renovate & add AC", emoji: "❄️", cost_label: "₹30,000", tag: "Modernize", type: "expensive" },
      { id: 'comp_loyalty', text: "Start 'Udhaar' (Credit) book", emoji: "📖", cost_label: "Risk", tag: "Customer Loyalty", type: "balanced" },
      { id: 'comp_discount', text: "Slash your own prices", emoji: "📉", cost_label: "Low Margin", tag: "Price War", type: "cheap" }
    ]
  },
  {
    id: 'shop_inspector',
    occupation: 'Shopkeeper',
    narrative_hook: "The Food Safety Inspector has come for a surprise check. He found some expired biscuits.",
    choices: [
      { id: 'insp_bribe', text: "Pay 'settlement' fee", emoji: "🤫", cost_label: "₹5,000", tag: "Unethical", type: "expensive" },
      { id: 'insp_fine', text: "Accept official fine", emoji: "🧾", cost_label: "₹2,000", tag: "Legal", type: "balanced" },
      { id: 'insp_argue', text: "Argue it's a mistake", emoji: "🗣️", cost_label: "Risk", tag: "Bold", type: "cheap" }
    ]
  },

  // --- STUDENT SCENARIOS ---
  {
    id: 'student_exam_prep',
    occupation: 'Student',
    narrative_hook: "Final exams are in 10 days. You feel completely unprepared for Math.",
    choices: [
      { id: 'exam_coaching', text: "Join Crash Course", emoji: "👨‍🏫", cost_label: "₹4,000", tag: "Guaranteed Help", type: "expensive" },
      { id: 'exam_guide', text: "Buy '20 Questions' Guide", emoji: "📖", cost_label: "₹500", tag: "Shortcut", type: "balanced" },
      { id: 'exam_group', text: "Group study with friends", emoji: "🤝", cost_label: "Free", tag: "Distracting?", type: "cheap" }
    ]
  },
  {
    id: 'student_broken_phone',
    occupation: 'Student',
    narrative_hook: "You dropped your phone and the screen shattered. You need it for online classes.",
    choices: [
      { id: 'phone_new', text: "Buy latest 5G phone", emoji: "📱", cost_label: "₹15,000", tag: "Upgrade", type: "expensive" },
      { id: 'phone_repair', text: "Replace screen", emoji: "🔧", cost_label: "₹2,500", tag: "Fix it", type: "balanced" },
      { id: 'phone_adjust', text: "Use with cracked screen", emoji: "🕸️", cost_label: "Free", tag: "Hard to read", type: "cheap" }
    ]
  },
  {
    id: 'student_trip',
    occupation: 'Student',
    narrative_hook: "Your entire friend group is planning a trip to Goa after exams. Everyone is going.",
    choices: [
      { id: 'trip_go', text: "Go! (Ask parents for money)", emoji: "🏖️", cost_label: "₹8,000", tag: "FOMO", type: "expensive" },
      { id: 'trip_budget', text: "Suggest cheaper local trip", emoji: "picnic", cost_label: "₹1,500", tag: "Compromise", type: "balanced" },
      { id: 'trip_skip', text: "Stay home & sleep", emoji: "🏠", cost_label: "Free", tag: "Miss out", type: "cheap" }
    ]
  },

  // --- WORKER SCENARIOS ---
  {
    id: 'worker_strike',
    occupation: 'Worker',
    narrative_hook: "The Factory Union has called for a strike demanding higher wages. No work means no pay today.",
    choices: [
      { id: 'strike_join', text: "Join the strike", emoji: "✊", cost_label: "No Pay", tag: "Solidarity", type: "cheap" },
      { id: 'strike_scab', text: "Work secretly", emoji: "🤫", cost_label: "Double Pay", tag: "Dangerous", type: "expensive" },
      { id: 'strike_home', text: "Stay home & rest", emoji: "🏠", cost_label: "No Pay", tag: "Safe", type: "balanced" }
    ]
  },
  {
    id: 'worker_injury',
    occupation: 'Worker',
    narrative_hook: "You sprained your back lifting heavy cement sacks. It hurts to even stand.",
    choices: [
      { id: 'health_private', text: "Private Specialist", emoji: "👨‍⚕️", cost_label: "₹2,000", tag: "Quick Relief", type: "expensive" },
      { id: 'health_gov', text: "Government Hospital", emoji: "🏥", cost_label: "₹50", tag: "Long Queue", type: "balanced" },
      { id: 'health_ignore', text: "Painkillers & Work", emoji: "💊", cost_label: "₹10", tag: "Risky", type: "cheap" }
    ]
  },
  {
    id: 'worker_loan_request',
    occupation: 'Worker',
    narrative_hook: "Your cousin in the village asks for ₹5,000 for his sister's wedding. He promises to return it 'soon'.",
    choices: [
      { id: 'loan_give', text: "Give full amount", emoji: "💸", cost_label: "₹5,000", tag: "Family Duty", type: "expensive" },
      { id: 'loan_half', text: "Give ₹2,000 as gift", emoji: "🎁", cost_label: "₹2,000", tag: "No return expected", type: "balanced" },
      { id: 'loan_deny', text: "Say you have no money", emoji: "🙅", cost_label: "Free", tag: "Relation hurt", type: "cheap" }
    ]
  }
];
