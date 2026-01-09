import React, { useEffect } from 'react';
import { GameEvent, Language } from '../types';
import { getTranslation } from '../translations';
import { TrendingUp, TrendingDown, Heart, Smile, ArrowRight, IndianRupee, Info } from 'lucide-react';
import { playSound } from '../services/audioService';

interface FeedbackViewProps {
  lastEvent: GameEvent;
  language: Language;
  onNext: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ lastEvent, language, onNext }) => {
  const impacts = lastEvent.impact_on_stats;

  useEffect(() => {
    if (!impacts) return;
    
    // Play sound based on result
    const isBadOutcome = (impacts.debt > 500) || (impacts.happiness < -5) || (impacts.health < -5);
    const isGoodOutcome = (impacts.savings > 0) || (impacts.happiness > 5);

    if (isBadOutcome) {
      playSound('error');
    } else if (isGoodOutcome) {
      playSound('success');
    } else {
      playSound('click'); // Neutral
    }
  }, [lastEvent]); 

  if (!impacts) return null;

  const t = (key: any) => getTranslation(language, key);

  const handleNextClick = () => {
    playSound('click');
    onNext();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in justify-center w-full">
      
      {/* Result Story Card */}
      <div className="glass-card p-8 rounded-card text-center shadow-xl border-white/60">
        <div className="inline-block px-4 py-1.5 rounded-full bg-accent-yellow/20 text-brand text-caption font-bold tracking-wide uppercase mb-6">
          Result
        </div>
        <h2 className="text-h1 text-brand mb-4 leading-tight">
          {lastEvent.previous_outcome_title || "Done!"}
        </h2>
        <p className="text-body text-neutral-soft leading-relaxed mb-6">
          {lastEvent.previous_outcome_desc}
        </p>

        {/* Financial Flow Explanation */}
        {lastEvent.financial_explanation && (
           <div className="bg-white/60 border border-white/80 rounded-2xl p-4 text-caption text-neutral-dark flex items-start gap-3 text-left shadow-sm">
              <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <span className="leading-snug">{lastEvent.financial_explanation}</span>
           </div>
        )}
      </div>

      {/* Stat Changes Grid - Naturally flows */}
      <div className="grid grid-cols-2 gap-4 w-full">
        
        {/* Savings Impact */}
        {impacts.savings !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${impacts.savings > 0 ? 'border-accent-green/50' : 'border-accent-red/50'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('savings')}</span>
            <div className={`text-h3 font-bold flex items-center ${impacts.savings > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              <IndianRupee className="w-4 h-4 mr-1" />
              {impacts.savings > 0 ? '+' : ''}{impacts.savings}
            </div>
          </div>
        )}

        {/* Happiness Impact */}
        {impacts.happiness !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${impacts.happiness > 0 ? 'border-accent-yellow/50' : 'border-neutral-soft/30'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('happiness')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.happiness > 0 ? 'text-accent-yellow' : 'text-neutral-soft'}`}>
              <Smile className="w-5 h-5 mr-1" />
              {impacts.happiness > 0 ? '+' : ''}{impacts.happiness}%
            </div>
          </div>
        )}

         {/* Health Impact */}
         {impacts.health !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${impacts.health > 0 ? 'border-accent-pink/50' : 'border-accent-red/50'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('health')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.health > 0 ? 'text-accent-pink' : 'text-accent-red'}`}>
              <Heart className="w-5 h-5 mr-1" />
              {impacts.health > 0 ? '+' : ''}{impacts.health}%
            </div>
          </div>
        )}
        
         {/* Debt Impact */}
         {impacts.debt !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/70 shadow-sm ${impacts.debt < 0 ? 'border-accent-green/50' : 'border-accent-red/50'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('debt')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.debt < 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {impacts.debt > 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
              {impacts.debt > 0 ? '+' : ''}{impacts.debt}
            </div>
          </div>
        )}
      </div>

      {/* Primary CTA Button */}
      <button
        onClick={handleNextClick}
        className="w-full bg-brand text-white py-5 rounded-btn font-bold text-h3 shadow-btn hover:shadow-btn-hover hover:-translate-y-0.5 transition-all flex items-center justify-center group mt-2"
      >
        {t('next_turn')} <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="h-4" />
    </div>
  );
};