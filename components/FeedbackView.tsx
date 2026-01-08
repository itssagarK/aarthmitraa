import React from 'react';
import { GameEvent, Language } from '../types';
import { getTranslation } from '../translations';
import { TrendingUp, TrendingDown, Heart, Smile, ArrowRight, IndianRupee } from 'lucide-react';

interface FeedbackViewProps {
  lastEvent: GameEvent;
  language: Language;
  onNext: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ lastEvent, language, onNext }) => {
  const impacts = lastEvent.impact_on_stats;
  if (!impacts) return null;

  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="flex flex-col gap-6 animate-fade-in min-h-[50vh] justify-center">
      
      {/* Result Story Card */}
      <div className="glass-card p-6 rounded-card text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-accent-yellow/20 text-brand text-caption font-bold tracking-wide uppercase mb-4">
          Result
        </div>
        <h2 className="text-h1 text-brand mb-3">
          {lastEvent.previous_outcome_title || "Done!"}
        </h2>
        <p className="text-body text-neutral-soft leading-relaxed">
          {lastEvent.previous_outcome_desc}
        </p>
      </div>

      {/* Stat Changes Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Savings Impact */}
        {impacts.savings !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/60 ${impacts.savings > 0 ? 'border-accent-green' : 'border-accent-red'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('savings')}</span>
            <div className={`text-h3 font-bold flex items-center ${impacts.savings > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              <IndianRupee className="w-4 h-4 mr-1" />
              {impacts.savings > 0 ? '+' : ''}{impacts.savings}
            </div>
          </div>
        )}

        {/* Happiness Impact */}
        {impacts.happiness !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/60 ${impacts.happiness > 0 ? 'border-accent-yellow' : 'border-neutral-soft'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('happiness')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.happiness > 0 ? 'text-accent-yellow' : 'text-neutral-soft'}`}>
              <Smile className="w-5 h-5 mr-1" />
              {impacts.happiness > 0 ? '+' : ''}{impacts.happiness}%
            </div>
          </div>
        )}

         {/* Health Impact */}
         {impacts.health !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/60 ${impacts.health > 0 ? 'border-accent-pink' : 'border-accent-red'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('health')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.health > 0 ? 'text-accent-pink' : 'text-accent-red'}`}>
              <Heart className="w-5 h-5 mr-1" />
              {impacts.health > 0 ? '+' : ''}{impacts.health}%
            </div>
          </div>
        )}
        
         {/* Debt Impact */}
         {impacts.debt !== 0 && (
          <div className={`p-4 rounded-card border flex flex-col items-center justify-center bg-white/60 ${impacts.debt < 0 ? 'border-accent-green' : 'border-accent-red'}`}>
            <span className="text-caption font-bold uppercase text-neutral-soft mb-1">{t('debt')}</span>
             <div className={`text-h3 font-bold flex items-center ${impacts.debt < 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {impacts.debt > 0 ? <TrendingDown className="w-5 h-5 mr-1" /> : <TrendingUp className="w-5 h-5 mr-1" />}
              {impacts.debt > 0 ? '+' : ''}{impacts.debt}
            </div>
          </div>
        )}
      </div>

      {/* Primary CTA Button */}
      <button
        onClick={onNext}
        className="w-full bg-brand text-white py-4 rounded-btn font-bold text-body shadow-btn hover:shadow-btn-hover hover:-translate-y-0.5 transition-all flex items-center justify-center group"
      >
        {t('next_turn')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};