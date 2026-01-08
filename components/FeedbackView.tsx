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
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
      
      {/* Celebration Header */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="inline-block px-4 py-1.5 rounded-full bg-peach-100 text-peach-700 text-sm font-bold tracking-wide uppercase mb-3 shadow-sm">
          Result
        </div>
        <h2 className="text-3xl font-extrabold text-earth-900 leading-tight mb-2">
          {lastEvent.previous_outcome_title || "Done!"}
        </h2>
        <p className="text-earth-600 font-medium text-lg">
          {lastEvent.previous_outcome_desc}
        </p>
      </div>

      {/* Stat Changes Cards */}
      <div className="grid grid-cols-2 gap-4 w-full mb-10">
        
        {/* Savings Impact */}
        {impacts.savings !== 0 && (
          <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center shadow-sm ${impacts.savings > 0 ? 'bg-growth-50 border-growth-200' : 'bg-debt-50 border-debt-200'}`}>
            <span className="text-xs font-bold uppercase opacity-60 mb-1">{t('savings')}</span>
            <div className={`text-xl font-black flex items-center ${impacts.savings > 0 ? 'text-growth-700' : 'text-debt-700'}`}>
              <IndianRupee className="w-4 h-4 mr-1" />
              {impacts.savings > 0 ? '+' : ''}{impacts.savings}
            </div>
          </div>
        )}

        {/* Happiness Impact */}
        {impacts.happiness !== 0 && (
          <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center shadow-sm ${impacts.happiness > 0 ? 'bg-peach-50 border-peach-200' : 'bg-gray-50 border-gray-200'}`}>
            <span className="text-xs font-bold uppercase opacity-60 mb-1">{t('happiness')}</span>
             <div className={`text-xl font-black flex items-center ${impacts.happiness > 0 ? 'text-peach-600' : 'text-gray-600'}`}>
              <Smile className="w-5 h-5 mr-1" />
              {impacts.happiness > 0 ? '+' : ''}{impacts.happiness}
            </div>
          </div>
        )}

         {/* Health Impact */}
         {impacts.health !== 0 && (
          <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center shadow-sm ${impacts.health > 0 ? 'bg-warmTeal-50 border-warmTeal-200' : 'bg-debt-50 border-debt-200'}`}>
            <span className="text-xs font-bold uppercase opacity-60 mb-1">{t('health')}</span>
             <div className={`text-xl font-black flex items-center ${impacts.health > 0 ? 'text-warmTeal-600' : 'text-debt-600'}`}>
              <Heart className="w-5 h-5 mr-1" />
              {impacts.health > 0 ? '+' : ''}{impacts.health}
            </div>
          </div>
        )}
        
         {/* Debt Impact */}
         {impacts.debt !== 0 && (
          <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center shadow-sm ${impacts.debt < 0 ? 'bg-growth-50 border-growth-200' : 'bg-debt-50 border-debt-200'}`}>
            <span className="text-xs font-bold uppercase opacity-60 mb-1">{t('debt')}</span>
             <div className={`text-xl font-black flex items-center ${impacts.debt < 0 ? 'text-growth-600' : 'text-debt-600'}`}>
              {impacts.debt > 0 ? <TrendingDown className="w-5 h-5 mr-1" /> : <TrendingUp className="w-5 h-5 mr-1" />}
              {impacts.debt > 0 ? '+' : ''}{impacts.debt}
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full bg-earth-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all flex items-center justify-center group"
      >
        {t('next_turn')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};
