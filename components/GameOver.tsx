import React, { useEffect } from 'react';
import { GameState } from '../types';
import { getTranslation } from '../translations';
import { RefreshCcw, Trophy, AlertTriangle, Skull, Frown, Lightbulb, TrendingUp } from 'lucide-react';
import { playSound } from '../services/audioService';

interface GameOverProps {
  state: GameState;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ state, onRestart }) => {
  const t = (key: any) => getTranslation(state.language, key);

  // Dynamic Debt Thresholds
  // Game Over if Debt > 6 months of income
  // Survival (Yellow) if Debt > 4 months of income
  const income = state.profile?.monthlyIncome || 15000;
  const limitDebt = income * 6;
  const warningDebt = income * 4;

  // Determine Game Over Reason
  let reason: 'win' | 'debt' | 'health' | 'happiness' | 'survival' = 'win';
  let icon = <Trophy className="w-14 h-14 text-accent-green" />;
  let colorClass = 'bg-accent-green/20 border-white';

  if (state.debt > limitDebt) {
    reason = 'debt';
    icon = <AlertTriangle className="w-14 h-14 text-accent-red" />;
    colorClass = 'bg-accent-red/20 border-white';
  } else if (state.health <= 5) {
    reason = 'health';
    icon = <Skull className="w-14 h-14 text-accent-red" />;
    colorClass = 'bg-accent-red/20 border-white';
  } else if (state.happiness <= 5) {
    reason = 'happiness';
    icon = <Frown className="w-14 h-14 text-accent-yellow" />;
    colorClass = 'bg-accent-yellow/20 border-white';
  } else if (state.debt > warningDebt) {
    reason = 'survival'; // Reached end but High Debt
    icon = <AlertTriangle className="w-14 h-14 text-accent-yellow" />;
    colorClass = 'bg-accent-yellow/20 border-white';
  }

  const isPositiveOutcome = reason === 'win';

  useEffect(() => {
    if (isPositiveOutcome) {
      playSound('win');
    } else {
      playSound('lose');
    }
  }, [isPositiveOutcome]);

  // Get dynamic texts
  let title = t('game_over_win');
  let body = t('game_over_win_body');

  switch (reason) {
    case 'debt':
      title = t('game_over_debt_title');
      body = t('game_over_debt_body');
      break;
    case 'health':
      title = t('game_over_health_title');
      body = t('game_over_health_body');
      break;
    case 'happiness':
      title = t('game_over_happiness_title');
      body = t('game_over_happiness_body');
      break;
    case 'survival':
      title = t('game_over_survival_title');
      body = t('game_over_survival_body');
      break;
  }

  // Get Role specific tip for Debt
  const role = state.profile?.occupation || 'Worker';
  const tipKey = `tip_debt_${role}`;
  // Fallback to default if role specific tip not found (though we added all roles)
  const tipText = t(tipKey).startsWith('tip_') ? t('tip_debt_default') : t(tipKey);

  const handleRestartClick = () => {
    playSound('click');
    onRestart();
  };
  
  return (
    <div className="flex flex-col gap-6 text-center animate-fade-in pb-12 glass-card rounded-[32px] p-6 sm:p-8">
      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 ${colorClass}`}>
        {icon}
      </div>

      <div className="space-y-2 sm:space-y-4">
        <h2 className="text-h1 text-brand leading-tight">
          {title}
        </h2>
        <p className="text-body text-neutral-soft leading-relaxed px-2">
          {body}
        </p>
      </div>

      {/* RECOVERY TRICK CARD - Only show if Bankrupt */}
      {reason === 'debt' && (
        <div className="bg-white/80 border border-brand/20 p-5 rounded-2xl text-left shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-accent-yellow/10 rounded-bl-full -mr-2 -mt-2"></div>
          <div className="relative z-10">
             <h4 className="text-caption font-bold text-brand uppercase tracking-wider flex items-center gap-2 mb-2">
               {t('tip_title')}
             </h4>
             <div className="flex gap-3 items-start">
                <div className="bg-accent-yellow/20 p-2 rounded-full shrink-0 text-brand-dark mt-0.5">
                   <TrendingUp size={18} strokeWidth={2.5} />
                </div>
                <p className="text-body font-medium text-neutral-dark leading-snug">
                  {tipText}
                </p>
             </div>
          </div>
        </div>
      )}

      <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-card border border-white/60 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-2">
          <div className="text-caption text-neutral-soft uppercase tracking-widest font-bold mb-1">{t('savings')}</div>
          <div className="text-h3 font-bold text-neutral-dark">₹{state.savings.toLocaleString()}</div>
        </div>
        <div className="p-2">
          <div className="text-caption text-neutral-soft uppercase tracking-widest font-bold mb-1">{t('debt')}</div>
          <div className={`text-h3 font-bold ${state.debt > warningDebt ? 'text-accent-red' : 'text-neutral-dark'}`}>
            ₹{state.debt.toLocaleString()}
          </div>
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
        onClick={handleRestartClick}
        className="w-full inline-flex items-center justify-center px-10 py-4 bg-brand text-white rounded-btn font-bold text-body hover:shadow-btn-hover transition-all transform hover:-translate-y-0.5"
      >
        <RefreshCcw className="w-5 h-5 mr-3" />
        {t('restart')}
      </button>
    </div>
  );
};