import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ScenarioView } from './components/ScenarioView';
import { FeedbackView } from './components/FeedbackView';
import { GameOver } from './components/GameOver';
import { FinancialTipCard } from './components/FinancialTipCard';
import { GameState, PlayerProfile, Choice, Language, OCCUPATIONS } from './types';
import { startSimulation, nextTurn } from './services/geminiService';

// --- UTILS ---
const safeParseInt = (val: any): number => {
  if (typeof val === 'number') return Math.round(val);
  if (typeof val === 'string') {
    // Remove commas, currency symbols, and whitespace
    const clean = val.replace(/[^0-9.-]/g, '');
    return Math.round(Number(clean)) || 0;
  }
  return 0;
};

// --- TIP DATA & LOGIC ---

const TIP_DATABASE = {
  high_debt: {
    en: "Debt eats your future. Pay off high-interest loans before spending on luxury.",
    hi: "कर्ज आपके भविष्य को खा जाता है। शौक पूरा करने से पहले कर्ज चुकाएं।",
    hinglish: "Udhaar future kha jaata hai. Luxury se pehle high-interest loan chukao."
  },
  low_health: {
    en: "Health is your true wealth. You cannot earn if you are sick.",
    hi: "सेहत ही असली दौलत है। अगर आप बीमार हैं तो कमा नहीं सकते।",
    hinglish: "Health hi asli wealth hai. Bimaar rahoge toh kamaoge kaise?"
  },
  low_savings: {
    en: "Start small. Even ₹10 saved daily builds a shield against bad days.",
    hi: "छोटी शुरुआत करें। रोज ₹10 बचाने से भी बुरे वक्त में मदद मिलती है।",
    hinglish: "Choti shuruwat karo. Roz ₹10 bachana bhi bure waqt mein kaam aata hai."
  },
  Farmer: {
    en: "Don't rely on just one crop. Diversification is nature's insurance.",
    hi: "सिर्फ एक फसल पर निर्भर न रहें। विविधता ही प्रकृति का बीमा है।",
    hinglish: "Sirf ek crop par depend mat raho. Alag-alag fasal lagana hi safety hai."
  },
  Shopkeeper: {
    en: "Never mix shop cash with household expense money. Keep two wallets.",
    hi: "दुकान के गल्ले को घर के खर्च से न मिलाएं। दो अलग पर्स रखें।",
    hinglish: "Shop ke galle ko ghar ke kharche se mix mat karo. Do alag wallet rakho."
  },
  Student: {
    en: "Degrees get interviews, but skills get jobs. Keep learning new things.",
    hi: "डिग्री से इंटरव्यू मिलता है, लेकिन हुनर से नौकरी। नई चीजें सीखते रहें।",
    hinglish: "Degree se interview milta hai, par skills se job. Nayi cheezein seekhte raho."
  },
  Worker: {
    en: "Your body is your biggest asset. Don't skip meals to save money.",
    hi: "आपका शरीर ही आपकी सबसे बड़ी पूंजी है। पैसे बचाने के लिए खाना न छोड़ें।",
    hinglish: "Body hi aapka asset hai. Paise bachane ke chakkar mein khana mat skip karo."
  },
  default: {
    en: "Money is a tool, not a master. Control it before it controls you.",
    hi: "पैसा एक औजार है, मालिक नहीं। इसे काबू में रखें वरना यह आपको काबू कर लेगा।",
    hinglish: "Paisa ek tool hai, master nahi. Isse control karo warna ye tumhe control karega."
  }
};

const getContextualTip = (state: GameState): string => {
  const { debt, health, savings, profile, language } = state;
  
  let tipKey: keyof typeof TIP_DATABASE = 'default';

  // Priority 1: Critical Stats
  if (debt > 25000) {
    tipKey = 'high_debt';
  } else if (health < 40) {
    tipKey = 'low_health';
  } else if (savings < 2000) {
    tipKey = 'low_savings';
  } 
  // Priority 2: Role Specific
  else if (profile?.occupation && TIP_DATABASE[profile.occupation as keyof typeof TIP_DATABASE]) {
    tipKey = profile.occupation as keyof typeof TIP_DATABASE;
  }

  const tipObj = TIP_DATABASE[tipKey] || TIP_DATABASE['default'];
  return tipObj[language] || tipObj['en'];
};


// --- MAIN APP COMPONENT ---

// Default initial state
const initialState: GameState = {
  profile: null,
  language: 'en',
  savings: 0,
  debt: 0,
  happiness: 80,
  health: 80,
  turn: 1,
  history: [],
  statHistory: [],
  currentEvent: null,
  lastEventData: null,
  isLoading: false,
  error: null,
  gameStatus: 'ONBOARDING',
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const handleLanguageChange = (lang: Language) => {
    setGameState(prev => ({ ...prev, language: lang }));
  };

  const handleStartGame = async (profile: PlayerProfile) => {
    setGameState(prev => ({ 
      ...prev, 
      profile, 
      isLoading: true,
      // Initialize savings based on occupation
      savings: OCCUPATIONS.find(o => o.id === profile.occupation)?.baseSavings || 5000
    }));

    try {
      const eventData = await startSimulation(profile, gameState.language);
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        gameStatus: 'PLAYING',
        currentEvent: eventData,
        history: [...prev.history, eventData.narrative_hook]
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: "Arth Mitra is having trouble connecting. Please try again."
      }));
    }
  };

  const handleChoice = async (choice: Choice) => {
    if (!gameState.currentEvent || !gameState.profile) return;

    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 1. Get AI Response (Impact + Next Turn)
      const resultData = await nextTurn(gameState, choice.id, choice.text, choice.cost_label);
      
      const impacts = resultData.impact_on_stats;
      
      // 2. Update Stats with Safe Parsing
      setGameState(prev => {
        const impactSavings = safeParseInt(impacts.savings);
        const impactDebt = safeParseInt(impacts.debt);
        const impactHappiness = safeParseInt(impacts.happiness);
        const impactHealth = safeParseInt(impacts.health);

        let newSavings = prev.savings + impactSavings;
        let newDebt = prev.debt + impactDebt;
        
        // Smart Balance Normalization
        // If savings go negative, debt increases.
        if (newSavings < 0) {
          newDebt += Math.abs(newSavings);
          newSavings = 0;
        }
        
        // If debt goes negative (overpaid), it flows back to savings.
        if (newDebt < 0) {
          newSavings += Math.abs(newDebt);
          newDebt = 0;
        }

        let newHappiness = prev.happiness + impactHappiness;
        let newHealth = prev.health + impactHealth;
        
        newHappiness = Math.min(100, Math.max(0, newHappiness));
        newHealth = Math.min(100, Math.max(0, newHealth));

        // 3. Record history (Actual delta after normalization)
        const actualChangeSavings = newSavings - prev.savings;
        const actualChangeDebt = newDebt - prev.debt;
        const actualChangeHappiness = newHappiness - prev.happiness;
        const actualChangeHealth = newHealth - prev.health;

        const newTransaction = {
          turn: prev.turn,
          description: choice.text,
          changes: {
            savings: actualChangeSavings,
            debt: actualChangeDebt,
            happiness: actualChangeHappiness,
            health: actualChangeHealth
          }
        };

        return {
          ...prev,
          isLoading: false,
          savings: newSavings,
          debt: newDebt,
          happiness: newHappiness,
          health: newHealth,
          turn: prev.turn + 1,
          statHistory: [...prev.statHistory, newTransaction],
          lastEventData: resultData, 
          currentEvent: resultData, 
          gameStatus: 'FEEDBACK'
        };
      });

    } catch (error) {
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        error: "Connection lost. Arth Mitra is thinking..."
      }));
    }
  };

  const handleNextTurn = () => {
    setGameState(prev => {
       const isDepressed = prev.happiness <= 0;
       const isSick = prev.health <= 0;
       const isHighDebt = prev.debt > 50000;
       const isMaxTurns = prev.turn >= 12;
       
       const isGameOver = isDepressed || isSick || isHighDebt || isMaxTurns || prev.lastEventData?.isGameOver;

       return {
         ...prev,
         gameStatus: isGameOver ? 'ENDED' : 'PLAYING'
       };
    });
  };

  const handleRestart = () => {
    setGameState(initialState);
  };

  // Get current tip based on state
  const currentTip = useMemo(() => getContextualTip(gameState), [
    gameState.debt, 
    gameState.health, 
    gameState.savings, 
    gameState.profile?.occupation, 
    gameState.language,
    gameState.turn // Update tip every turn
  ]);

  return (
    // Outer Layout: Full height, flex column, hidden overflow
    <div className="h-full w-full flex flex-col bg-[#f0fdf9] text-neutral-dark font-sans overflow-hidden relative">
      
      {/* Background Gradient Layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#f0fdf9] to-[#fff5f2] pointer-events-none" />

      {/* Header: Static, safe from overlap */}
      <div className="relative z-50 flex-none border-b border-white/20 shadow-sm bg-white/40 backdrop-blur-md">
        <Header language={gameState.language} onLanguageChange={handleLanguageChange} />
      </div>

      {/* Scrollable Main Area: Content pushes naturally */}
      <main className="relative z-0 flex-1 overflow-y-auto overflow-x-hidden w-full scroll-smooth">
        <div className="w-full max-w-[500px] mx-auto px-4 pb-12 flex flex-col min-h-full">
          
          {/* Error Banner */}
          {gameState.error && (
            <div className="mt-4 p-4 bg-accent-red/10 border border-accent-red/20 text-accent-red rounded-card animate-fade-in text-caption">
              {gameState.error}
            </div>
          )}

          {/* Onboarding */}
          {gameState.gameStatus === 'ONBOARDING' && (
            <div className="flex-1 flex flex-col justify-center py-6">
              <Onboarding 
                onComplete={handleStartGame} 
                isLoading={gameState.isLoading} 
                language={gameState.language}
                setLanguage={handleLanguageChange}
              />
            </div>
          )}

          {/* Game Loop */}
          {(gameState.gameStatus === 'PLAYING' || gameState.gameStatus === 'FEEDBACK') && gameState.currentEvent && (
            <div className="flex flex-col w-full animate-fade-in">
              
              {/* Sticky Dashboard inside scroll area */}
              {/* Stacks naturally below Header visually, but sticks to top of scroll area */}
              <Dashboard state={gameState} />
              
              {/* Vertical spacing after dashboard */}
              <div className="h-6 shrink-0" /> 
              
              {/* Dynamic Content Area */}
              <div className="flex flex-col gap-6 w-full">
                {gameState.gameStatus === 'PLAYING' ? (
                  <ScenarioView 
                    event={gameState.currentEvent} 
                    onMakeChoice={handleChoice} 
                    isLoading={gameState.isLoading} 
                    state={gameState}
                  />
                ) : (
                  gameState.lastEventData && (
                    <FeedbackView 
                      lastEvent={gameState.lastEventData}
                      language={gameState.language}
                      onNext={handleNextTurn}
                    />
                  )
                )}
                
                {/* Contextual Financial Tip Section */}
                <FinancialTipCard 
                  key={gameState.turn} // Force re-render/animation on new turn
                  tip={currentTip} 
                  language={gameState.language} 
                />
                
              </div>
            </div>
          )}

          {/* Game Over */}
          {gameState.gameStatus === 'ENDED' && (
             <div className="flex-1 flex flex-col justify-center py-6">
              <GameOver state={gameState} onRestart={handleRestart} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;