import React from 'react';
import { GameState } from '../types';
import { getTranslation } from '../translations';
import { RefreshCcw, Trophy, AlertTriangle } from 'lucide-react';

interface GameOverProps {
  state: GameState;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ state, onRestart }) => {
  const isWin = state.happiness > 0 && state.health > 0 && state.savings > -10000;
  const t = (key: any) => getTranslation(state.language, key);
  
  return (
    <div className="flex flex-col gap-8 text-center animate-fade-in pb-12 glass-card rounded-[32px] p-8">
      <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white ${isWin ? 'bg-accent-green/20' : 'bg-accent-red/20'}`}>
        {isWin ? (
          <Trophy className="w-14 h-14 text-accent-green" />
        ) : (
          <AlertTriangle className="w-14 h-14 text-accent-red" />
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-h1 text-brand">
          {isWin ? t('game_over_win') : t('game_over_loss')}
        </h2>
        <p className="text-body text-neutral-soft leading-relaxed">
          {isWin 
            ? "You have navigated the ups and downs of life with balance. Your family is secure, and you learned that money is a tool, not a master." 
            : "Life became overwhelming this time. Whether it was debt, health, or happiness, the balance was lost. But life gives second chances."}
        </p>
      </div>

      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-card border border-white/60 grid grid-cols-2 gap-4">
        <div className="p-2">
          <div className="text-caption text-neutral-soft uppercase tracking-widest font-bold mb-1">{t('savings')}</div>
          <div className="text-h3 font-bold text-neutral-dark">₹{state.savings.toLocaleString()}</div>
        </div>
        <div className="p-2">
          <div className="text-caption text-neutral-soft uppercase tracking-widest font-bold mb-1">{t('debt')}</div>
          <div className="text-h3 font-bold text-neutral-dark">₹{state.debt.toLocaleString()}</div>
        </div>
        <div className="p-2">
          <div className="text-caption text-neutral-soft uppercase tracking-widest font-bold mb-1">{t('happiness')}</div>
          <div className="text-h3 font-bold text-neutral-dark">{state.happiness}%</div>
        </div>
         <div className="p-2">
          <div className="text-caption text-neutral-soft uppercase tracking-widest font-bold mb-1">{t('health')}</div>
          <div className="text-h3 font-bold text-neutral-dark">{state.health}%</div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full inline-flex items-center justify-center px-10 py-4 bg-brand text-white rounded-btn font-bold text-body hover:shadow-btn-hover transition-all transform hover:-translate-y-0.5"
      >
        <RefreshCcw className="w-5 h-5 mr-3" />
        {t('restart')}
      </button>
    </div>
  );
};