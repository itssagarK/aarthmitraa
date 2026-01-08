export type Language = 'en' | 'hi' | 'hinglish';

export interface PlayerProfile {
  name: string;
  occupation: 'Farmer' | 'Shopkeeper' | 'Student' | 'Worker';
  monthlyIncome: number;
}

export interface Choice {
  id: string;
  text: string; // The main action text
  emoji?: string; // Visual icon
  cost_label?: string; // e.g., "₹8000"
  tag?: string; // e.g., "Loved | Wallet empty"
  type: 'expensive' | 'balanced' | 'cheap'; // For color coding
}

export interface StatImpact {
  savings: number;
  debt: number;
  happiness: number;
  health: number;
}

export interface GameEvent {
  narrative_hook: string; // Short, punchy 1-liner
  choices: Choice[];
  
  // Data regarding the PREVIOUS turn's result (for Feedback View)
  previous_outcome_title?: string; // e.g. "You handled that well!"
  previous_outcome_desc?: string; // e.g. "Neighbors are happy, but wallet is crying."
  impact_on_stats?: StatImpact;
  isGameOver?: boolean;
}

export interface GameState {
  profile: PlayerProfile | null;
  language: Language;
  
  // Stats
  savings: number;
  debt: number;
  happiness: number;
  health: number;
  
  turn: number;
  history: string[];
  
  currentEvent: GameEvent | null;
  lastEventData: GameEvent | null; // To show feedback for the just-completed turn
  
  isLoading: boolean;
  error: string | null;
  
  // Flow control
  gameStatus: 'ONBOARDING' | 'PLAYING' | 'FEEDBACK' | 'ENDED';
}

export const OCCUPATIONS = [
  { id: 'Farmer', label: { en: 'Farmer', hi: 'किसान', hinglish: 'Kisan' }, icon: '🌾', desc: 'Connected to earth', baseIncome: 15000, baseSavings: 20000 },
  { id: 'Shopkeeper', label: { en: 'Shopkeeper', hi: 'दुकानदार', hinglish: 'Dukandaar' }, icon: '🏪', desc: 'Heart of the market', baseIncome: 20000, baseSavings: 50000 },
  { id: 'Worker', label: { en: 'Daily Worker', hi: 'मज़दूर', hinglish: 'Worker' }, icon: '🔨', desc: 'Building dreams', baseIncome: 12000, baseSavings: 5000 },
  { id: 'Student', label: { en: 'Student', hi: 'छात्र', hinglish: 'Student' }, icon: '📚', desc: 'Future leader', baseIncome: 3000, baseSavings: 2000 },
] as const;