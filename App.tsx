import React, { useState } from 'react';
import { Header } from './components/Header';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ScenarioView } from './components/ScenarioView';
import { FeedbackView } from './components/FeedbackView';
import { GameOver } from './components/GameOver';
import { GameState, PlayerProfile, Choice, Language, OCCUPATIONS } from './types';
import { startSimulation, nextTurn } from './services/geminiService';

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
      const resultData = await nextTurn(gameState, choice.id, choice.text);
      
      const impacts = resultData.impact_on_stats;
      
      // 2. Update Stats temporarily but hold off on showing next scenario
      // We show the Feedback view first using the data from resultData (previous_outcome_*)
      setGameState(prev => {
        const newSavings = prev.savings + impacts.savings;
        const newDebt = prev.debt + impacts.debt;
        let newHappiness = prev.happiness + impacts.happiness;
        let newHealth = prev.health + (impacts.health || 0);
        
        // Cap stats 0-100
        newHappiness = Math.min(100, Math.max(0, newHappiness));
        newHealth = Math.min(100, Math.max(0, newHealth));

        return {
          ...prev,
          isLoading: false,
          savings: newSavings,
          debt: newDebt,
          happiness: newHappiness,
          health: newHealth,
          turn: prev.turn + 1,
          
          // Store the FULL result data to show in Feedback view
          lastEventData: resultData, 
          // Don't update currentEvent yet (narrative hook), wait for user to click Next
          currentEvent: resultData, 
          
          gameStatus: 'FEEDBACK' // Switch to Feedback mode
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
       // Simple Game Over logic checks
       const isBankrupt = prev.savings < -10000;
       const isDepressed = prev.happiness <= 0;
       const isSick = prev.health <= 0;
       const isMaxTurns = prev.turn >= 12;
       const isGameOver = isBankrupt || isDepressed || isSick || isMaxTurns || prev.lastEventData?.isGameOver;

       return {
         ...prev,
         gameStatus: isGameOver ? 'ENDED' : 'PLAYING'
       };
    });
  };

  const handleRestart = () => {
    setGameState(initialState);
  };

  return (
    <div className="min-h-screen text-neutral-dark font-sans flex flex-col bg-fixed">
      <Header language={gameState.language} onLanguageChange={handleLanguageChange} />

      {/* Main Container - Natural Flow, No Overlaps */}
      <main className="flex-1 w-full max-w-[500px] mx-auto px-4 py-6 flex flex-col gap-6 relative z-0">
        
        {gameState.error && (
          <div className="p-4 bg-accent-red/10 border border-accent-red/20 text-accent-red rounded-card backdrop-blur-sm animate-fade-in text-caption">
            {gameState.error}
          </div>
        )}

        {gameState.gameStatus === 'ONBOARDING' && (
          <Onboarding 
            onComplete={handleStartGame} 
            isLoading={gameState.isLoading} 
            language={gameState.language}
            setLanguage={handleLanguageChange}
          />
        )}

        {/* Game Loop Container */}
        {(gameState.gameStatus === 'PLAYING' || gameState.gameStatus === 'FEEDBACK') && gameState.currentEvent && (
          <div className="flex flex-col gap-6 w-full animate-fade-in">
            <Dashboard state={gameState} />
            
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
            </div>
          </div>
        )}

        {gameState.gameStatus === 'ENDED' && (
          <GameOver state={gameState} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
};

export default App;